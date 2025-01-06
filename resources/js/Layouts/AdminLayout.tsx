import React, { useState, PropsWithChildren } from 'react';
import {
  ArrowRightFromLine,
  ArrowLeftFromLine,
  LayoutDashboard,
  Users,
  Package,
  Settings,
  Gift,
  Menu,
} from 'lucide-react';
import { AdminNavbar } from '@/Components/MyComponents/AdminNavbar';
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';

const sidebarItems = [
  { name: 'Index', icon: Gift, href: '/' },
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Items', icon: Package, href: '/items' },
  { name: 'Vendors', icon: Users, href: '/vendors' },
  { name: 'Edit Page', icon: Settings, href: '/edit-page' },
];

// MobileMenu Component
function MobileMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="md:hidden">
      {/* Menu Button */}
      <Button
        onClick={toggleMobileMenu}
        className="p-2 bg-primary text-white rounded-md fixed top-4 right-4 z-50"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="absolute top-0 right-0 w-full h-full bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        >
          <div
            className="bg-white shadow-lg w-64 h-full p-4 ml-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing on menu clicks
          >
            <div className="mb-4">
              <h2 className="font-semibold text-lg">Admin Panel</h2>
            </div>
            <nav>
              {sidebarItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  onClick={toggleMobileMenu}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }: PropsWithChildren<{}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar for larger screens */}
      <div
        className={`hidden md:block fixed inset-y-0 left-0 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminNavbar />
      </div>

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : 'md:ml-0'
        }`}
      >
        <div className="flex flex-col min-h-screen">
          <main className="p-6 overflow-auto">{children}</main>
        </div>
      </div>

      {/* Sidebar toggle button for larger screens */}
      <div
        className={`hidden md:block fixed top-4 transition-all duration-300 ${
          isSidebarOpen ? 'left-64' : 'left-4'
        }`}
      >
        <Button
          onClick={toggleSidebar}
          className="p-2 bg-primary text-black rounded-md bg-white shadow-md hover:text-black hover:bg-gray-300"
        >
          {isSidebarOpen ? (
            <ArrowLeftFromLine className="h-6 w-6" />
          ) : (
            <ArrowRightFromLine className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );
}
