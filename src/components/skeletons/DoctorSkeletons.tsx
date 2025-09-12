// components/skeletons/DoctorSkeletons.tsx
import React from "react";

export const DoctorRowCardSkeleton = () => (
  <div className="flex items-center p-4 border-2 border-neutral-100 rounded-xl h-36 gap-4 animate-pulse">
    {/* Image placeholder */}
    <div className="h-28 w-28 bg-gray-300 rounded-md flex-shrink-0" />

    {/* Info column */}
    <div className="flex flex-col justify-between h-full flex-1 min-w-0 py-2">
      <div>
        {/* Name placeholder */}
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        {/* Specialty + Hospital placeholder */}
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
      {/* Rating row placeholder */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-gray-300 rounded"></div>
        <div className="h-5 bg-gray-300 rounded w-8"></div>
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </div>
    </div>
  </div>
);

export const DoctorCardSkeleton = () => (
  <div className="p-4 flex flex-col border-2 border-neutral-100 rounded-xl w-[220px] h-[290px] animate-pulse">
    {/* Image placeholder */}
    <div className="w-full h-44 bg-gray-300 rounded-md" />

    {/* Name placeholder */}
    <div className="mt-3 h-6 bg-gray-300 rounded w-3/4" />

    {/* Specialty + rating row placeholder */}
    <div className="flex justify-between items-center mt-2">
      <div className="h-5 bg-gray-300 rounded w-1/2"></div>
      <div className="flex items-center gap-1">
        <div className="h-4 w-6 bg-gray-300 rounded"></div>
        <div className="h-4 w-4 bg-gray-300 rounded"></div>
      </div>
    </div>

    {/* Hospital placeholder */}
    <div className="mt-2 h-4 bg-gray-300 rounded w-2/3"></div>
  </div>
);

export const HorizontalShowcaseSkeleton = () => (
  <div className="relative w-full flex justify-start gap-4">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="flex-shrink-0 w-[220px] h-[290px] animate-pulse"
        style={{
          position: "relative",
          left: i * -40, // negative offset for overlap/overflow effect
          zIndex: 3 - i, // ensure first card is on top
        }}
      >
        <DoctorCardSkeleton />
      </div>
    ))}
  </div>
);

export const TopDoctorsSkeletons = () => (
  <>
    {[...Array(3)].map((_, i) => (
      <div key={i} className="mb-4">
        <DoctorRowCardSkeleton />
      </div>
    ))}
  </>
);
