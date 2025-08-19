import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = "Search..." }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        className="
          bg-white text-black 
          w-full p-4 rounded-xl
          shadow shadow-neutral-200 
          focus:outline-none focus:ring-none
        "
      />
      <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300" />
    </div>
  );
}
