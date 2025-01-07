import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';

interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function VendorsCrud() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [newVendor, setNewVendor] = useState<Omit<Vendor, 'id'>>({ name: '', email: '', phone: '' });
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get('/vendors');
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingVendor) {
      setEditingVendor({ ...editingVendor, [name]: value });
    } else {
      setNewVendor({ ...newVendor, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVendor) {
        await axios.put(`/vendors/${editingVendor.id}`, editingVendor);
      } else {
        await axios.post('/vendors', newVendor);
      }
      fetchVendors();
      setNewVendor({ name: '', email: '', phone: '' });
      setEditingVendor(null);
    } catch (error) {
      console.error('Error saving vendor:', error);
    }
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/vendors/${id}`);
      fetchVendors();
    } catch (error) {
      console.error('Error deleting vendor:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Vendors</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-4">
        <Input
          type="text"
          name="name"
          value={editingVendor ? editingVendor.name : newVendor.name}
          onChange={handleInputChange}
          placeholder="Vendor Name"
          required
        />
        <Input
          type="email"
          name="email"
          value={editingVendor ? editingVendor.email : newVendor.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <Input
          type="tel"
          name="phone"
          value={editingVendor ? editingVendor.phone : newVendor.phone}
          onChange={handleInputChange}
          placeholder="Phone"
          required
        />
        <Button type="submit">{editingVendor ? 'Update Vendor' : 'Add Vendor'}</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell>{vendor.name}</TableCell>
              <TableCell>{vendor.email}</TableCell>
              <TableCell>{vendor.phone}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(vendor)} className="mr-2">Edit</Button>
                <Button onClick={() => handleDelete(vendor.id)} variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

