// Spinner.tsx
"use client";

type SpinnerProps = {
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  className?: string;
};

export function Spinner({
  size = "md",
  color = "#009689",
  className = "",
}: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-200 border-t-current ${sizeClasses[size]} ${className}`}
      style={{ borderTopColor: color }}
      aria-label="Loading"
    />
  );
}
