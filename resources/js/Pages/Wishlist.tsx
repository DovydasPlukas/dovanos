import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/Layouts/Layout';
import { Head, Link } from '@inertiajs/react'; 
import { Heart } from 'lucide-react'; 
import { Button } from '@/Components/ui/button';

interface Item {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url?: string;
  occasion?: string[];
}

const Wishlist: React.FC<{ items: Item[] }> = ({ items }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [randomItem, setRandomItem] = useState<Item | null>(null);

  useEffect(() => {
    // Select a random item when the component mounts
    if (items && items.length > 0) {
      const randomIndex = Math.floor(Math.random() * items.length);
      setRandomItem(items[randomIndex]);
      setLoading(false);
    }
  }, [items]);

  if (loading) {
    return <Layout><p>Loading...</p></Layout>;
  }

  if (!randomItem) {
    return (
      <Layout>
        <Head title="Wishlist" />
        <p>No items available in your wishlist.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head title="Wishlist" />
      <div className='flex justify-center mt-8'><strong>Random Item</strong></div>
      <div className='flex justify-center mt-8'><strong>Will add logic later to wishlist</strong></div>
      <div className="container mx-auto p-4 h-screen flex justify-center items-center">
        <div className="w-full max-w-lg p-4 border rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
          {/* Display random item details */}
          <div className="mb-4">
            {randomItem.image_url && (
              <img
                src={randomItem.image_url}
                alt={randomItem.name}
                className="w-full h-48 object-cover mb-4"
              />
            )}
            <h2 className="text-xl font-semibold">{randomItem.name}</h2>
            <p>{randomItem.description}</p>
            <p className="text-lg font-semibold">{randomItem.price} €</p>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <Button className="px-4 py-2 text-white rounded hover:bg-gray-300 hover:text-black w-full">
              Visit Product
            </Button>
            <Heart
              className="text-black hover:text-red-600 cursor-pointer"
              onClick={(e) => e.stopPropagation()} // Prevent card click from triggering
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
