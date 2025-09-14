// app/search/page.tsx
"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/components/ui";
import Header from "@/components/ui/Header";
import ErrorState from "@/components/ui/ErrorState";
import SearchResults from "@/components/ui/SearchResults";
import SearchFilters from "@/components/ui/SearchFilters";
import { useDoctors } from "@/lib/hooks/use-doctors";
import {
  transformDoctorForCard,
  transformDoctorForRowCard,
} from "@/utils/doctorUtils";
import { specialties as allSpecialties } from "@/constants/specialties";
import { DoctorSearchFilters } from "@/types/doctor";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const specializationId = searchParams.get("specialization_id") || undefined;
  const q = searchParams.get("q") || "";

  const [viewMode, setViewMode] = useState<"cards" | "horizontal">("cards");
  const [showFilters, setShowFilters] = useState(false);

  // pass initial filters
  const { doctors, loading, error, filters, handleSearch, updateFilters } =
    useDoctors({
      q,
      specialization_id: specializationId,
      limit: 20,
      offset: 0,
    });

  // update URL + filters when searching
  const handleSearchUpdate = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    router.push(`/search?${params.toString()}`);
    handleSearch(query);
  };

  const handleFilterChange = (newFilters: DoctorSearchFilters) => {
    updateFilters(newFilters);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "cards" ? "horizontal" : "cards"));
  };

  if (error) {
    return <ErrorState error={error} onSearch={handleSearchUpdate} />;
  }

  // Transform doctors based on view mode
  const transformedDoctors =
    viewMode === "cards"
      ? doctors.map(transformDoctorForCard)
      : doctors.map(transformDoctorForRowCard);

  return (
    <div className="search-page bg-[#00bab8] min-h-[100dvh]">
      {/* Header Section - Mobile optimized */}
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <Header />
        <div className="px-1 sm:px-4 py-2 sm:py-4">
          <SearchBar
            onSearch={handleSearchUpdate}
            defaultValue={searchParams.get("q") || ""}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-t-2xl sm:rounded-t-2xl bg-white p-3 sm:p-4 min-h-[calc(100vh-160px)] h-full w-full">
        {/* Search Header - Mobile responsive */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Title and Results Count */}
          <div className="flex flex-col gap-1 sm:gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-[#525858] leading-tight">
              Search results{" "}
              {filters.q ? (
                <>for &quot;{filters.q}&quot;</>
              ) : filters.specialization_id ? (
                <>
                  for{" "}
                  {allSpecialties.find(
                    (s) => s.id === filters.specialization_id
                  )?.name || filters.specialization_id}
                </>
              ) : null}
            </h2>

            {/* Move count below */}
            <span className="text-sm text-gray-500">
              {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {/* Action Buttons - Mobile responsive */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            {/* View Mode Toggle - Hidden on mobile for better UX */}
            <button
              onClick={toggleViewMode}
              className="hidden sm:flex px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
            >
              {viewMode === "cards" ? "List View" : "Card View"}
            </button>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 sm:px-4 py-2 text-sm border rounded-lg transition-colors flex items-center gap-2 ${
                showFilters
                  ? "bg-[#00bab8] text-white border-[#00bab8]"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                />
              </svg>
              <span className="hidden sm:inline">Filters</span>
              <span className="sm:hidden">Filter</span>
            </button>
          </div>
        </div>

        {/* Filters Panel - Mobile optimized */}
        {showFilters && (
          <div className="mb-4 sm:mb-6">
            {/* Mobile: Slide-up overlay style */}
            <div className="sm:bg-transparent bg-gray-50 sm:p-0 p-4 sm:border-0 border border-gray-200 rounded-lg">
              <SearchFilters
                onFilterChange={handleFilterChange}
                currentFilters={filters}
              />
            </div>
          </div>
        )}

        {/* Search Results - Mobile optimized */}
        <div className="search-results-container">
          <SearchResults
            doctors={transformedDoctors}
            loading={loading}
            viewMode={viewMode}
            onLoadMore={() => {
              updateFilters({
                offset: (filters.offset ?? 0) + (filters.limit ?? 20),
              });
            }}
            hasMore={doctors.length >= (filters.limit ?? 20)}
          />
        </div>

        {/* No results message - Mobile responsive */}
        {doctors.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-48 sm:h-64 px-4 text-center">
            <div className="text-base sm:text-lg text-gray-500 mb-2">
              No doctors found
            </div>
            <div className="text-sm text-gray-400 max-w-sm">
              Try adjusting your search terms or filters
            </div>
          </div>
        )}

        {/* Bottom spacing - Mobile safe area */}
        <div className="h-16 sm:h-20 w-full" />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="search-page bg-[#00bab8] min-h-screen">
          {/* Loading state - Mobile responsive */}
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <Header />
            <div className="px-1 sm:px-4 py-2 sm:py-4">
              <div className="bg-white p-3 sm:p-4 rounded-xl animate-pulse h-10 sm:h-12"></div>
            </div>
          </div>

          <div className="rounded-t-2xl sm:rounded-2xl bg-white mx-1 sm:mx-0 p-3 sm:p-4">
            <div className="animate-pulse">
              {/* Mobile loading skeleton */}
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-32 sm:w-48 mb-4"></div>
              <div className="space-y-3 sm:space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 sm:h-32 bg-gray-200 rounded"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
