import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import { Button } from '@/Components/ui/button';
import { Pagination } from '@/Components/ui/pagination';
import { X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/Components/ui/toaster";
import { Checkbox } from "@/Components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

// Lazy load Dovana component
const LazyDovana = lazy(() => import('@/Components/MyComponents/Dovana'));

interface Item {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url?: string;
  occasion?: string[];
  product_url: string;
}

interface ItemsProps {
  items: Item[];
}

interface Filters {
  occasions: Set<string>;
  minPrice: string;
  maxPrice: string;
  searchQuery: string;
}

const Items: React.FC<ItemsProps> = ({ items }) => {
  const { auth } = usePage().props as { auth: { user: any } };
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<Filters>({
    occasions: new Set<string>(),
    minPrice: '',
    maxPrice: '',
    searchQuery: ''
  });
  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    occasions: new Set<string>(),
    minPrice: '',
    maxPrice: '',
    searchQuery: ''
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const { toast } = useToast();
  const [itemsPerPageOption, setItemsPerPageOption] = useState<number>(20);

  const occasions = ["Kalėdos", "Gimtadienis", "Tėvo diena", "Mamos diena", "Santuoka"];

  useEffect(() => {
    if (!items || items.length === 0) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [items]);

  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters(prevFilters => ({...prevFilters, ...newFilters}));
  };

  const applyFilters = () => {
    setAppliedFilters({...filters});
    setCurrentPage(1);
    setShowFilters(false);
  };

  const removeFilter = (filterType: 'searchQuery' | 'price' | 'occasion', value?: string) => {
    if (filterType === 'searchQuery') {
      setAppliedFilters(prev => ({...prev, searchQuery: ''}));
      setFilters(prev => ({...prev, searchQuery: ''}));
    } else if (filterType === 'price') {
      setAppliedFilters(prev => ({...prev, minPrice: '', maxPrice: ''}));
      setFilters(prev => ({...prev, minPrice: '', maxPrice: ''}));
    } else if (filterType === 'occasion' && value) {
      const newOccasions = new Set(appliedFilters.occasions);
      newOccasions.delete(value);
      setAppliedFilters(prev => ({...prev, occasions: newOccasions}));
      setFilters(prev => ({...prev, occasions: newOccasions}));
    }
  };

  const filteredItems = items.filter(item => {
    if (appliedFilters.occasions.size === 0 && appliedFilters.minPrice === '' && appliedFilters.maxPrice === '' && !appliedFilters.searchQuery) return true;

    const occasionFilter = appliedFilters.occasions.size === 0 || [...appliedFilters.occasions].some(occasion => item.occasion?.includes(occasion));

    const price = parseFloat(item.price);
    const priceFilter = 
      (appliedFilters.minPrice === '' || price >= parseFloat(appliedFilters.minPrice)) && 
      (appliedFilters.maxPrice === '' || price <= parseFloat(appliedFilters.maxPrice));

    const searchFilter = appliedFilters.searchQuery
      ? item.name.toLowerCase().includes(appliedFilters.searchQuery.toLowerCase())
      : true;

    return occasionFilter && priceFilter && searchFilter;
  });

  const getItemsPerPage = () => itemsPerPageOption;

  const itemsPerPage = getItemsPerPage();
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const FilterSection = () => {
    const [searchValue, setSearchValue] = useState(filters.searchQuery);
    const [minValue, setMinValue] = useState(filters.minPrice);
    const [maxValue, setMaxValue] = useState(filters.maxPrice);
    const [localOccasions, setLocalOccasions] = useState(new Set(filters.occasions));

    const handleApplyFilters = () => {
      const newFilters = {
        searchQuery: searchValue,
        minPrice: minValue,
        maxPrice: maxValue,
        occasions: localOccasions
      };
      setFilters(newFilters);
      setAppliedFilters(newFilters);
      setCurrentPage(1);
      setShowFilters(false);
    };

    return (
      <div className={`${showFilters ? 'block' : 'hidden'} md:block bg-white p-4 md:w-1/4 md:static fixed inset-0 z-40 md:z-30 mt-20 overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-lg font-semibold">Filtrai</h2>
          <Button onClick={() => setShowFilters(false)} variant="ghost" size="icon">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Ieškoti pagal pavadinimą</h3>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Ieškoti..."
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4 space-y-2">
          <h3 className="font-semibold mb-2">Proga</h3>
          {occasions.map(occasion => (
            <div key={occasion} className="flex items-center space-x-2">
              <Checkbox
                id={occasion}
                checked={localOccasions.has(occasion)}
                onCheckedChange={(checked) => {
                  const newOccasions = new Set(localOccasions);
                  if (checked) {
                    newOccasions.add(occasion);
                  } else {
                    newOccasions.delete(occasion);
                  }
                  setLocalOccasions(newOccasions);
                }}
              />
              <label
                htmlFor={occasion}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {occasion}
              </label>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Kainų diapazonas</h3>
          <div className="flex space-x-4">
            <input
              type="number"
              value={minValue}
              onChange={(e) => setMinValue(e.target.value)}
              placeholder="Min"
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              value={maxValue}
              onChange={(e) => setMaxValue(e.target.value)}
              placeholder="Max"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <Button onClick={handleApplyFilters} className="w-full">Filtruoti</Button>
      </div>
    );
  };

  const FilterBadges = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      {appliedFilters.searchQuery && (
        <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded flex items-center">
          Paieška: {appliedFilters.searchQuery}
          <X className="h-4 w-4 ml-1 cursor-pointer" onClick={() => removeFilter('searchQuery')} />
        </span>
      )}
      {(appliedFilters.minPrice || appliedFilters.maxPrice) && (
        <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded flex items-center">
          Kaina: {appliedFilters.minPrice || '0'} - {appliedFilters.maxPrice || '∞'}
          <X className="h-4 w-4 ml-1 cursor-pointer" onClick={() => removeFilter('price')} />
        </span>
      )}
      {[...appliedFilters.occasions].map(occasion => (
        <span key={occasion} className="bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded flex items-center">
          {occasion}
          <X className="h-4 w-4 ml-1 cursor-pointer" onClick={() => removeFilter('occasion', occasion)} />
        </span>
      ))}
    </div>
  );

  const handleWishlistUpdate = (removed: boolean) => {
    toast({
      description: removed 
        ? "Prekė sėkmingai pašalinta iš jūsų norų sąrašo" 
        : "Prekė sėkmingai pridėta į jūsų norų sąrašą"
    });
  };

  const renderDovana = (item: Item, index: number) => (
    <Suspense
      key={item.id}
      fallback={
        <div className="p-4 border rounded-lg shadow-md h-full animate-pulse">
          <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      }
    >
      <LazyDovana
        {...item}
        isAuthenticated={!!auth.user}
        isAdmin={auth.user?.is_admin === 1}
        onWishlistUpdate={handleWishlistUpdate}
        isPriority={index < 4} // Prioritize first 4 items
      />
    </Suspense>
  );

  return (
    <Layout>
      <Head title="Prekės" />
      <div className="container mx-auto p-4 min-h-screen flex flex-col">
        <div className="md:hidden flex justify-center p-4">
          <Button onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Slėpti filtrus' : 'Rodyti filtrus'}
          </Button>
        </div>
        {showFilters && (
          <div 
            className="fixed inset-0 bg-white bg-opacity-50 z-40 md:hidden"
            onClick={() => setShowFilters(false)}
          ></div>
        )}
        <div className="flex flex-col md:flex-row">
          <FilterSection />
          <div className="md:w-3/4 p-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Dovanos</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  Rodyti po:
                </span>
                <Select
                  value={itemsPerPageOption.toString()}
                  onValueChange={(value) => {
                    setItemsPerPageOption(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="20" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="40">40</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <FilterBadges />
            {loading ? (
              <p>Kraunasi...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {paginatedItems.length === 0 ? (
                    <p>Dovanų nėra.</p>
                  ) : (
                    paginatedItems.map(renderDovana)
                  )}
                </div>
                <div className="mt-8 pt-4 border-t flex items-center justify-end">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </Layout>
  );
};

export default Items;