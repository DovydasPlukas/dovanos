import React, { useState } from 'react';
import Layout from '@/Layouts/Layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { Card } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import RedirectButton from '@/Components/MyComponents/RedirectButton';

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
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isAuthenticated = !!auth.user;
  const isAdmin = auth.user?.is_admin === 1;

  const handleMouseMove = (e: React.MouseEvent) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      router.visit('/login');
      return;
    }
    
    // Add wishlist logic here
    console.log('Add to wishlist clicked');
  };

  const renderPlaceholder = () => (
    <div className="w-full flex justify-center items-center mb-4 mt-20">
      <div className="bg-gray-200 p-8 rounded-lg">
        <svg
          className="w-32 h-32 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-500 mt-2">No image available</p>
      </div>
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
                      isAuthenticated 
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
    </Layout>
  );
};

export default ItemDetail;