import React from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Heart, Gift, User, LogOut, Settings } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/Components/ui/hover-card";
import SearchBar from "@/Components/MyComponents/SearchBar";

// Define the User type to include is_admin property
interface User {
  is_admin: number; // Define is_admin
  email: string;
}

export default function Navbar() {
  const { auth } = usePage().props;

  // Type assertion to handle the missing property
  const user = auth.user as unknown as User; // First assert as unknown, then cast to User

  const handleLogout = () => {
    router.post(route("logout"), {}, { preserveScroll: true });
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="text-xl font-semibold text-gray-800 flex items-center"
            >
              <Gift className="h-6 w-6 text-gray-800 mr-2" />
              <span>Dovanų idėjų platforma</span>
            </Link>
          </div>

          {/* Wishlist/Settings & User Dropdown */}
          <div className="flex items-center space-x-4">
            {user && (
              <Link
                href={user.is_admin === 1 ? "/dashboard" : "/wishlist"} // If admin, link to /dashboard; else, /wishlist
                className="text-gray-600 hover:text-gray-800"
              >
                {user.is_admin === 1 ? (
                  <Settings className="h-6 w-6" /> // Gear icon for admin
                ) : (
                  <Heart className="h-6 w-6" /> // Heart icon for regular user
                )}
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                {/* User Profile with HoverCard */}
                <HoverCard>
                  <HoverCardTrigger>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="h-6 w-6 text-gray-600 hover:text-gray-800" />
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent className="p-4 bg-white border shadow-lg rounded-lg w-48">
                    <div className="text-sm text-gray-700">
                      Email: {user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="mt-2 w-full py-2 text-sm bg-black text-white hover:bg-gray-300 hover:text-black rounded-lg"
                    >
                      Logout
                    </button>
                  </HoverCardContent>
                </HoverCard>

                {/* Logout Icon for Mobile/Tablet Screens */}
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-800 block lg:hidden"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href={route("login")}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <User className="h-6 w-6" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <SearchBar />
    </>
  );
}
