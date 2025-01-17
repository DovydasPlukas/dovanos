import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/Components/ui/toaster";
import { DataTable } from "@/Components/MyComponents/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { RowsPerPageSelect } from "@/Components/MyComponents/RowsPerPageSelect";

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
  const [itemsPerPage, setItemsPerPage] = useState<number>(50);
  const [newVendor, setNewVendor] = useState<VendorFormData>({
    name: '',
    contact_details: '',
    website: '',
  });
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const fetchVendors = async () => {
    try {
      const response = await axios.get<{ data: Vendor[] }>('/vendors');
      setVendors(response.data.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        variant: "destructive",
        description: "Nepavyko gauti pardavėjų sąrašo",
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
        description: "Pardavėjas sėkmingai pridėtas",
      });
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast({
        variant: "destructive",
        description: "Nepavyko pridėti pardavėjo",
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
        description: "Pardavėjas sėkmingai atnaujintas",
      });
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast({
        variant: "destructive",
        description: "Nepavyko atnaujinti pardavėjo",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/vendors/${id}`);
      fetchVendors();
      setItemToDelete(null);
      toast({
        description: "Pardavėjas sėkmingai ištrintas",
      });
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        variant: "destructive",
        description: "Nepavyko ištrinti pardavėjo",
      });
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

  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Pavadinimas",
    },
    {
      accessorKey: "contact_details",
      header: "Kontaktinė informacija",
    },
    {
      accessorKey: "website",
      header: "Svetainės adresas",
    },
    {
      id: "actions",
      header: "Veiksmai",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setEditingVendor(row.original); setIsEditDialogOpen(true); }}>
            Redaguoti
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setItemToDelete(row.original.id)}
          >
            Ištrinti
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Pardavėjų valdymas</h1>
        
        <Input
          type="text"
          placeholder="Ieškoti pagal pavadinimą arba ID"
          value={searchTerm}
          onChange={onSearch}
          className="mb-4"
        />

        <div className="flex justify-between items-center mb-4">
          <Button onClick={() => setIsAddDialogOpen(true)}>Pridėti naują pardavėją</Button>
          
          <RowsPerPageSelect
            value={itemsPerPage}
            onChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pridėti naują pardavėją</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Pavadinimas</Label>
                <Input
                  id="name"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_details">Kontaktinė informacija</Label>
                <Input
                  id="contact_details"
                  value={newVendor.contact_details}
                  onChange={(e) => setNewVendor({ ...newVendor, contact_details: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="website">Svetainės adresas</Label>
                <Input
                  id="website"
                  value={newVendor.website}
                  onChange={(e) => setNewVendor({ ...newVendor, website: e.target.value })}
                  required
                />
              </div>
              <Button type="submit">Pridėti pardavėją</Button>
            </form>
          </DialogContent>
        </Dialog>

        <DataTable 
          columns={columns} 
          data={paginatedVendors}
        />

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
              <DialogTitle>Redaguoti pardavėją</DialogTitle>
            </DialogHeader>
            {editingVendor && (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Pavadinimas</Label>
                  <Input
                    id="edit-name"
                    value={editingVendor.name}
                    onChange={(e) => setEditingVendor({ ...editingVendor, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-contact_details">Kontaktinė informacija</Label>
                  <Input
                    id="edit-contact_details"
                    value={editingVendor.contact_details}
                    onChange={(e) => setEditingVendor({ ...editingVendor, contact_details: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-website">Svetainės adresas</Label>
                  <Input
                    id="edit-website"
                    value={editingVendor.website}
                    onChange={(e) => setEditingVendor({ ...editingVendor, website: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">Atnaujinti pardavėją</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ar tikrai norite ištrinti šį pardavėją?</DialogTitle>
              <DialogDescription>
                Šis veiksmas negrįžtamai ištrins pardavėją iš sistemos.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setItemToDelete(null)}
              >
                Atšaukti
              </Button>
              <Button
                variant="destructive"
                onClick={() => itemToDelete && handleDelete(itemToDelete)}
              >
                Ištrinti
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </>
  );
};

export default VendorsCrud;

