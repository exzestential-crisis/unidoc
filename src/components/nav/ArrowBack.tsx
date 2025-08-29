"use client";

import { MdArrowBackIos } from "react-icons/md";
import { useRouter } from "next/navigation";

type ArrowBackType = {
  size?: "small" | "medium" | "large" | "extra-large";
};

const textSizeMap: Record<NonNullable<ArrowBackType["size"]>, string> = {
  small: "text-sm",
  medium: "text-xl",
  large: "text-4xl",
  "extra-large": "text-6xl",
};

export default function ArrowBack({ size = "medium" }: ArrowBackType) {
  const textSize = textSizeMap[size];
  const router = useRouter();

  return (
    <div
      className={`cursor-pointer text-black/30 ${textSize}`}
      onClick={() => router.back()}
    >
      <div className="flex items-center justify-center bg-black/10 ps-1 rounded-full w-10 h-10">
        <MdArrowBackIos />
      </div>
    </div>
  );
}
