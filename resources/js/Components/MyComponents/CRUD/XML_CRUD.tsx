import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { parseString } from 'xml2js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

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

const XMLCrud: React.FC = () => {
  const [xmlData, setXmlData] = useState<Product[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
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
      setAlert({ type: 'error', message: 'Failed to fetch vendors. Please try again.' });
    }
  };

  const parseXML = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        parseString(text, (err, result) => {
          if (err) {
            console.error('Error parsing XML:', err);
            setAlert({ type: 'error', message: 'Error parsing XML file. Please check the file format.' });
            return;
          }
          const products = result?.products?.product?.map((item: any) => ({
            id: item.$.id,
            name: item.title[0],
            price: item.price[0],
            description: item.description ? item.description[0] : '',
            image_url: item.image_url ? item.image_url[0] : '',
            product_url: item.product_url ? item.product_url[0] : '',
          }));
          setXmlData(products || []);
        });
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
    if (file) {
      parseXML(file);
    }
  };

  const handleVendorChange = (value: string) => {
    setSelectedVendor(value);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !selectedVendor) {
      setAlert({ type: 'error', message: 'Please select a file and a vendor before submitting.' });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('xml_file', selectedFile);
    formData.append('vendor_id', selectedVendor);

    try {
      const response = await axios.post('/upload-xml', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAlert({ type: 'success', message: 'XML data successfully submitted to the database!' });
      setXmlData(response.data.data);
    } catch (error) {
      console.error('Error submitting XML data:', error);
      setAlert({ type: 'error', message: 'Error submitting XML data. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">XML CRUD</h2>
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
      {alert && (
        <Alert variant={alert.type === 'success' ? 'default' : 'destructive'}>
          {alert.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
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
  );
};

export default XMLCrud;

