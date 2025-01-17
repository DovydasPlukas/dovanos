import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ItemsCrud from '@/Components/MyComponents/CRUD/ItemCRUD';
import VendorsCrud from '@/Components/MyComponents/CRUD/VendorsCRUD';
import XML from '@/Components/MyComponents/CRUD/XML';
import EditPage from '@/Components/MyComponents/EditPage';
import Attributes from '@/Components/MyComponents/CRUD/Attributes';

interface DashboardProps {
  initialTab?: string;
}

export default function Dashboard({ initialTab = 'dashboard' }: DashboardProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'items':
      case 'prekes':
        return <ItemsCrud />;
      case 'vendors':
      case 'pardavejai':
        return <VendorsCrud />;
      case 'xml':
        return <XML />;
      case 'edit-page':
      case 'redaguoti':
        return <EditPage />;
      case 'attributes':
      case 'atributai':
        return <Attributes />;
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Sveiki atvykę į administratoriaus skydelį</h2>
            <p>Pasirinkite skiltį iš šoninio meniu prekių ar pardavėjų valdymui.</p>
          </div>
        );
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Administratoriaus skydelis" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">{renderContent()}</div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
