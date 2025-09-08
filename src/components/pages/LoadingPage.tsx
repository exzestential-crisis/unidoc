// LoadingPage.tsx
"use client";

import { Spinner } from "../ui/Spinner";

type LoadingPageProps = {
  message?: string;
  showLogo?: boolean;
  fullScreen?: boolean;
  backgroundColor?: string;
};

export function LoadingPage({
  message = "Loading...",
  showLogo = false,
  fullScreen = true,
  backgroundColor = "bg-white",
}: LoadingPageProps) {
  const containerClass = fullScreen
    ? `fixed inset-0 ${backgroundColor} flex flex-col items-center justify-center z-50`
    : `flex flex-col items-center justify-center p-8 ${backgroundColor}`;

  return (
    <div className={containerClass}>
      {showLogo && (
        <div className="mb-8">
          {/* Replace with your app logo */}
          <div className="w-16 h-16 bg-[#009689] rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">U</span>
          </div>
        </div>
      )}

      <Spinner size="lg" />

      <p className="mt-4 text-gray-600 text-lg font-medium">{message}</p>
    </div>
  );
}

// Alternative compact loading component for smaller spaces
export function LoadingSpinner({
  message = "Loading...",
  size = "md" as "sm" | "md" | "lg" | "xl",
}: {
  message?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Spinner size={size} />
      <p className="mt-2 text-gray-500 text-sm">{message}</p>
    </div>
  );
}
