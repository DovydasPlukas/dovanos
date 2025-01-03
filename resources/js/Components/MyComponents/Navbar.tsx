import React from "react";
import { Link } from "@inertiajs/react";
import { Heart, Gift, User } from "lucide-react";

export default function Navbar() {
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

          {/* Wishlist & Login */}
          <div className="flex items-center space-x-4">
            <Link href="/wishlist" className="text-gray-600 hover:text-gray-800">
              <Heart className="h-6 w-6" />
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-800">
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Search Bar*/}
      <div className="bg-white p-4 sticky top-[60px] z-40">
        <div className="container mx-auto flex justify-center">
          <input
            type="text"
            placeholder="Search..."
            className="w-full sm:w-1/2 md:w-1/3 h-10 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </>
  );
}
