import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link, router } from '@inertiajs/react';
import { Heart, ImageIcon } from 'lucide-react';
import RedirectButton from '@/Components/MyComponents/RedirectButton';
import axios from 'axios';
import OptimizedImage from './OptimizedImage';

interface DovanaProps {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url?: string;
  product_url: string;
  isAuthenticated: boolean;
  isAdmin?: boolean;
  onWishlistUpdate?: (removed: boolean) => void;
  isPriority?: boolean;
}

const Dovana: React.FC<DovanaProps> = ({ 
  id, 
  name, 
  description, 
  price, 
  image_url, 
  product_url, 
  isAuthenticated,
  isAdmin = false,  // Default to false
  onWishlistUpdate,
  isPriority = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      axios.get(`/wishlist/check/${id}`).then(response => {
        setIsInWishlist(response.data.inWishlist);
      });
    }
  }, [id, isAuthenticated, isAdmin]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      router.visit('/login');
      return;
    }

    try {
      const response = await axios.post(`/wishlist/toggle/${id}`);
      setIsInWishlist(response.data.inWishlist);
      onWishlistUpdate?.(!response.data.inWishlist);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const truncateText = (text: string, charLimit: number) => {
    if (text.length > charLimit) {
      return text.substring(0, charLimit) + '...';
    }
    return text;
  };

  const renderPlaceholder = () => (
    <div className="w-full h-full flex justify-center items-center bg-gray-100">
      <ImageIcon className="w-16 h-16 text-gray-400" />
    </div>
  );

  return (
    <Link href={`/items/${id}`} as="div" className="block">
      <div className="p-4 border rounded-lg shadow-md hover:shadow-lg cursor-pointer h-full flex flex-col">
        <div className="w-full h-48 mb-4 bg-gray-100 flex items-center justify-center overflow-hidden">
          {image_url && !imageError ? (
            <OptimizedImage 
              src={image_url} 
              alt={name}
              className="w-full h-full"
              width={300}
              height={300}
              onError={() => setImageError(true)}
              loading="lazy"
              blurDataURL={`${image_url}?w=50&q=10`}
              priority={isPriority}
            />
          ) : (
            renderPlaceholder()
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
              className={`cursor-pointer transition-colors ${
                isInWishlist ? 'text-red-600 fill-red-600' : 'text-black hover:text-red-600'
              }`}
              onClick={handleWishlistToggle}
            />
          )}
        </div>
      </div>
    </Link>
  );
};

export default Dovana;