import React, { PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';
import Layout from './Layout'; // General layout
import AdminLayout from './AdminLayout'; // Admin-specific layout

// Define the type for the user object
interface User {
  is_admin: number; // Define is_admin as a number (tinyint)
  name: string;
}

export default function AuthenticatedLayout({ children }: PropsWithChildren<{}>) {
  const { user } = usePage().props; // Get the user object passed from the backend

  // Type assertion to tell TypeScript that user is of type User
  const typedUser = user as User;

  // Check if user is an admin (1 means admin)
  const LayoutComponent = typedUser && typedUser.is_admin === 1 ? AdminLayout : Layout;

  return (
    <LayoutComponent>
      {children}
    </LayoutComponent>
  );
}
