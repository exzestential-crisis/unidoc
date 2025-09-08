// components/ErrorState.tsx
import React from "react";
import Header from "./Header";
import { SearchBar } from "@/components/ui";

interface ErrorStateProps {
  error: string;
  onSearch: (query: string) => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onSearch }) => {
  return (
    <div className="homepage bg-[#00bab8]">
      <div className="container mx-auto p-4">
        <Header />
        <div className="p-4">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
      <div className="rounded-2xl bg-white p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
