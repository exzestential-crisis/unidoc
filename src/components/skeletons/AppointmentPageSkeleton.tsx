"use client";
import { FaCalendarCheck, FaClock } from "react-icons/fa6";
import { FaMapMarkedAlt } from "react-icons/fa";
export default function AppointmentsSkeleton() {
  const skeletonArray = Array(3).fill(0); // 3 skeleton cards

  return (
    <div className="relative min-h-screen bg-white animate-pulse px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
        <div className="h-6 w-40 bg-gray-200 rounded"></div>
        <div className="w-6"></div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Array(3)
          .fill(0)
          .map((_, idx) => (
            <div key={idx} className="text-center p-4 bg-gray-100 rounded-2xl">
              <div className="h-6 w-6 mx-auto bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-10 mx-auto bg-gray-200 rounded mb-1"></div>
              <div className="h-3 w-16 mx-auto bg-gray-200 rounded"></div>
            </div>
          ))}
      </div>

      {/* Skeleton Cards */}
      <div className="space-y-4">
        {skeletonArray.map((_, idx) => (
          <div
            key={idx}
            className="border border-neutral-200 rounded-2xl shadow-sm p-4 bg-white"
          >
            <div className="flex justify-between mb-3">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FaMapMarkedAlt className="text-gray-200" />
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>

                <div className="flex items-center gap-2">
                  <FaCalendarCheck className="text-gray-200" />
                  <div className="h-3 w-28 bg-gray-200 rounded"></div>
                </div>

                <div className="flex items-center gap-2">
                  <FaClock className="text-gray-200" />
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>

              <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
            </div>

            <div className="mt-4 flex gap-2">
              <div className="flex-1 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 h-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
