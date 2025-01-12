import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '@/Layouts/Layout';
import { Head, Link } from '@inertiajs/react'; 
import { Heart } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 
import { Pagination } from '@/Components/ui/pagination';
import RedirectButton from '@/Components/MyComponents/RedirectButton';

interface Item {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url?: string;
  occasion?: string[];
  product_url: string;
}

const Items: React.FC<{ items: Item[] }> = ({ items }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOccasions, setSelectedOccasions] = useState<Set<string>>(new Set());
  const [minPrice, setMinPrice] = useState<number | ''>(''); // State for minimum price
  const [maxPrice, setMaxPrice] = useState<number | ''>(''); // State for maximum price
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
  const [currentPage, setCurrentPage] = useState<number>(1); // State for current page

  useEffect(() => {
    if (!items || items.length === 0) {
      setLoading(false);  // If no items, stop loading immediately
    } else {
      setLoading(false);  // Set loading to false once items are loaded
    }
    console.log('Items:', items);
  }, [items]);

  // Handle checkbox change for occasions
  const handleCheckboxChange = (occasion: string, checked: boolean) => {
    setSelectedOccasions(prevOccasions => {
      const newOccasions = new Set(prevOccasions);
      if (checked) {
        newOccasions.add(occasion); // Add occasion if checked
      } else {
        newOccasions.delete(occasion); // Remove occasion if unchecked
      }
      return newOccasions;
    });
  };

  // Filter items based on selected occasions, price range, and search query
  const filteredItems = items.filter(item => {
    if (selectedOccasions.size === 0 && minPrice === '' && maxPrice === '' && !searchQuery) return true; // No filters selected, show all items

    // Check if item has any of the selected occasions
    const occasionFilter = selectedOccasions.size === 0 || [...selectedOccasions].some(occasion => item.occasion?.includes(occasion));

    // Check if item price falls within the selected price range
    const price = parseFloat(item.price);
    const priceFilter = 
      (minPrice === '' || price >= minPrice) && 
      (maxPrice === '' || price <= maxPrice);

    // Check if item matches the search query (search by title)
    const searchFilter = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return occasionFilter && priceFilter && searchFilter;
  });

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredItems.length / 10);

  // Get the items for the current page
  const paginatedItems = filteredItems.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Layout>
      <Head title="Prekės" />
      <div className="container mx-auto p-4 h-screen flex">
        {/* Left side for filters */}
        <div className="w-1/4 p-4">
          <h2 className="text-lg font-semibold mb-4">Filtrai</h2>

          {/* Search Bar */}
          <div className="mb-4">
            <label className="block mb-2">Ieškoti pagal pavadinimą</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ieškoti..."
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Occasion Filters */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Proga</h3>
            <label className="block mb-2">
              <input 
                type="checkbox" 
                checked={selectedOccasions.has('Gimtadienis')} 
                onChange={(e) => handleCheckboxChange('Gimtadienis', e.target.checked)} 
                className="mr-2"
              />
              Gimtadienis
            </label>
            <label className="block">
              <input 
                type="checkbox" 
                checked={selectedOccasions.has('Kaledos')} 
                onChange={(e) => handleCheckboxChange('Kaledos', e.target.checked)} 
                className="mr-2"
              />
              Kalėdos
            </label>
          </div>

          {/* Price Range Filters */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Kainų diapazonas</h3>
            <div className="flex space-x-4">
              <input
                type="number"
                value={minPrice === '' ? '' : minPrice}
                onChange={(e) => setMinPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="Min"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                value={maxPrice === '' ? '' : maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="Max"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Right side for items */}
        <div className="w-3/4 p-4">
          <h1 className="text-2xl font-bold mb-4">Dovanos</h1>
          {loading ? (
            <p>Kraunasi...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {paginatedItems.length === 0 ? (
                  <p>Dovanų nėra.</p> // Show this if no filtered items
                ) : (
                  paginatedItems.map(item => (
                    <Link key={item.id} href={`/items/${item.id}`} as="button">
                      <div className="p-4 border rounded-lg shadow-md hover:shadow-lg cursor-pointer">
                        {/* Image */}
                        {item.image_url && (
                          <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover mb-4" />
                        )}
                        <h2 className="text-xl font-semibold">{item.name}</h2>
                        <p>{item.description}</p>
                        <p className="text-lg font-semibold">{item.price} €</p>
                        <div className="flex items-center justify-between mt-4">
                          {/* RedirectButton */}
                          <RedirectButton itemId={item.id} productUrl={item.product_url} className="px-4 py-2 text-white rounded hover:bg-gray-300 hover:text-black" />
                          {/* Heart */}
                          <Heart
                            className="text-black hover:text-red-600 cursor-pointer"
                            onClick={(e) => e.stopPropagation()} // Prevent card click from triggering
                          />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Items;
