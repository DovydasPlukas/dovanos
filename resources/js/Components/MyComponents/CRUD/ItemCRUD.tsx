import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
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
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/Components/ui/toaster";
import { DataTable } from "@/Components/MyComponents/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { RowsPerPageSelect } from "@/Components/MyComponents/RowsPerPageSelect";

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

const getImageUrl = (imageUrl: string) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) {
      return imageUrl;
  }
  return `${window.location.origin}/${imageUrl}`;
};

const ItemsCrud: React.FC = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(50);
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
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const fetchItems = async () => {
    try {
      const response = await axios.get<{ data: Item[] }>('/items');
      setItems(response.data.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast({
        variant: "destructive",
        description: "Nepavyko gauti prekių sąrašo",
      });
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
      if (key !== 'image_url') {
        formData.append(key, value.toString());
      }
    });
    if (imageFile) {
      formData.append('image_file', imageFile);
    } else if (newItem.image_url) {
      formData.append('image_url', newItem.image_url);
    }

    try {
      const response = await axios.post('/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchItems();
      setNewItem({ name: '', description: '', price: 0, vendor_id: 0, product_url: '', image_url: '' });
      setImageFile(null);
      setErrors({});
      setIsAddDialogOpen(false);
      toast({
        description: "Prekė sėkmingai pridėta",
      });
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
        toast({
          variant: "destructive",
          description: "Patikrinkite formos laukus",
        });
      } else {
        console.error('Error adding item:', error);
        toast({
          variant: "destructive",
          description: "Nepavyko pridėti prekės",
        });
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
      formData.append('image_file', imageFile);
    } else if (editingItem.image_url && editingItem.image_url.startsWith('http')) {
      formData.append('image_url', editingItem.image_url);
    }

    try {
      const response = await axios.post(`/items/${editingItem.id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'X-HTTP-Method-Override': 'PUT'
        }
      });
      fetchItems();
      setEditingItem(null);
      setImageFile(null);
      setErrors({});
      setIsEditDialogOpen(false);
      toast({
        description: "Prekė sėkmingai atnaujinta",
      });
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
        toast({
          variant: "destructive",
          description: "Patikrinkite formos laukus",
        });
      } else {
        console.error('Error updating item:', error);
        toast({
          variant: "destructive",
          description: "Nepavyko atnaujinti prekės",
        });
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/items/${id}`);
      fetchItems();
      setItemToDelete(null);
      toast({
        description: "Prekė sėkmingai ištrinta",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        variant: "destructive",
        description: "Nepavyko ištrinti prekės",
      });
    }
  };

  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().includes(searchTerm)
  );

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Pavadinimas",
    },
    {
      accessorKey: "price",
      header: "Kaina",
    },
    {
      accessorKey: "vendor.name",
      header: "Pardavėjas",
    },
    {
      accessorKey: "description",
      header: "Aprašymas",
    },
    {
      id: "actions",
      header: "Veiksmai",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleEditClick(row.original)}>
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
        <h1 className="text-2xl font-bold mb-4">Prekių valdymas</h1>
        
        {alert && (
          <Alert variant="default" className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <AlertTitle>{alert.type === 'added' ? 'Sėkmingai' : 'Atnaujinta'}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <Input
          type="text"
          placeholder="Ieškoti pagal pavadinimą arba ID"
          value={searchTerm}
          onChange={onSearch}
          className="mb-4"
        />

        <div className="flex justify-between items-center mb-4">
          <Button onClick={() => setIsAddDialogOpen(true)}>Pridėti naują prekę</Button>
          
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
              <DialogTitle>Pridėti naują prekę</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Pavadinimas</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                />
                {errors.name && <p className="text-red-500">{errors.name[0]}</p>}
              </div>
              <div>
                <Label htmlFor="description">Aprašymas</Label>
                <Input
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  required
                />
                {errors.description && <p className="text-red-500">{errors.description[0]}</p>}
              </div>
              <div>
                <Label htmlFor="price">Kaina</Label>
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
                <Label htmlFor="vendor_id">Pardavėjas</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {selectedVendor ? selectedVendor.name : 'Pasirinkti pardavėją'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Ieškoti pardavėjų..." />
                      <CommandList>
                        <CommandEmpty>Pardavėjų nerasta.</CommandEmpty>
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
                <Label htmlFor="product_url">Produkto URL</Label>
                <Input
                  id="product_url"
                  value={newItem.product_url}
                  onChange={(e) => setNewItem({ ...newItem, product_url: e.target.value })}
                  required
                />
                {errors.product_url && <p className="text-red-500">{errors.product_url[0]}</p>}
              </div>
              <div>
                <Label htmlFor="image">Nuotrauka</Label>
                <div className="space-y-2">
                  <Input
                    id="image_file"
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 px-2">ARBA</span>
                    <Input
                      id="image_url"
                      placeholder="Įveskite nuotraukos URL"
                      value={newItem.image_url}
                      onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                    />
                  </div>
                </div>
                {errors.image_url && <p className="text-red-500">{errors.image_url[0]}</p>}
              </div>
              <Button type="submit">Pridėti prekę</Button>
            </form>
          </DialogContent>
        </Dialog>

        <DataTable 
          columns={columns} 
          data={paginatedItems}
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <span>Pirmas</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <span>Atgal</span>
            </Button>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">
                Puslapis {currentPage} iš {totalPages}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <span>Pirmyn</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <span>Paskutinis</span>
            </Button>
          </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Redaguoti prekę</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Pavadinimas</Label>
                  <Input
                    id="edit-name"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    required
                  />
                  {errors.name && <p className="text-red-500">{errors.name[0]}</p>}
                </div>
                <div>
                  <Label htmlFor="edit-description">Aprašymas</Label>
                  <Input
                    id="edit-description"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    required
                  />
                  {errors.description && <p className="text-red-500">{errors.description[0]}</p>}
                </div>
                <div>
                  <Label htmlFor="edit-price">Kaina</Label>
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
                  <Label htmlFor="edit-vendor_name">Pardavėjas</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full">
                        {editingItem.vendor.name}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Ieškoti pardavėjų..." />
                        <CommandList>
                          <CommandEmpty>Pardavėjų nerasta.</CommandEmpty>
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
                  <Label htmlFor="edit-product_url">Produkto URL</Label>
                  <Input
                    id="edit-product_url"
                    value={editingItem.product_url}
                    onChange={(e) => setEditingItem({ ...editingItem, product_url: e.target.value })}
                    required
                  />
                  {errors.product_url && <p className="text-red-500">{errors.product_url[0]}</p>}
                </div>
                <div>
                  <Label htmlFor="edit-image">Nuotrauka</Label>
                  <div className="space-y-2">
                    <Input
                      id="edit-image-file"
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 px-2">ARBA</span>
                      <Input
                        id="edit-image-url"
                        placeholder="Įveskite nuotraukos URL"
                        defaultValue={editingItem.image_url}
                        onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                      />
                    </div>
                  </div>
                  {errors.image_url && <p className="text-red-500">{errors.image_url[0]}</p>}
                </div>
                <Button type="submit">Atnaujinti prekę</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ar tikrai norite ištrinti šią prekę?</DialogTitle>
              <DialogDescription>
                Šis veiksmas negrįžtamai ištrins prekę iš sistemos.
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

export default ItemsCrud;