import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void; // Made optional for home page
  defaultValue?: string;
  redirectToSearch?: boolean; // New prop to control redirection
}

export function SearchBar({
  placeholder = "Search doctors, specialties...",
  onSearch,
  defaultValue = "",
  redirectToSearch = true, // Default to true for home page
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSearch = () => {
    const query = searchQuery.trim();

    if (!query) return; // Don't search with empty query

    if (redirectToSearch) {
      // Redirect to search page with query
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else if (onSearch) {
      // Use provided onSearch function (for search page)
      onSearch(query);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleIconClick = () => {
    handleSearch();
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        className="
          bg-white text-black
          w-full p-4 rounded-xl
          shadow shadow-neutral-200
          focus:outline-none focus:ring-2 focus:ring-[#00BAB8]/20 focus:border-[#00BAB8]
          border border-transparent
        "
      />
      <FaSearch
        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 cursor-pointer hover:text-neutral-500 transition-colors"
        onClick={handleIconClick}
      />
    </div>
  );
}
