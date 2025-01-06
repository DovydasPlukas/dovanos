import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Heart, Gift, User, LogOut } from "lucide-react"; // Import LogOut icon
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/Components/ui/hover-card";
import SearchBar from "@/Components/MyComponents/SearchBar";

export default function Navbar() {
  const { auth } = usePage().props;

  const handleLogout = () => {
    window.location.href = "/logout";
  };
// TODO: Logout logic
  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-xl font-semibold text-gray-800 flex items-center">
              <Gift className="h-6 w-6 text-gray-800 mr-2" />
              <span>Dovanų idėjų platforma</span>
            </Link>
          </div>

          {/* Wishlist & User Dropdown */}
          <div className="flex items-center space-x-4">
            {auth.user && (
              <Link href="/wishlist" className="text-gray-600 hover:text-gray-800">
                <Heart className="h-6 w-6" />
              </Link>
            )}

            {auth.user ? (
              <div className="flex items-center space-x-4">
                {/* User Profile with HoverCard */}
                <Link href="/profile">
                  <HoverCard>
                    <HoverCardTrigger className="cursor-pointer">
                      <User className="h-6 w-6 text-gray-600 hover:text-gray-800" />
                    </HoverCardTrigger>
                    <HoverCardContent className="p-4 bg-white border shadow-lg rounded-lg w-48">
                      <div className="text-sm text-gray-700">Email: {auth.user.email}</div>
                      <button
                        onClick={handleLogout}
                        className="mt-2 w-full py-2 text-sm bg-black text-white hover:bg-gray-300 hover:text-black rounded-lg"
                      >
                        Logout
                      </button>
                    </HoverCardContent>
                  </HoverCard>
                </Link>

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
