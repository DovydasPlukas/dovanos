import React from 'react';
import { Link } from '@inertiajs/react';
import { LayoutDashboard, Users, Package, Settings, Gift, FileText } from 'lucide-react';

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
  { name: 'Pradžia', icon: Gift, href: '/' },
  { name: 'Skydelis', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Prekės', icon: Package, href: '/dashboard?tab=items' },
  { name: 'Pardavėjai', icon: Users, href: '/dashboard?tab=vendors' },
  { name: 'XML', icon: FileText, href: '/dashboard?tab=xml' },
  { name: 'Iškeltos prekės', icon: Settings, href: '/dashboard?tab=edit-page' },
];

interface AdminNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminNavbar({ activeTab, setActiveTab }: AdminNavbarProps) {
  const isActive = (itemName: string) => {
    const tabMap: { [key: string]: string } = {
      'Prekės': 'items',
      'Pardavėjai': 'vendors',
      'Skydelis': 'dashboard',
      'Iškeltos prekės': 'edit-page',
      'XML': 'xml',
    };
    return activeTab === (tabMap[itemName] || itemName.toLowerCase());
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar className="h-auto w-64 flex-shrink-0">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <span className="font-semibold flex items-center gap-2">
                    Administratoriaus skydelis
                  </span>
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
                        isActive(item.name)
                          ? 'bg-primary text-white hover:bg-primary/80 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab(item.name.toLowerCase().replace(' ', '-'))}
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