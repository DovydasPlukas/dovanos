import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/Components/ui/calendar";
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/Components/ui/toaster";
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { useReactTable, getCoreRowModel, ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/Components/MyComponents/DataTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";

interface Vendor {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  vendor_id: number;
}

interface FeaturedItem {
  id: number;
  item_id: number;
  name: string;
  vendor_name: string;
  start_date: string;
  end_date: string;
}

export default function EditPage() {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [openVendor, setOpenVendor] = useState(false);
  const [openItem, setOpenItem] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchVendors();
    fetchFeaturedItems();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get('/vendors');
      setVendors(response.data.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        variant: "destructive",
        description: "Failed to fetch vendors",
      });
    }
  };

  const fetchItems = async (vendorId: number) => {
    try {
      const response = await axios.get('/items');
      setItems(response.data.data.filter((item: Item) => item.vendor_id === vendorId));
    } catch (error) {
      console.error('Error fetching items:', error);
      toast({
        variant: "destructive",
        description: "Failed to fetch items",
      });
    }
  };

  const fetchFeaturedItems = async () => {
    try {
      const response = await axios.get('/featured-items');
      setFeaturedItems(response.data);
    } catch (error) {
      console.error('Error fetching featured items:', error);
      toast({
        variant: "destructive",
        description: "Failed to fetch featured items",
      });
    }
  };

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setSelectedItem(null);
    fetchItems(vendor.id);
  };

  const handleAddFeaturedItem = async () => {
    if (!selectedItem || !startDate || !endDate) {
      toast({
        variant: "destructive",
        description: "Pasirinkite prekę ir nustatykite pradžios/pabaigos datas",
      });
      return;
    }

    if (featuredItems.length >= 5) {
      toast({
        variant: "destructive",
        description: "Galima pridėti daugiausiai 5 iškeltas prekes",
      });
      return;
    }

    try {
      await axios.post('/featured-items', {
        item_id: selectedItem.id,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
      });
      fetchFeaturedItems();
      setSelectedItem(null);
      setStartDate(undefined);
      setEndDate(undefined);
      toast({
        description: "Prekė sėkmingai pridėta į iškeltas",
      });
    } catch (error) {
      console.error('Error adding featured item:', error);
      toast({
        variant: "destructive",
        description: "Nepavyko pridėti iškeltos prekės",
      });
    }
  };

  const handleRemoveFeaturedItem = async (id: number) => {
    try {
      await axios.delete(`/featured-items/${id}`);
      fetchFeaturedItems();
      setItemToDelete(null);
      toast({
        description: "Prekė sėkmingai pašalinta iš iškeltų",
      });
    } catch (error) {
      console.error('Error removing featured item:', error);
      toast({
        variant: "destructive",
        description: "Nepavyko pašalinti iškeltos prekės",
      });
    }
  };

  const handleReorder = async (id: number, direction: 'up' | 'down') => {
    try {
      await axios.post('/featured-items/reorder', {
        id,
        direction
      });
      fetchFeaturedItems();
      toast({
        description: "Pozicija sėkmingai pakeista",
      });
    } catch (error) {
      console.error('Error reordering featured item:', error);
      toast({
        variant: "destructive",
        description: "Nepavyko pakeisti pozicijos",
      });
    }
  };

  const columns: ColumnDef<FeaturedItem>[] = [
    {
      accessorKey: "item_id",
      header: "ID",
      id: "item_id",
    },
    {
      accessorKey: "name",
      header: "Pavadinimas",
      id: "name",
    },
    {
      accessorKey: "vendor_name",
      header: "Pardavėjas",
      id: "vendor_name",
    },
    {
      accessorKey: "start_date",
      header: "Pradžios data",
      id: "start_date",
    },
    {
      accessorKey: "end_date",
      header: "Pabaigos data",
      id: "end_date",
    },
    {
      id: "actions",
      header: "Veiksmai",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleReorder(row.original.id, 'up')}
            disabled={row.index === 0}
            className="px-2"
          >
            ↑
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleReorder(row.original.id, 'down')}
            disabled={row.index === featuredItems.length - 1}
            className="px-2"
          >
            ↓
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setItemToDelete(row.original.id)}
            className="w-full md:w-auto"
          >
            Pašalinti
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Iškeltų prekių valdymas</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Vendor Selection */}
        <div className="space-y-2">
          <Label htmlFor="vendor-select">Pasirinkti pardavėją</Label>
          <Popover open={openVendor} onOpenChange={setOpenVendor}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openVendor}
                className="w-full justify-between"
              >
                {selectedVendor ? selectedVendor.name : "Pasirinkite pardavėją..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Ieškoti pardavėjo..." />
                <CommandList>
                  <CommandEmpty>Pardavėjų nerasta</CommandEmpty>
                  <CommandGroup>
                    {vendors.map((vendor) => (
                      <CommandItem
                        key={vendor.id}
                        onSelect={() => {
                          handleVendorSelect(vendor);
                          setOpenVendor(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedVendor?.id === vendor.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {vendor.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Item Selection */}
        <div className="space-y-2">
          <Label htmlFor="item-select">Pasirinkti prekę</Label>
          <Popover open={openItem} onOpenChange={setOpenItem}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openItem}
                className="w-full justify-between"
                disabled={!selectedVendor}
              >
                {selectedItem ? `${selectedItem.id} - ${selectedItem.name}` : "Pasirinkite prekę..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Ieškoti prekės..." />
                <CommandList>
                  <CommandEmpty>Prekių nerasta</CommandEmpty>
                  <CommandGroup>
                    {items.map((item) => (
                      <CommandItem
                        key={item.id}
                        onSelect={() => {
                          setSelectedItem(item);
                          setOpenItem(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedItem?.id === item.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {`${item.id} - ${item.name}`}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Date Selection */}
        <div className="space-y-2">
          <Label>Pradžios data</Label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pasirinkite datą</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  setStartDateOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Pabaigos data</Label>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pasirinkite datą</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  setEndDateOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button onClick={handleAddFeaturedItem} className="w-full md:w-auto">
        Pridėti iškeltą prekę
      </Button>

      <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ar tikrai norite pašalinti šią prekę?</DialogTitle>
            <DialogDescription>
              Šis veiksmas pašalins prekę iš iškeltų prekių sąrašo.
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
              onClick={() => itemToDelete && handleRemoveFeaturedItem(itemToDelete)}
            >
              Pašalinti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto">
        <DataTable columns={columns} data={featuredItems} />
      </div>
      <Toaster />
    </div>
  );
}