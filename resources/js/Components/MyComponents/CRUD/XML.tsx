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
        description: 'Failed to fetch vendors. Please try again.',
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
            description: 'No products found in the XML file.',
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
        description: "Please select a file and a vendor before submitting.",
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
        description: "XML data successfully submitted to the database!",
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
        description: "Error submitting XML data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">XML Upload</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Please upload 1 file at a time. <br /> All products will be assigned to the selected vendor.<br />  Edit before or after adding XML file content.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="xml-file">Upload XML File</Label>
            <Input id="xml-file" type="file" accept=".xml" onChange={handleFileChange} />
          </div>
          <div>
            <Label htmlFor="vendor-select">Select Vendor</Label>
            <Select onValueChange={handleVendorChange} value={selectedVendor}>
              <SelectTrigger id="vendor-select">
                <SelectValue placeholder="Select a vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id.toString()}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!selectedFile || !selectedVendor || isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit to Database'}
          </Button>
        </div>
        {xmlData.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Product URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {xmlData.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>
                    {product.image_url && (
                      <a href={product.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Image
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.product_url && (
                      <a href={product.product_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Product Page
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <Toaster />
    </>
  );
};

export default XML;