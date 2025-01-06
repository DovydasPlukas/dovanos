import React from 'react';

const SearchBar = () => {
  return (
    <div className="bg-white p-4 sticky top-[60px] z-40">
      <div className="container mx-auto flex justify-center">
        <input
          type="text"
          placeholder="Search... (not working)"
          className="w-full sm:w-1/2 md:w-1/3 h-10 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};

export default SearchBar;
