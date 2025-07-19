"use client";

import { MdArrowBackIos } from "react-icons/md";

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

  return (
    <div className={`cursor-pointer text-black/30 ${textSize} p-2`}>
      <MdArrowBackIos />
    </div>
  );
}
