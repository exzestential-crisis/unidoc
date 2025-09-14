import { IoArrowForwardOutline } from "react-icons/io5";

type ArrowForwardType = {
  size?: "small" | "medium" | "large" | "extra-large";
};

const textSizeMap: Record<NonNullable<ArrowForwardType["size"]>, string> = {
  small: "text-sm",
  medium: "text-xl",
  large: "text-3xl",
  "extra-large": "text-6xl",
};

export default function ArrowForward({ size = "medium" }: ArrowForwardType) {
  const textSize = textSizeMap[size];

  return (
    <div className={`${textSize} text-black/30 cursor-pointer`}>
      <IoArrowForwardOutline />
    </div>
  );
}
