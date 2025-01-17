import React, { useState, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { Check, ChevronsUpDown, Trash } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/Components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';
import { Label } from '@/Components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil } from 'lucide-react';
import { DataTable } from '@/Components/MyComponents/DataTable';

interface AttributeGroup {
  id: number;
  name: string;
}

interface Attribute {
  id: number;
  name: string;
  group_id: number;
}

export default function CreateAttributes() {
  const [attributeGroups, setAttributeGroups] = useState<AttributeGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<AttributeGroup | null>(null);
  const [open, setOpen] = useState({
    group: false,
    createDialog: false,
    createAttributeDialog: false,
    editAttributeDialog: false,
    editGroupDialog: false,
  });
  const [newGroupName, setNewGroupName] = useState('');
  const [loading, setLoading] = useState(true);
  const [groupToDelete, setGroupToDelete] = useState<AttributeGroup | null>(null);
  const { toast } = useToast();
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [attributeToDelete, setAttributeToDelete] = useState<Attribute | null>(null);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
  const [editingGroup, setEditingGroup] = useState<AttributeGroup | null>(null);
  const [newAttributeName, setNewAttributeName] = useState('');

  useEffect(() => {
    loadAttributeGroups();
  }, []);

  const loadAttributeGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/attributes/groups');
      const groups = Array.isArray(response.data) ? response.data : [];
      setAttributeGroups(groups);
    } catch (error) {
      console.error('Error loading groups:', error);
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Nepavyko užkrauti grupių",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Įveskite grupės pavadinimą",
      });
      return;
    }

    try {
      await axios.post('/api/attributes/groups', { name: newGroupName });
      await loadAttributeGroups();
      setNewGroupName('');
      setOpen(prev => ({ ...prev, createDialog: false }));
      
      toast({
        title: "Sėkmingai sukurta",
        description: "Atributų grupė sėkmingai sukurta",
      });
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Nepavyko sukurti grupės",
      });
    }
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;

    try {
      await axios.delete(`/api/attributes/groups/${groupToDelete.id}`);
      setSelectedGroup(null);
      setGroupToDelete(null);
      await loadAttributeGroups();
      
      toast({
        title: "Sėkmingai ištrinta",
        description: "Atributų grupė sėkmingai ištrinta",
      });
    } catch (error: any) {
      console.error('Error deleting group:', error);
      toast({
        variant: "destructive",
        title: "Klaida",
        description: error.response?.data?.message || "Nepavyko ištrinti grupės",
      });
    }
  };

  const loadAttributesByGroup = async (groupId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/attributes/group/${groupId}`);
      setAttributes(response.data);
    } catch (error) {
      console.error('Error loading attributes:', error);
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Nepavyko užkrauti atributų",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAttribute = async () => {
    if (!selectedGroup || !newAttributeName.trim()) {
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Įveskite atributo pavadinimą ir pasirinkite grupę",
      });
      return;
    }

    try {
      const response = await axios.post('/api/attributes', {
        name: newAttributeName,
        attribute_group_id: selectedGroup.id,
      });
      
      if (response.data) {
        setNewAttributeName('');
        setOpen(prev => ({ ...prev, createAttributeDialog: false }));
        await loadAttributesByGroup(selectedGroup.id);
        toast({
          title: "Sėkmingai sukurta",
          description: "Atributas sėkmingai sukurtas",
        });
      }
    } catch (error: any) {
      console.error('Error creating attribute:', error);
      toast({
        variant: "destructive",
        title: "Klaida",
        description: error.response?.data?.message || "Nepavyko sukurti atributo",
      });
    }
  };

  const handleEditAttribute = async () => {
    if (!editingAttribute) return;

    try {
      await axios.put(`/api/attributes/${editingAttribute.id}`, {
        name: editingAttribute.name,
      });
      setOpen(prev => ({ ...prev, editAttributeDialog: false }));
      await loadAttributesByGroup(selectedGroup!.id);
      toast({
        title: "Sėkmingai atnaujinta",
        description: "Atributas sėkmingai atnaujintas",
      });
    } catch (error) {
      console.error('Error updating attribute:', error);
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Nepavyko atnaujinti atributo",
      });
    }
  };

  const handleDeleteAttribute = async () => {
    if (!attributeToDelete) return;

    try {
      await axios.delete(`/api/attributes/${attributeToDelete.id}`);
      setAttributeToDelete(null);
      await loadAttributesByGroup(selectedGroup!.id);
      toast({
        title: "Sėkmingai ištrinta",
        description: "Atributas sėkmingai ištrintas",
      });
    } catch (error) {
      console.error('Error deleting attribute:', error);
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Nepavyko ištrinti atributo",
      });
    }
  };

  const handleEditGroup = async () => {
    if (!editingGroup) return;

    try {
      await axios.put(`/api/attributes/groups/${editingGroup.id}`, {
        name: editingGroup.name,
      });
      setOpen(prev => ({ ...prev, editGroupDialog: false }));
      await loadAttributeGroups();
      // Update selected group name if editing current group
      if (selectedGroup?.id === editingGroup.id) {
        setSelectedGroup({ ...selectedGroup, name: editingGroup.name });
      }
      toast({
        title: "Sėkmingai atnaujinta",
        description: "Grupė sėkmingai atnaujinta",
      });
    } catch (error) {
      console.error('Error updating group:', error);
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Nepavyko atnaujinti grupės",
      });
    }
  };

  const columns: ColumnDef<Attribute>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
      accessorKey: "name",
      header: "Pavadinimas",
    },
    {
      id: "actions",
      header: "Veiksmai",
      cell: ({ row }) => {
        const attribute = row.original;
        return (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setEditingAttribute(attribute);
                setOpen(prev => ({ ...prev, editAttributeDialog: true }));
              }}
            >
              Redaguoti
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setAttributeToDelete(attribute)}
            >
              Ištrinti
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Group selection section */}
      <div className="flex gap-4 items-end">
        <div className="space-y-2 flex-1">
          <Label>Pasirinkti atributų grupę</Label>
          <Popover open={open.group} onOpenChange={(isOpen) => setOpen(prev => ({ ...prev, group: isOpen }))}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open.group}
                className="w-full justify-between"
                disabled={loading}
              >
                {loading ? (
                  "Kraunasi..."
                ) : (
                  <>
                    {selectedGroup?.name || "Pasirinkite grupę..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Ieškoti grupės..." />
                <CommandList>
                  <CommandEmpty>Grupė nerasta</CommandEmpty>
                  <CommandGroup>
                    {attributeGroups.map((group) => (
                      <CommandItem
                        key={group.id}
                        onSelect={() => {
                          setSelectedGroup(group);
                          setOpen(prev => ({ ...prev, group: false }));
                          loadAttributesByGroup(group.id);
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

        <Dialog open={open.createDialog} onOpenChange={(isOpen) => setOpen(prev => ({ ...prev, createDialog: isOpen }))}>
          <DialogTrigger asChild>
            <Button>Sukurti grupę</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sukurti naują atributų grupę</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="groupName">Grupės pavadinimas</Label>
                <Input
                  id="groupName"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Įveskite grupės pavadinimą"
                  className="mt-2"
                />
              </div>
              <Button 
                onClick={handleCreateGroup}
                type="button"
                className="w-full"
              >
                Sukurti
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {selectedGroup ? (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">"{selectedGroup.name}" grupės atributai</h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setEditingGroup(selectedGroup);
                    setOpen(prev => ({ ...prev, editGroupDialog: true }));
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Redaguoti grupę
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => setGroupToDelete(selectedGroup)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Ištrinti grupę
                </Button>
              </div>
            </div>

            <Button
              onClick={() => setOpen(prev => ({ ...prev, createAttributeDialog: true }))}
              className="w-fit"
            >
              Pridėti atributą
            </Button>

            <DataTable
              columns={columns}
              data={attributes}
            />
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 mt-4">
          Pasirinkite atributų grupę, kad galėtumėte peržiūrėti ir valdyti atributus.
        </div>
      )}

      {/* Edit Group Dialog */}
      <Dialog open={open.editGroupDialog} 
             onOpenChange={(isOpen) => setOpen(prev => ({ ...prev, editGroupDialog: isOpen }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redaguoti grupę</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Grupės pavadinimas</Label>
              <Input
                value={editingGroup?.name || ''}
                onChange={(e) => setEditingGroup(prev => prev ? { ...prev, name: e.target.value } : null)}
                className="mt-2"
              />
            </div>
            <Button onClick={handleEditGroup} className="w-full">
              Išsaugoti
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add New Attribute Dialog */}
      <Dialog open={open.createAttributeDialog} 
             onOpenChange={(isOpen) => setOpen(prev => ({ ...prev, createAttributeDialog: isOpen }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pridėti naują atributą</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Atributo pavadinimas</Label>
              <Input
                value={newAttributeName}
                onChange={(e) => setNewAttributeName(e.target.value)}
                placeholder="Įveskite atributo pavadinimą"
                className="mt-2"
              />
            </div>
            <Button onClick={handleCreateAttribute} className="w-full">
              Pridėti
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Attribute Dialog */}
      <Dialog open={open.editAttributeDialog} 
             onOpenChange={(isOpen) => setOpen(prev => ({ ...prev, editAttributeDialog: isOpen }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redaguoti atributą</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Atributo pavadinimas</Label>
              <Input
                value={editingAttribute?.name || ''}
                onChange={(e) => setEditingAttribute(prev => prev ? { ...prev, name: e.target.value } : null)}
                className="mt-2"
              />
            </div>
            <Button onClick={handleEditAttribute} className="w-full">
              Išsaugoti
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Attribute Confirmation Dialog */}
      <Dialog open={!!attributeToDelete} onOpenChange={(open) => !open && setAttributeToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ar tikrai norite ištrinti šį atributą?</DialogTitle>
            <DialogDescription>
              Šis veiksmas ištrins atributą "{attributeToDelete?.name}".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAttributeToDelete(null)}
            >
              Atšaukti
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAttribute}
            >
              Ištrinti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!groupToDelete} onOpenChange={(open) => !open && setGroupToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ar tikrai norite ištrinti šią grupę?</DialogTitle>
            <DialogDescription>
              Šis veiksmas ištrins atributų grupę "{groupToDelete?.name}".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGroupToDelete(null)}
            >
              Atšaukti
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteGroup}
            >
              Ištrinti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

