import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Rechercher un cours, une ressource, un sujet...",
  value,
  onChange,
  className = '',
}: SearchBarProps) {
  return (
    <div className={`relative flex items-center w-full max-w-xl ${className}`}>
      <Search className="absolute left-4 w-4 h-4 text-stone-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-2.5 bg-[#EDE6DB] focus:bg-white text-stone-800 placeholder-stone-500 text-xs sm:text-sm rounded-xl border border-transparent focus:border-stone-300 focus:outline-none transition-all duration-200"
      />
    </div>
  );
}
export default SearchBar;

