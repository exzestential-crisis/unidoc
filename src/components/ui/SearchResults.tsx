// components/ui/SearchResults.tsx
import React from "react";
import { DoctorCard, DoctorRowCard } from "@/types/doctor";
import {
  DoctorCard as DoctorCardComponent,
  DoctorRowCard as DoctorRowCardComponent,
} from "@/components/ui";
import {
  DoctorCardSkeleton,
  DoctorRowCardSkeleton,
} from "@/components/skeletons/DoctorSkeletons";

interface SearchResultsProps {
  doctors: (DoctorCard | DoctorRowCard)[];
  loading: boolean;
  viewMode: "cards" | "horizontal";
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  doctors,
  loading,
  viewMode,
  onLoadMore,
  hasMore = false,
}) => {
  const renderSkeletons = () => {
    const SkeletonComponent =
      viewMode === "cards" ? DoctorCardSkeleton : DoctorRowCardSkeleton;
    return (
      <div
        className={
          viewMode === "cards"
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "space-y-4"
        }
      >
        {[...Array(8)].map((_, i) => (
          <SkeletonComponent key={i} />
        ))}
      </div>
    );
  };

  const renderDoctors = () => {
    if (viewMode === "cards") {
      return (
        <div className="flex justify-center w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(doctors as DoctorCard[]).map((doctor) => (
              <DoctorCardComponent key={doctor.id} {...doctor} />
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          {(doctors as DoctorRowCard[]).map((doctor) => (
            <DoctorRowCardComponent key={doctor.id} {...doctor} />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="search-results">
      {loading && doctors.length === 0 ? (
        renderSkeletons()
      ) : (
        <>
          {renderDoctors()}

          {/* Load More Button */}
          {hasMore && !loading && (
            <div className="flex justify-center mt-8">
              <button
                onClick={onLoadMore}
                className="px-6 py-2 bg-[#00bab8] text-white rounded-lg hover:bg-[#009a98] transition-colors"
              >
                Load More
              </button>
            </div>
          )}

          {/* Loading indicator for load more */}
          {loading && doctors.length > 0 && (
            <div className="flex justify-center mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00bab8]"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
