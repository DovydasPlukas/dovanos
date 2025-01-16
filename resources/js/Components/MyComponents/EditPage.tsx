import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/Components/ui/toaster";
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";

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
  vendor_name: string;  // Add this line
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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
        start_date: startDate,
        end_date: endDate,
      });
      fetchFeaturedItems();
      setSelectedItem(null);
      setStartDate('');
      setEndDate('');
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Featured Items</h1>
      
      <div className="mb-4">
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

      <div className="mb-4">
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

      <div className="mb-4">
        <Label htmlFor="start-date">Start Date</Label>
        <Input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="end-date">End Date</Label>
        <Input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <Button onClick={handleAddFeaturedItem}>Add Featured Item</Button>

      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>Item ID</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {featuredItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.item_id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.vendor_name}</TableCell>
              <TableCell>{item.start_date}</TableCell>
              <TableCell>{item.end_date}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleRemoveFeaturedItem(item.id)}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Toaster />
    </div>
  );
}