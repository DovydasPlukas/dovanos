import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/Components/ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/Components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import { Alert, AlertTitle, AlertDescription } from '@/Components/ui/alert';

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  vendor: {
    name: string;
  };
  product_url: string;
}

interface ItemFormData {
  name: string;
  description: string;
  price: number;
  vendor_id: number;
  product_url: string;
  image_url: string;
}

const ItemsCrud: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<ItemFormData>({
    name: '',
    description: '',
    price: 0,
    vendor_id: 0,
    product_url: '',
    image_url: '',
  });
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [vendors, setVendors] = useState<{ id: number; name: string }[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<{ id: number; name: string } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [alert, setAlert] = useState<{ type: 'added' | 'edited'; message: string } | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const fetchItems = async () => {
    try {
      const response = await axios.get<{ data: Item[] }>('/items');
      setItems(response.data.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get<{ data: { id: number; name: string }[] }>('/vendors');
      setVendors(response.data.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchVendors();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newItem).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    if (imageFile) {
      formData.append('image_url', imageFile);
    } else if (newItem.image_url && newItem.image_url.startsWith('http')) {
      formData.append('image_url', newItem.image_url);
    }

    try {
      await axios.post('/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchItems();
      setNewItem({ name: '', description: '', price: 0, vendor_id: 0, product_url: '', image_url: '' });
      setImageFile(null);
      setErrors({});
      setAlert({ type: 'added', message: 'Item added successfully!' });
      setIsAddDialogOpen(false);
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error('Error adding item:', error);
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const formData = new FormData();
    Object.entries(editingItem).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'image_url') {
        formData.append(key, value.toString());
      }
    });
    if (imageFile) {
      formData.append('image_url', imageFile);
    } else if (editingItem.image_url && editingItem.image_url.startsWith('http')) {
      formData.append('image_url', editingItem.image_url);
    }

    try {
      await axios.post(`/items/${editingItem.id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'X-HTTP-Method-Override': 'PUT'
        }
      });
      fetchItems();
      setEditingItem(null);
      setImageFile(null);
      setErrors({});
      setAlert({ type: 'edited', message: 'Item edited successfully!' });
      setIsEditDialogOpen(false);
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error('Error updating item:', error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/items/${id}`);
        fetchItems();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().includes(searchTerm)
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Items CRUD</h1>
      
      {alert && (
        <Alert variant="default" className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <AlertTitle>{alert.type === 'added' ? 'Success' : 'Updated'}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <Input
        type="text"
        placeholder="Search by name or ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4" onClick={() => setIsAddDialogOpen(true)}>Add New Item</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                required
              />
              {errors.name && <p className="text-red-500">{errors.name[0]}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                required
              />
              {errors.description && <p className="text-red-500">{errors.description[0]}</p>}
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                required
              />
              {errors.price && <p className="text-red-500">{errors.price[0]}</p>}
            </div>
            <div>
              <Label htmlFor="vendor_id">Vendor</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    {selectedVendor ? selectedVendor.name : 'Select Vendor'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search vendors..." />
                    <CommandList>
                      <CommandEmpty>No vendors found.</CommandEmpty>
                      <CommandGroup>
                        {vendors.map((vendor) => (
                          <CommandItem
                            key={vendor.id}
                            onSelect={() => {
                              setSelectedVendor(vendor);
                              setNewItem({ ...newItem, vendor_id: vendor.id });
                            }}
                          >
                            {vendor.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.vendor_id && <p className="text-red-500">{errors.vendor_id[0]}</p>}
            </div>
            <div>
              <Label htmlFor="product_url">Product URL</Label>
              <Input
                id="product_url"
                value={newItem.product_url}
                onChange={(e) => setNewItem({ ...newItem, product_url: e.target.value })}
                required
              />
              {errors.product_url && <p className="text-red-500">{errors.product_url[0]}</p>}
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageChange}
              />
              <Input
                id="image_url"
                placeholder="Or enter image URL"
                value={newItem.image_url}
                onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
              />
              {errors.image_url && <p className="text-red-500">{errors.image_url[0]}</p>}
            </div>
            <Button type="submit">Add Item</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Vendor</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.vendor.name}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2" onClick={() => handleEditClick(item)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  required
                />
                {errors.name && <p className="text-red-500">{errors.name[0]}</p>}
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  required
                />
                {errors.description && <p className="text-red-500">{errors.description[0]}</p>}
              </div>
              <div>
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                  required
                />
                {errors.price && <p className="text-red-500">{errors.price[0]}</p>}
              </div>
              <div>
                <Label htmlFor="edit-vendor_name">Vendor</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {editingItem.vendor.name}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search vendors..." />
                      <CommandList>
                        <CommandEmpty>No vendors found.</CommandEmpty>
                        <CommandGroup>
                          {vendors.map((vendor) => (
                            <CommandItem
                              key={vendor.id}
                              onSelect={() => {
                                setEditingItem({ ...editingItem, vendor: { ...editingItem.vendor, name: vendor.name } });
                              }}
                            >
                              {vendor.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.vendor_id && <p className="text-red-500">{errors.vendor_id[0]}</p>}
              </div>
              <div>
                <Label htmlFor="edit-product_url">Product URL</Label>
                <Input
                  id="edit-product_url"
                  value={editingItem.product_url}
                  onChange={(e) => setEditingItem({ ...editingItem, product_url: e.target.value })}
                  required
                />
                {errors.product_url && <p className="text-red-500">{errors.product_url[0]}</p>}
              </div>
              <div>
                <Label htmlFor="edit-image">Image</Label>
                {editingItem.image_url && (
                  <div>
                    <img
                      src={editingItem.image_url.startsWith('http') ? editingItem.image_url : `/storage/${editingItem.image_url}`}
                      alt={editingItem.name}
                      className="w-16 h-16 object-cover"
                    />
                    <Button variant="outline" onClick={() => setEditingItem({ ...editingItem, image_url: '' })}>
                      Change Image
                    </Button>
                  </div>
                )}
                {!editingItem.image_url && (
                  <>
                    <Input
                      id="edit-image"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <Input
                      id="edit-image_url"
                      placeholder="Or enter image URL"
                      value={editingItem.image_url}
                      onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                    />
                  </>
                )}
                {errors.image_url && <p className="text-red-500">{errors.image_url[0]}</p>}
              </div>
              <Button type="submit">Update Item</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemsCrud;