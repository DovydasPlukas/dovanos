import React from 'react';
import Layout from '@/Layouts/Layout';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Cake, TreePine, Heart, Home, Torus } from 'lucide-react'; 

const occasions = [
    { icon: <TreePine size={40} />, label: 'Kalėdos', link: '#' },
    { icon: <Cake size={40} />, label: 'Gimtadienis', link: '#' },
    { icon: <Home size={40} />, label: 'Tėvo diena', link: '#' },
    { icon: <Heart size={40} />, label: 'Mamos diena', link: '#' },
    { icon: <Torus size={40} />, label: 'Santuoka', link: '#' },
  ];

const Welcome: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col justify-center items-center -mt-32">
        <h1 className="text-4xl font-semibold text-center mb-4">Sveiki atvykę į Dovanų idėjų platformą!</h1>
        <p className="text-lg text-center mb-6">
          Atraskite tobulas dovanų idėjas, bet kokiai progai. Naršykite mūsų kolekciją ir įkvėpkite save.
        </p>
        <Link href="/items">
          <Button>Peržiūrėti prekes</Button>
        </Link>
        {/* Placeholder for Occasions */}
        <div className="mt-8 grid grid-cols-5 gap-4 w-full max-w-5xl">
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
        {/* Placeholder for Ad Items */}
        <div className="mt-8 p-4 border border-gray-300 rounded-md w-full max-w-5xl text-center">
          <p className="text-lg text-gray-600">Reklaminiai daiktai bus rodomi čia netrukus.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Welcome;
