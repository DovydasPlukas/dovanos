import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { LayoutDashboard, Users, Package, Settings, Gift } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/Components/ui/sidebar';

const sidebarItems = [
  { name: 'Index', icon: Gift, href: '/' },
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Items', icon: Package, href: '/items' },
  { name: 'Vendors', icon: Users, href: '/vendors' },
  { name: 'Edit Page', icon: Settings, href: '/edit-page' },
];

export function AdminNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          className={`h-auto w-64 flex-shrink-0 transition-all duration-300 ${
            isSidebarOpen ? 'block' : 'hidden'
          }`}
        >
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <span className="font-semibold flex items-center gap-2">Admin Panel</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
}
