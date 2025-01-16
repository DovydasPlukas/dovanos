import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ItemsCrud from '@/Components/MyComponents/CRUD/ItemCRUD';
import VendorsCrud from '@/Components/MyComponents/CRUD/VendorsCRUD';
import XML from '@/Components/MyComponents/CRUD/XML';
import EditPage from '@/Components/MyComponents/EditPage';

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
        return <ItemsCrud />;
      case 'vendors':
        return <VendorsCrud />;
      case 'xml':
        return <XML />;
      case 'edit-page':
        return <EditPage />;
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to the Admin Dashboard</h2>
            <p>Select a tab from the sidebar to manage items or vendors.</p>
          </div>
        );
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
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
