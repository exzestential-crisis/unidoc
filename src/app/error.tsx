"use client";

import { useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white text-center">
      <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Something went wrong
      </h1>
      <p className="text-gray-600 mb-6">
        Don’t worry, we’re working on it. Try refreshing the page.
      </p>
      <button
        onClick={() => reset()}
        className="bg-[#00BAB8] text-white px-6 py-3 rounded-full font-medium hover:bg-[#00A5A3] transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
