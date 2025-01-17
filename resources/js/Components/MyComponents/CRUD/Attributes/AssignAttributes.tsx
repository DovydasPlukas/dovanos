import React, { useState, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { Check, ChevronsUpDown, Trash } from 'lucide-react';
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
  CommandList,
} from '@/Components/ui/command';
import { Label } from '@/Components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from '@/Components/MyComponents/DataTable';

interface Vendor {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  vendor_id: number;
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

interface ItemAttribute {
  id: number;
  item_id: number;
  attribute_id: number;
  attribute: Attribute;
}

export default function AssignAttributes() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [attributeGroups, setAttributeGroups] = useState<AttributeGroup[]>([]);
  const [itemAttributes, setItemAttributes] = useState<ItemAttribute[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<AttributeGroup | null>(null);
  const [loading, setLoading] = useState({
    vendors: true,
    items: true,
    attributes: true,
    groups: true,
  });
  const [openVendor, setOpenVendor] = useState(false);
  const [openItem, setOpenItem] = useState(false);
  const [open, setOpen] = useState({
    attribute: false,
    group: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadVendors();
    loadItems();
    loadAttributeGroups();
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

  const loadItems = async (vendorId?: number) => {
    try {
      setLoading(prev => ({ ...prev, items: true }));
      const response = await axios.get('/items');
      const itemData = response.data.data || response.data;
      setItems(Array.isArray(itemData) ? (vendorId ? itemData.filter((item: Item) => item.vendor_id === vendorId) : itemData) : []);
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

  const loadAttributes = async (groupId: number) => {
    try {
      setLoading(prev => ({ ...prev, attributes: true }));
      const response = await axios.get(`/api/attributes/group/${groupId}`);
      const attributeData = response.data || [];
      setAttributes(Array.isArray(attributeData) ? attributeData : []);
    } catch (error) {
      console.error('Error loading attributes:', error);
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Nepavyko užkrauti požymių",
      });
      setAttributes([]);
    } finally {
      setLoading(prev => ({ ...prev, attributes: false }));
    }
  };

  const loadAttributeGroups = async () => {
    try {
      setLoading(prev => ({ ...prev, groups: true }));
      const response = await axios.get('/api/attributes/groups');
      const groupData = response.data || [];
      setAttributeGroups(Array.isArray(groupData) ? groupData : []);
    } catch (error) {
      console.error('Error loading attribute groups:', error);
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Nepavyko užkrauti požymių grupių",
      });
      setAttributeGroups([]);
    } finally {
      setLoading(prev => ({ ...prev, groups: false }));
    }
  };

  const loadItemAttributes = async (itemId: number) => {
    try {
      const response = await axios.get(`/item-attributes/${itemId}`);
      setItemAttributes(response.data);
    } catch (error) {
      console.error('Error loading item attributes:', error);
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Nepavyko užkrauti priskirtų požymių",
      });
    }
  };

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setSelectedItem(null);
    loadItems(vendor.id);
  };

  const handleItemSelect = (item: Item) => {
    setSelectedItem(item);
    loadItemAttributes(item.id);
  };

  const handleGroupSelect = (group: AttributeGroup) => {
    setSelectedGroup(group);
    loadAttributes(group.id);
  };

  const handleSave = async () => {
    if (!selectedItem || !selectedAttribute) {
      toast({
        variant: "destructive",
        description: "Pasirinkite prekę ir požymį",
      });
      return;
    }

    try {
      await axios.post('/item-attributes', {
        item_id: selectedItem.id,
        attribute_id: selectedAttribute.id,
      });
      toast({
        description: "Požymis sėkmingai priskirtas prekei",
      });
      loadItemAttributes(selectedItem.id);
    } catch (error) {
      console.error('Error saving attribute:', error);
      toast({
        variant: "destructive",
        description: "Nepavyko priskirti požymio prekei",
      });
    }
  };

  const handleRemoveAttribute = async (itemAttributeId: number) => {
    try {
      await axios.delete(`/item-attributes/${itemAttributeId}`);
      toast({
        description: "Požymis sėkmingai pašalintas",
      });
      if (selectedItem) {
        loadItemAttributes(selectedItem.id);
      }
    } catch (error) {
      console.error('Error removing attribute:', error);
      toast({
        variant: "destructive",
        description: "Nepavyko pašalinti požymio",
      });
    }
  };

  const columns: ColumnDef<ItemAttribute>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "attribute.name",
      header: "Požymis",
    },
    {
      id: "actions",
      header: "Veiksmai",
      cell: ({ row }) => {
        const itemAttribute = row.original;
        return (
          <Button
            variant="destructive"
            onClick={() => handleRemoveAttribute(itemAttribute.id)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Pašalinti
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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
                disabled={loading.items}
              >
                {loading.items ? (
                  "Kraunasi..."
                ) : (
                  <>
                    {selectedItem ? `${selectedItem.id} - ${selectedItem.name}` : "Pasirinkite prekę..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </>
                )}
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
                          handleItemSelect(item);
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

        {/* Attribute Group Selection */}
        <div className="space-y-2">
          <Label htmlFor="group-select">Pasirinkti požymio grupę</Label>
          <Popover open={open.group} onOpenChange={(o) => setOpen({ ...open, group: o })}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open.group}
                className="w-full justify-between"
                disabled={loading.groups}
              >
                {loading.groups ? (
                  "Kraunasi..."
                ) : (
                  <>
                    {selectedGroup ? selectedGroup.name : "Pasirinkite požymio grupę..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Ieškoti požymio grupės..." />
                <CommandList>
                  <CommandEmpty>Požymio grupė nerasta.</CommandEmpty>
                  <CommandGroup>
                    {attributeGroups.map((group) => (
                      <CommandItem
                        key={group.id}
                        onSelect={() => {
                          handleGroupSelect(group);
                          setOpen({ ...open, group: false });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedGroup?.id === group.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {group.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Attribute Selection */}
        <div className="space-y-2">
          <Label htmlFor="attribute-select">Pasirinkti požymį</Label>
          <Popover open={open.attribute} onOpenChange={(o) => setOpen({ ...open, attribute: o })}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open.attribute}
                className="w-full justify-between"
                disabled={loading.attributes}
              >
                {loading.attributes ? (
                  "Kraunasi..."
                ) : (
                  <>
                    {selectedAttribute ? selectedAttribute.name : "Pasirinkite požymį..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Ieškoti požymio..." />
                <CommandList>
                  <CommandEmpty>Požymis nerastas.</CommandEmpty>
                  <CommandGroup>
                    {attributes.map((attribute) => (
                      <CommandItem
                        key={attribute.id}
                        onSelect={() => {
                          setSelectedAttribute(attribute);
                          setOpen({ ...open, attribute: false });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedAttribute?.id === attribute.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {attribute.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button onClick={handleSave} className="w-full md:w-auto">
        Priskirti požymį
      </Button>

      {selectedItem && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Priskirti požymiai prekei "{selectedItem.name}"</h2>
          <DataTable columns={columns} data={itemAttributes} />
        </div>
      )}
    </div>
  );
}
