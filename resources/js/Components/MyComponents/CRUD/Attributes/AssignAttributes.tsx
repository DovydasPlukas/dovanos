import React, { useState, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/Components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/Components/ui/command';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

interface Vendor {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  vendor: string;
}

interface Attribute {
  id: number;
  name: string;
  group_id: number;
}

interface AttributeGroup {
  id: number;
  name: string;
}

export default function AssignAttributes() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [attributeGroups, setAttributeGroups] = useState<AttributeGroup[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [selectedAttribute, setSelectedAttribute] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [loading, setLoading] = useState({
    vendors: true,
    items: true,
  });
  const [open, setOpen] = useState({
    item: false,
    vendor: false,
    attribute: false,
    group: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadVendors();
    loadItems();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(prev => ({ ...prev, vendors: true }));
      const response = await axios.get('/vendors');
      const vendorData = response.data.data || response.data;
      setVendors(Array.isArray(vendorData) ? vendorData : []);
    } catch (error) {
      console.error('Error loading vendors:', error);
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Nepavyko užkrauti pardavėjų",
      });
      setVendors([]);
    } finally {
      setLoading(prev => ({ ...prev, vendors: false }));
    }
  };

  const loadItems = async () => {
    try {
      setLoading(prev => ({ ...prev, items: true }));
      const response = await axios.get('/items');
      const itemData = response.data.data || response.data;
      setItems(Array.isArray(itemData) ? itemData : []);
    } catch (error) {
      console.error('Error loading items:', error);
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Nepavyko užkrauti prekių",
      });
      setItems([]);
    } finally {
      setLoading(prev => ({ ...prev, items: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Vendor ComboBox */}
        <Popover open={open.vendor} onOpenChange={(o) => setOpen({ ...open, vendor: o })}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open.vendor}
              className="justify-between"
              disabled={loading.vendors}
            >
              {loading.vendors ? (
                "Kraunasi..."
              ) : (
                <>
                  {selectedVendor || "Pasirinkite pardavėją..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Ieškoti pardavėjo..." />
              <CommandEmpty>Pardavėjas nerastas.</CommandEmpty>
              <CommandGroup>
                {vendors.map((vendor) => (
                  <CommandItem
                    key={vendor.id}
                    onSelect={() => {
                      setSelectedVendor(vendor.name);
                      setOpen({ ...open, vendor: false });
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedVendor === vendor.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {vendor.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Item ComboBox */}
        {/* ...similar structure for items... */}
      </div>
      {/* Add the rest of your UI components */}
    </div>
  );
}
