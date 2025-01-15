import React, { useState, useEffect } from 'react';
import Layout from '@/Layouts/Layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Heart, ImageIcon } from 'lucide-react';
import { Card } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import RedirectButton from '@/Components/MyComponents/RedirectButton';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/Components/ui/toaster";

interface Item {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url?: string;
  product_url: string;
  vendor_id: number;
}

interface ItemDetailProps {
  item: Item;
}

const getImageUrl = (imageUrl: string) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  return `${window.location.origin}/${imageUrl}`;
};

const ItemDetail: React.FC<ItemDetailProps> = ({ item }) => {
  const { auth } = usePage().props as { auth: { user: any } };
  const { toast } = useToast();
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const isAuthenticated = !!auth.user;
  const isAdmin = auth.user?.is_admin === 1;

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      axios.get(`/wishlist/check/${item.id}`).then(response => {
        setIsInWishlist(response.data.inWishlist);
      });
    }
  }, [item.id, isAuthenticated, isAdmin]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      router.visit('/login');
      return;
    }

    try {
      const response = await axios.post(`/wishlist/toggle/${item.id}`);
      setIsInWishlist(response.data.inWishlist);
      toast({
        description: response.data.inWishlist 
          ? "Prekė sėkmingai pridėta į jūsų norų sąrašą" 
          : "Prekė sėkmingai pašalinta iš jūsų norų sąrašo"
      });
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        variant: "destructive",
        description: "Nepavyko atnaujinti norų sąrašo"
      });
    }
  };

  const renderPlaceholder = () => (
    <div className="w-full flex justify-center items-center mb-4 mt-20 bg-gray-100 p-8 rounded-lg">
      <ImageIcon className="w-32 h-32 text-gray-400" />
    </div>
  );

  return (
    <Layout>
      <Head title={`Prekė: ${item.name}`} />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-screen">
          {/* Image Section */}
          <div
            className="flex justify-center items-start relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={isHovered ? handleMouseMove : undefined}
          >
            {item.image_url && !imageError ? (
              <img
                src={getImageUrl(item.image_url)}
                alt={item.name}
                className="w-full h-auto object-contain mb-4 mt-20 transition-transform duration-300 ease-in-out"
                style={{
                  transform: isHovered ? `scale(1.5)` : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transition: 'transform 0.3s ease',
                }}
                onError={() => setImageError(true)}
              />
            ) : (
              renderPlaceholder()
            )}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col justify-start">
            <h1 className="text-3xl font-bold mb-2">{item.name}</h1>

            <div className="mb-4">
              <h2 className="text-xl font-semibold">Specifikacijos</h2>
              <div className="mb-2">
                <Label htmlFor="product-id">Prekės ID:</Label>
                <p id="product-id" className="text-md">{item.id}</p>
              </div>
            </div>

            {/* Price and Vendor Card */}
            <Card className="p-4 rounded-lg shadow-md flex flex-col justify-between space-y-4 w-72 mx-auto">
              <p className="text-xl font-semibold">Kaina: {item.price} €</p>
              <p className="text-md text-gray-600">Pardavėjo ID: {item.vendor_id}</p>
              <div className="flex items-center justify-center space-x-2 w-full">
                {/* Apsilankyti Button */}
                <RedirectButton itemId={item.id} productUrl={item.product_url} className="px-4 py-2 text-white rounded hover:bg-gray-300 hover:text-black w-full" />
                {/* Wishlist logic */}
                {!isAdmin && (
                  <Heart
                    className={`cursor-pointer transition-colors ${
                      isInWishlist 
                        ? 'text-red-600 fill-red-600' 
                        : isAuthenticated 
                          ? 'text-black hover:text-red-600 hover:fill-red-600' 
                          : 'text-gray-400 hover:text-gray-600'
                    }`}
                    onClick={handleHeartClick}
                  />
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-4 border-t-2 border-gray-300" />

        {/* Description Section */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Aprašymas</h2>
          <p className="text-md">{item.description}</p>
        </div>
      </div>
      <Toaster />
    </Layout>
  );
};

export default ItemDetail;