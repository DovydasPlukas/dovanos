import Footer from '@/Components/MyComponents/Footer';
import Navbar from '@/Components/MyComponents/Navbar';
import React, { PropsWithChildren } from 'react';


export default function AdminLayout({ children }: PropsWithChildren<{}>) {
  return (
    <div className="min-h-screen bg-gray-100">
        {/* change later to admin navbar (sidebar) */}
      <Navbar />
      <div className='flex justify-center'><h1>Admin</h1></div>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
