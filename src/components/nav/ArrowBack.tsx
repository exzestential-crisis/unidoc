"use client";

import { IoArrowBackOutline } from "react-icons/io5";

type ArrowBackType = {
  size?: "small" | "medium" | "large" | "extra-large";
};

const textSizeMap: Record<NonNullable<ArrowBackType["size"]>, string> = {
  small: "text-sm",
  medium: "text-xl",
  large: "text-3xl",
  "extra-large": "text-6xl",
};

export default function ArrowBack({ size = "medium" }: ArrowBackType) {
  const textSize = textSizeMap[size];

  return (
    <div className={`cursor-pointer text-black/30 ${textSize}`}>
      <IoArrowBackOutline />
    </div>
  );
}
