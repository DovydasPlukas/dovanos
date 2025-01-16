import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/Components/ui/toaster";

interface Vendor {
  id: number;
  name: string;
  contact_details: string;
  website: string;
}

interface VendorFormData {
  name: string;
  contact_details: string;
  website: string;
}

const VendorsCrud: React.FC = () => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  const [newVendor, setNewVendor] = useState<VendorFormData>({
    name: '',
    contact_details: '',
    website: '',
  });
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchVendors = async () => {
    try {
      const response = await axios.get<{ data: Vendor[] }>('/vendors');
      setVendors(response.data.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        variant: "destructive",
        description: "Failed to fetch vendors",
      });
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/vendors', newVendor);
      fetchVendors();
      setNewVendor({ name: '', contact_details: '', website: '' });
      setIsAddDialogOpen(false);
      toast({
        description: "Vendor added successfully",
      });
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast({
        variant: "destructive",
        description: "Failed to add vendor",
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVendor) return;

    try {
      await axios.put(`/vendors/${editingVendor.id}`, editingVendor);
      fetchVendors();
      setEditingVendor(null);
      setIsEditDialogOpen(false);
      toast({
        description: "Vendor updated successfully",
      });
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast({
        variant: "destructive",
        description: "Failed to update vendor",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await axios.delete(`/vendors/${id}`);
        fetchVendors();
        toast({
          description: "Vendor deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting vendor:', error);
        toast({
          variant: "destructive",
          description: "Failed to delete vendor",
        });
      }
    }
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.id.toString().includes(searchTerm)
  );

  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Vendors CRUD</h1>
        
        <Input
          type="text"
          placeholder="Search by name or ID"
          value={searchTerm}
          onChange={onSearch}
          className="mb-4"
        />

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4" onClick={() => setIsAddDialogOpen(true)}>Add New Vendor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_details">Contact Details</Label>
                <Input
                  id="contact_details"
                  value={newVendor.contact_details}
                  onChange={(e) => setNewVendor({ ...newVendor, contact_details: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={newVendor.website}
                  onChange={(e) => setNewVendor({ ...newVendor, website: e.target.value })}
                  required
                />
              </div>
              <Button type="submit">Add Vendor</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Contact Details</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.id}</TableCell>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.contact_details}</TableCell>
                <TableCell>{vendor.website}</TableCell>
                <TableCell>
                  <Button variant="outline" className="mr-2" onClick={() => { setEditingVendor(vendor); setIsEditDialogOpen(true); }}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(vendor.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Atgal
            </Button>
            <span className="py-2">
              Puslapis {currentPage} iš {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Pirmyn
            </Button>
          </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Vendor</DialogTitle>
            </DialogHeader>
            {editingVendor && (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingVendor.name}
                    onChange={(e) => setEditingVendor({ ...editingVendor, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-contact_details">Contact Details</Label>
                  <Input
                    id="edit-contact_details"
                    value={editingVendor.contact_details}
                    onChange={(e) => setEditingVendor({ ...editingVendor, contact_details: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-website">Website</Label>
                  <Input
                    id="edit-website"
                    value={editingVendor.website}
                    onChange={(e) => setEditingVendor({ ...editingVendor, website: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">Update Vendor</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </>
  );
};

export default VendorsCrud;

