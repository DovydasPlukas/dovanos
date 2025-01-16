import React, { useEffect, useState } from 'react';
import Layout from '@/Layouts/Layout';
import { Button } from '@/Components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { Cake, TreePine, Heart, Home, Torus } from 'lucide-react'; 
import axios from 'axios';
import Dovana from '@/Components/MyComponents/Dovana';


interface FeaturedItem {
  id: number;
  item_id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  product_url: string;
  start_date: string;
  end_date: string;
}

const occasions = [
    { icon: <TreePine size={40} />, label: 'Kalėdos', link: '#' },
    { icon: <Cake size={40} />, label: 'Gimtadienis', link: '#' },
    { icon: <Home size={40} />, label: 'Tėvo diena', link: '#' },
    { icon: <Heart size={40} />, label: 'Mamos diena', link: '#' },
    { icon: <Torus size={40} />, label: 'Santuoka', link: '#' },
  ];

const Welcome: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await axios.get('/featured-items');
        setFeaturedItems(response.data);
      } catch (error) {
        console.error('Error fetching featured items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  const renderPlaceholders = () => {
    return Array(5).fill(null).map((_, index) => (
      <div key={index} className="p-4 border rounded-lg shadow-md h-[384px] animate-pulse">
        <div className="w-full h-48 bg-gray-200 mb-4" />
        <div className="h-6 bg-gray-200 w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 w-1/2 mb-2" />
        <div className="h-6 bg-gray-200 w-1/4 mb-2" />
        <div className="flex justify-between mt-auto">
          <div className="h-8 bg-gray-200 w-24" />
          <div className="h-8 bg-gray-200 w-8" />
        </div>
      </div>
    ));
  };

  const renderDottedPlaceholders = () => {
    const remainingSlots = 5 - featuredItems.length;
    return Array(remainingSlots).fill(null).map((_, index) => (
      <div 
        key={`placeholder-${index}`} 
        className="hidden lg:flex p-4 border-2 border-dashed border-gray-300 rounded-lg h-[384px] flex-col items-center justify-center"
      >
      </div>
    ));
  };

  return (
    <Layout>
      <Head title="Sveiki" />
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <h1 className="text-4xl font-semibold text-center mb-4">Sveiki atvykę į Dovanų idėjų platformą!</h1>
        <p className="text-lg text-center mb-6">
          Atraskite tobulas dovanų idėjas, bet kokiai progai. Naršykite mūsų kolekciją ir įkvėpkite save.
        </p>
        <Link href="/items">
          <Button>Peržiūrėti prekes</Button>
        </Link>
        {/* Placeholder for Occasions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-5xl px-4">
          {occasions.map((occasion, index) => (
            <Link
              href={occasion.link}
              key={index}
              className="p-4 border border-gray-300 rounded-md text-center h-40 flex flex-col justify-center items-center"
            >
              {occasion.icon}
              <p className="text-lg text-gray-600">{occasion.label}</p>
            </Link>
          ))}
        </div>
        {/* Featured Items section */}
        <div className={`mt-8 w-full max-w-5xl mx-4 ${!loading && featuredItems.length === 0 ? 'hidden lg:block' : ''}`}>
          <h2 className="text-2xl font-semibold mb-4 text-center">Svarbiausios Dovanos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {loading ? renderPlaceholders() : (
              <>
                {featuredItems.map((item) => (
                  <Dovana
                    key={item.id}
                    id={item.item_id}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    image_url={item.image_url}
                    product_url={item.product_url}
                    isAuthenticated={false}
                    isPriority={true}
                  />
                ))}
                {featuredItems.length < 5 && renderDottedPlaceholders()}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Welcome;