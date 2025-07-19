"use client";

import { Loader2 } from "lucide-react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <Loader2 className="w-10 h-10 animate-spin text-gray-700" />
    </div>
  );
}
