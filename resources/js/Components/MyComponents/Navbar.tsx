import React, { useState, FormEvent } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Heart, Gift, User, LogOut, Settings, Search } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/Components/ui/hover-card";
import { Input } from "@/Components/ui/input";
import axios from "axios";

interface User {
  is_admin: number;
  email: string;
}

interface SearchResult {
  id: number;
  name: string;
  image_url: string;
  price: number;
}

export default function Navbar() {
  const { auth } = usePage().props;
  const user = auth.user as unknown as User;
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    router.post(route("logout"), {}, { preserveScroll: true });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchResults.length === 0 && searchTerm.trim()) {
      router.get('/items', { search: searchTerm });
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 2) {
      try {
        const response = await axios.get(`/api/search?q=${value}`);
        setSearchResults(response.data.slice(0, 3)); // Limit to 3 items
      } catch (error) {
        console.error('Error searching:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <>
      <nav className="bg-white p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px h-full">
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="text-xl font-semibold text-gray-800 flex items-center"
            >
              <Gift className="h-6 w-6 text-gray-800 mr-2" />
              <span>Dovanų idėjų platforma</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <Link
                href={user.is_admin === 1 ? "/dashboard" : "/wishlist"}
                className="text-gray-600 hover:text-gray-800"
              >
                {user.is_admin === 1 ? (
                  <Settings className="h-6 w-6" />
                ) : (
                  <Heart className="h-6 w-6" />
                )}
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <HoverCard>
                  <HoverCardTrigger>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="h-6 w-6 text-gray-600 hover:text-gray-800" />
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent className="p-4 bg-white border shadow-lg rounded-lg w-48">
                    <div className="text-sm text-gray-700">
                      El. paštas: {user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="mt-2 w-full py-2 text-sm bg-black text-white hover:bg-gray-300 hover:text-black rounded-lg"
                    >
                      Atsijungti
                    </button>
                  </HoverCardContent>
                </HoverCard>

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

      <div className="bg-white p-4 sticky top-[60px] z-40">
        <div className="container mx-auto flex justify-center relative">
          <form onSubmit={handleSubmit} className="w-full sm:w-1/2 md:w-1/3 relative">
            <Input
              type="text"
              placeholder="Ieškoti dovanų..."
              className="w-full h-10 pr-10"
              onChange={handleSearch}
              value={searchTerm}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Search className="h-5 w-5" />
            </button>
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg mt-1 overflow-y-auto">
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    href={`/items/${result.id}`}
                    className="px-4 py-2 hover:bg-gray-100 flex items-center"
                  >
                    <img src={result.image_url} alt={result.name} className="w-10 h-10 mr-2 object-cover" />
                    <div>
                      <div>{result.name}</div>
                      <div className="text-gray-500 text-sm">{result.price} €</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

