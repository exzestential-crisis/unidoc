"use client";

export default function BookPageSkeleton() {
  return (
    <div className="min-h-screen p-6 w-full bg-gray-50 animate-pulse flex-1 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>

      {/* Step 1: Services skeleton */}
      <div className="space-y-4">
        <div className="h-5 w-36 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          {Array(4)
            .fill(0)
            .map((_, idx) => (
              <div key={idx} className="h-40 bg-gray-200 rounded-2xl"></div>
            ))}
        </div>
      </div>

      {/* Step 2: Concern input skeleton */}
      <div className="space-y-4">
        <div className="h-5 w-36 bg-gray-200 rounded mb-2"></div>
        <div className="h-24 bg-gray-200 rounded-xl"></div>
      </div>

      {/* Step 3: Slots skeleton */}
      <div className="space-y-4">
        <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
        <div className="flex gap-2 overflow-x-auto">
          {Array(3)
            .fill(0)
            .map((_, idx) => (
              <div key={idx} className="h-10 w-20 bg-gray-200 rounded-lg"></div>
            ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array(4)
            .fill(0)
            .map((_, idx) => (
              <div key={idx} className="h-12 bg-gray-200 rounded-lg"></div>
            ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-4">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}
