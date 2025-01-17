import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/Components/ui/toaster";
import { DataTable } from "@/Components/MyComponents/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { RowsPerPageSelect } from "@/Components/MyComponents/RowsPerPageSelect";
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/Components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover"

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image_url: string;
  product_url: string;
}

interface Vendor {
  id: number;
  name: string;
}

const XML: React.FC = () => {
  const { toast } = useToast();
  const [xmlData, setXmlData] = useState<Product[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(50);
  const [openVendor, setOpenVendor] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get('/vendors');
      setVendors(response.data.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        variant: "destructive",
        description: "Nepavyko gauti pardavėjų sąrašo",
      });
    }
  };

  const parseXML = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        const parser = new XMLParser();
        const result = parser.parse(text);

        if (result?.products?.product) {
          const products = Array.isArray(result.products.product)
            ? result.products.product
            : [result.products.product];

          const parsedProducts = products.map((item: any) => ({
            id: item?.id || '',
            name: item?.title || '',
            price: item?.price || '',
            description: item?.description || '',
            image_url: item?.image_url || '',
            product_url: item?.product_url || '',
          }));

          setXmlData(parsedProducts);
        } else {
          toast({
            variant: "destructive",
            description: "XML faile nerasta produktų",
          });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
    if (file) {
      // Clear previous data when a new file is selected
      setXmlData([]);
      parseXML(file);
    }
  };

  const handleVendorChange = (value: string) => {
    setSelectedVendor(value);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !selectedVendor) {
      toast({
        variant: "destructive",
        description: "Pasirinkite failą ir pardavėją",
      });
      return;
    }
  
    setIsLoading(true);
  
    // Clear preview data immediately
    setXmlData([]);
    
    const formData = new FormData();
    formData.append('xml_file', selectedFile);
    formData.append('vendor_id', selectedVendor);
  
    try {
      const response = await axios.post('/upload-xml', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      toast({
        description: "XML duomenys sėkmingai įkelti į duomenų bazę!",
      });
  
      // Update xmlData with the newly submitted data
      const newXmlData = response.data.data;
      if (Array.isArray(newXmlData) && newXmlData.length > 0) {
        setXmlData(newXmlData); // Add the newly submitted products
      } else {
        setXmlData([]); // If no new data is received, clear the existing data
      }
  
    } catch (error) {
      console.error('Error submitting XML data:', error);
      toast({
        variant: "destructive",
        description: "Nepavyko įkelti XML duomenų",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<Product>[] = [
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
      accessorKey: "description",
      header: "Aprašymas",
    },
    {
      id: "image_url",
      header: "Nuotrauka",
      cell: ({ row }) => (
        row.original.image_url ? (
          <a 
            href={row.original.image_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline"
          >
            Peržiūrėti
          </a>
        ) : null
      ),
    },
    {
      id: "product_url",
      header: "Produkto nuoroda",
      cell: ({ row }) => (
        row.original.product_url ? (
          <a 
            href={row.original.product_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline"
          >
            Produkto puslapis
          </a>
        ) : null
      ),
    },
  ];

  const paginatedData = xmlData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(xmlData.length / itemsPerPage);

  return (
    <>
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">XML įkėlimas</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Įkelkite po vieną failą vienu metu.<br />
                   Visos prekės bus priskirtos pasirinktam pardavėjui.<br />
                   Redaguokite prieš arba po XML failo turinio pridėjimo.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="xml-file">Įkelti XML failą</Label>
            <Input id="xml-file" type="file" accept=".xml" onChange={handleFileChange} />
          </div>
          <div>
            <Label htmlFor="vendor-select">Pasirinkti pardavėją</Label>
            <Popover open={openVendor} onOpenChange={setOpenVendor}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openVendor}
                  className="w-full justify-between"
                >
                  {vendors.find((vendor) => vendor.id.toString() === selectedVendor)?.name || "Pasirinkite pardavėją..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Ieškoti pardavėjo..." />
                  <CommandList>
                    <CommandEmpty>Pardavėjų nerasta.</CommandEmpty>
                    <CommandGroup>
                      {vendors.map((vendor) => (
                        <CommandItem
                          key={vendor.id}
                          onSelect={() => {
                            handleVendorChange(vendor.id.toString());
                            setOpenVendor(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedVendor === vendor.id.toString() ? "opacity-100" : "opacity-0"
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
          <Button
            onClick={handleSubmit}
            disabled={!selectedFile || !selectedVendor || isLoading}
          >
            {isLoading ? 'Įkeliama...' : 'Įkelti į duomenų bazę'}
          </Button>
        </div>
        {xmlData.length > 0 && (
          <>
            <div className="flex justify-end mb-4">
              <RowsPerPageSelect
                value={itemsPerPage}
                onChange={(value) => {
                  setItemsPerPage(value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <DataTable 
              columns={columns} 
              data={paginatedData}
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
          </>
        )}
      </div>
      <Toaster />
    </>
  );
};

export default XML;