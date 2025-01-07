import React from 'react';
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
  { name: 'Items', icon: Package, href: '/dashboard?tab=items' },
  { name: 'Vendors', icon: Users, href: '/dashboard?tab=vendors' },
  { name: 'Edit Page', icon: Settings, href: '/edit-page' },
];

interface AdminNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminNavbar({ activeTab, setActiveTab }: AdminNavbarProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar className="h-auto w-64 flex-shrink-0">
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
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        activeTab === item.name.toLowerCase()
                          ? 'bg-primary text-white hover:bg-primary hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab(item.name.toLowerCase())}
                    >
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
