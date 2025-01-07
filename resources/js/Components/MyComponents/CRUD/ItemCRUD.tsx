import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  vendor_id: number;
  image_url: string | null;
}

interface Vendor {
  id: number;
  name: string;
}

export default function ItemsCrud() {
  const [items, setItems] = useState<Item[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [newItem, setNewItem] = useState<Omit<Item, 'id' | 'image_url'>>({
    name: '',
    description: '',
    price: 0,
    vendor_id: 0,
  });
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchItems();
    fetchVendors();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get('/vendors');
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingItem) {
      setEditingItem({ ...editingItem, [name]: name === 'price' ? parseFloat(value) : value });
    } else {
      setNewItem({ ...newItem, [name]: name === 'price' ? parseFloat(value) : value });
    }
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (editingItem) {
      formData.append('name', editingItem.name);
      formData.append('description', editingItem.description || '');
      formData.append('price', editingItem.price.toString());
      formData.append('vendor_id', editingItem.vendor_id.toString());
      if (imageFile) formData.append('image', imageFile);
      try {
        await axios.post(`/items/${editingItem.id}?_method=PUT`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        fetchItems();
        setEditingItem(null);
        setImageFile(null);
      } catch (error) {
        console.error('Error updating item:', error);
      }
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Items</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-4">
        <Input
          type="text"
          name="name"
          value={editingItem ? editingItem.name : newItem.name}
          onChange={handleInputChange}
          placeholder="Item Name"
          required
        />
        <Input
          type="text"
          name="description"
          value={editingItem ? editingItem.description : newItem.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <Input
          type="number"
          name="price"
          value={editingItem ? editingItem.price : newItem.price}
          onChange={handleInputChange}
          placeholder="Price"
          required
        />
        <select
          name="vendor_id"
          value={editingItem ? editingItem.vendor_id : newItem.vendor_id}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>Select Vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>
        <Input
          type="file"
          onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
          accept="image/*"
        />
        <Button type="submit">{editingItem ? 'Update Item' : 'Add Item'}</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>${item.price.toFixed(2)}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(item)}>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
