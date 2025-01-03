import React from "react";
import { Link } from "@inertiajs/react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-5">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-sm text-gray-400">
          Solidus Kodas &copy; {new Date().getFullYear()}
        </div>

        <div className="flex space-x-6">
          <Link href="/kontaktai" className="hover:text-gray-400">
            Kontaktai
          </Link>
          <Link href="/apie" className="hover:text-gray-400">
            Apie
          </Link>
        </div>
      </div>
    </footer>
  );
}
