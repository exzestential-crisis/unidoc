// components/skeletons/DoctorPageSkeleton.tsx
import React from "react";

export default function DoctorPageSkeleton() {
  return (
    <div className="relative min-h-screen bg-white animate-pulse">
      <div className="pb-24 px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <div className="h-6 w-6 bg-gray-300 rounded-full" />{" "}
          {/* ArrowBack placeholder */}
          <div className="h-6 w-32 bg-gray-300 rounded" />
          <div className="w-6" />
        </div>

        {/* Profile Card */}
        <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-gray-100">
          <div className="aspect-video sm:aspect-[4/3] bg-gray-300" />{" "}
          {/* Image */}
          <div className="p-4 space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <div className="h-6 w-48 bg-gray-300 rounded" /> {/* Name */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-300 rounded" />
                <div className="h-4 w-12 bg-gray-300 rounded" />
                <div className="h-4 w-20 bg-gray-300 rounded" />
              </div>
            </div>
            <div className="h-4 bg-gray-300 w-3/4 rounded mt-2" />{" "}
            {/* Specialty/Hospital */}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <div className="relative flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-200" />
              <div className="h-4 bg-gray-300 w-10 rounded" />
              <div className="h-3 bg-gray-300 w-16 rounded" />
            </div>
          ))}
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 bg-gray-300 w-32 rounded" />{" "}
              {/* Section title */}
              <div className="h-4 bg-gray-300 w-full rounded" />
              <div className="h-4 bg-gray-300 w-5/6 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 safe-area-pb flex items-center gap-4 max-w-md mx-auto">
        <div className="h-12 sm:h-14 w-12 sm:w-14 rounded-full bg-gray-200" />{" "}
        {/* Chat */}
        <div className="flex-1 h-12 sm:h-14 bg-gray-300 rounded" /> {/* Book */}
      </div>
    </div>
  );
}
