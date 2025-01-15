import React from 'react';
import Layout from '@/Layouts/Layout';
import { Head } from '@inertiajs/react';
import Dovana from '@/Components/MyComponents/Dovana';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/Components/ui/toaster";

interface Item {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url?: string;
  product_url: string;
}

const Wishlist: React.FC<{ items: Item[], auth: { user: any } }> = ({ items, auth }) => {
  const { toast } = useToast();

  const handleWishlistUpdate = (removed: boolean) => {
    toast({
      title: removed ? "Prekė pašalinta" : "Prekė pridėta",
      description: removed 
        ? "Prekė sėkmingai pašalinta iš jūsų norų sąrašo" 
        : "Prekė sėkmingai pridėta į jūsų norų sąrašą",
    });
  };

  if (!items || items.length === 0) {
    return (
      <Layout>
        <Head title="Norų sąrašas" />
        <div className="container mx-auto p-4 min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Jūsų norų sąrašas</h1>
          <p>Jūsų norų sąrašas tuščias.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head title="Norų sąrašas" />
      <div className="container mx-auto p-4 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Jūsų norų sąrašas</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Dovana
              key={item.id}
              {...item}
              isAuthenticated={!!auth.user}
              isAdmin={auth.user?.is_admin === 1}
              onWishlistUpdate={handleWishlistUpdate}
            />
          ))}
        </div>
      </div>
      <Toaster />
    </Layout>
  );
};

export default Wishlist;
