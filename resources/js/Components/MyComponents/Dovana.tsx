import React from 'react';
import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import RedirectButton from '@/Components/MyComponents/RedirectButton';

interface DovanaProps {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url?: string;
  product_url: string;
  isAuthenticated: boolean;
  isAdmin?: boolean;  // Add this new prop
}

const Dovana: React.FC<DovanaProps> = ({ 
  id, 
  name, 
  description, 
  price, 
  image_url, 
  product_url, 
  isAuthenticated,
  isAdmin = false  // Default to false
}) => {
  const truncateText = (text: string, charLimit: number) => {
    if (text.length > charLimit) {
      return text.substring(0, charLimit) + '...';
    }
    return text;
  };

  return (
    <Link href={`/items/${id}`} as="div" className="block">
      <div className="p-4 border rounded-lg shadow-md hover:shadow-lg cursor-pointer h-full flex flex-col">
        <div className="w-full h-48 mb-4 bg-gray-200 flex items-center justify-center">
          {image_url ? (
            <img 
              src={image_url} 
              alt={name} 
              className="w-full h-full object-cover"
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
          ) : (
            <span className="text-gray-400">No image</span>
          )}
        </div>
        <h2 className="text-xl font-semibold mb-2">{truncateText(name, 20)}</h2>
        <p className="text-sm mb-2 flex-grow">{truncateText(description, 30)}</p>
        <p className="text-lg font-semibold mb-2">{price} €</p>
        <div className="flex items-center justify-between mt-auto">
          <div onClick={(e) => e.stopPropagation()}>
            <RedirectButton itemId={id} productUrl={product_url} className="px-4 py-2 text-white rounded hover:bg-gray-300 hover:text-black" />
          </div>
          {isAuthenticated && !isAdmin && (
            <Heart
              className="text-black hover:text-red-600 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      </div>
    </Link>
  );
};

export default Dovana;