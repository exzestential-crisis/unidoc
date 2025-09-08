// components/skeletons/DoctorSkeletons.tsx
import React from "react";

export const DoctorRowCardSkeleton = () => (
  <div className="flex items-center p-2 border-2 border-neutral-100 rounded-lg h-32 gap-2">
    <div className="h-28 w-24 bg-gray-200 rounded-sm animate-pulse" />
    <div className="flex flex-col justify-between h-full py-1 flex-1">
      <div>
        <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-8 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
      </div>
    </div>
  </div>
);

export const DoctorCardSkeleton = () => (
  <div className="p-2 my-2 flex-col border-2 border-neutral-100 rounded-lg w-[150px]">
    <div className="rounded-sm w-full h-32 bg-gray-200 animate-pulse" />
    <div className="flex justify-between pt-3">
      <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
      <div className="flex gap-1 items-center">
        <div className="h-4 bg-gray-200 rounded w-6 animate-pulse" />
        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-16 mt-1 animate-pulse" />
  </div>
);

export const HorizontalShowcaseSkeleton = () => (
  <div className="flex gap-2 overflow-hidden">
    {[...Array(4)].map((_, i) => (
      <DoctorCardSkeleton key={i} />
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
