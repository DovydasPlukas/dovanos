import React, { useState } from 'react';
import Layout from '@/Layouts/Layout';
import { Head } from '@inertiajs/react';
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

const ItemDetail: React.FC<{ item: Item }> = ({ item }) => {
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <Layout>
      <Head title={`Item: ${item.name}`} />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-screen">
          {/* Image Section */}
          <div
            className="flex justify-center items-start relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}  // Trigger zoom on hover
            onMouseLeave={() => setIsHovered(false)}  // Reset zoom when not hovering
            onMouseMove={isHovered ? handleMouseMove : undefined} // Only move the mouse position when hovered
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-auto object-contain mb-4 mt-20 transition-transform duration-300 ease-in-out"
                style={{
                  transform: isHovered ? `scale(1.5)` : 'scale(1)', // Zoom effect
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`, // Dynamic zoom origin
                  transition: 'transform 0.3s ease', // Smooth transition
                }}
              />
            )}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col justify-start">
            <h1 className="text-3xl font-bold mb-2">{item.name}</h1>

            <div className="mb-4">
              <h2 className="text-xl font-semibold">Specifikacijos</h2>
              <div className="mb-2">
                <Label htmlFor="product-id">Product ID:</Label>
                <p id="product-id" className="text-md">{item.id}</p>
              </div>
            </div>

            {/* Price and Vendor Card */}
            <Card className="p-4 rounded-lg shadow-md flex flex-col justify-between space-y-4 w-72 mx-auto">
              <p className="text-xl font-semibold">Price: {item.price} €</p>
              <p className="text-md text-gray-600">Vendor ID: {item.vendor_id}</p>
              <div className="flex items-center justify-center space-x-2 w-full">
                {/* Apsilankyti Button */}
                <RedirectButton itemId={item.id} productUrl={item.product_url} className="px-4 py-2 text-white rounded hover:bg-gray-300 hover:text-black w-full" />
                {/* Wishlist logic */}
                <Heart className="text-black hover:text-red-600 cursor-pointer" />
              </div>
            </Card>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-4 border-t-2 border-gray-300" />

        {/* Description Section */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Description</h2>
          <p className="text-md">{item.description}</p>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;