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
        description: "Please select an item and set start/end dates",
      });
      return;
    }

    if (featuredItems.length >= 5) {
      toast({
        variant: "destructive",
        description: "Maximum of 5 featured items allowed",
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
        description: "Featured item added successfully",
      });
    } catch (error) {
      console.error('Error adding featured item:', error);
      toast({
        variant: "destructive",
        description: "Failed to add featured item",
      });
    }
  };

  const handleRemoveFeaturedItem = async (id: number) => {
    try {
      await axios.delete(`/featured-items/${id}`);
      fetchFeaturedItems();
      toast({
        description: "Featured item removed successfully",
      });
    } catch (error) {
      console.error('Error removing featured item:', error);
      toast({
        variant: "destructive",
        description: "Failed to remove featured item",
      });
    }
  };

  const columns: ColumnDef<FeaturedItem>[] = [
    {
      accessorKey: "item_id",
      header: "Item ID",
      id: "Item ID",
    },
    {
      accessorKey: "name",
      header: "Item Name",
      id: "Item Name",
    },
    {
      accessorKey: "vendor_name",
      header: "Vendor",
      id: "Vendor Name",
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      id: "Start Date",
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      id: "End Date",
    },
    {
      id: "Actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button 
          variant="destructive" 
          onClick={() => handleRemoveFeaturedItem(row.original.id)}
          className="w-full md:w-auto"
        >
          Remove
        </Button>
      ),
    },
  ]

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Edit Featured Items</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Vendor Selection */}
        <div className="space-y-2">
          <Label htmlFor="vendor-select">Select Vendor</Label>
          <Popover open={openVendor} onOpenChange={setOpenVendor}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openVendor}
                className="w-full justify-between"
              >
                {selectedVendor ? selectedVendor.name : "Select vendor..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search vendor..." />
                <CommandList>
                  <CommandEmpty>No vendor found.</CommandEmpty>
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
          <Label htmlFor="item-select">Select Item</Label>
          <Popover open={openItem} onOpenChange={setOpenItem}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openItem}
                className="w-full justify-between"
                disabled={!selectedVendor}
              >
                {selectedItem ? `${selectedItem.id} - ${selectedItem.name}` : "Select item..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search item..." />
                <CommandList>
                  <CommandEmpty>No item found.</CommandEmpty>
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
          <Label>Start Date</Label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
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
          <Label>End Date</Label>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
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
        Add Featured Item
      </Button>

      <div className="overflow-x-auto">
        <DataTable columns={columns} data={featuredItems} />
      </div>
      <Toaster />
    </div>
  );
}