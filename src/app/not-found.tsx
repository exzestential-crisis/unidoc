"use client";

import { useRouter } from "next/navigation";
import { FaCalendarCheck } from "react-icons/fa";

export default function ComingSoonPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-[100dvh] bg-white flex flex-col items-center justify-center px-6">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <FaCalendarCheck className="text-[#00BAB8] text-7xl" />
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
        Coming Soon
      </h1>

      {/* Subtext */}
      <p className="text-gray-600 text-center max-w-md mb-8">
        We’re working hard to bring you this feature. Check back later for
        updates!
      </p>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/")}
          className="bg-[#00BAB8] text-white px-6 py-3 rounded-full font-medium hover:bg-[#00A5A3] transition-colors"
        >
          Back to Home
        </button>
        <button
          onClick={() => router.push("/appointments")}
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
        >
          My Appointments
        </button>
      </div>
    </div>
  );
}
