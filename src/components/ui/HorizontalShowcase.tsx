import Link from "next/link";
import { DoctorCard } from "./DoctorCard";
import { useRef, useState, useEffect } from "react";

type Item = {
  name: string;
  rating: number;
  specialty: string;
  img?: string;
};

type HorizontalShowcaseCards = {
  items: Item[];
};

export default function HorizontalShowcase({ items }: HorizontalShowcaseCards) {
  const visibleItems = items.slice(0, 8);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const scrollLeft = () => {
    if (!scrollRef.current) return;
    // Calculate width of 3 cards + gaps (assuming each card is ~160px + 16px gap)
    const cardWidth = 170 + 16; // card width + gap
    const scrollAmount = cardWidth * 3;
    scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    // Calculate width of 3 cards + gaps
    const cardWidth = 170 + 16; // card width + gap
    const scrollAmount = cardWidth * 3;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    checkScrollButtons();
  }, []);

  return (
    <div className="relative">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 h-60 w-20 -translate-y-1/2 z-10 bg-gradient-to-l from-0% to-white"
        >
          <span className="text-2xl font-bold text-gray-600 dark:text-gray-300 pr-10">
            &lt;
          </span>
        </button>
      )}

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 h-60 w-20 -translate-y-1/2 z-10 bg-gradient-to-r from-0% to-white"
        >
          <span className="text-2xl font-bold text-gray-600 dark:text-gray-300 pl-10">
            &gt;
          </span>
        </button>
      )}

      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scroll-smooth hide-scrollbar"
        onScroll={checkScrollButtons}
      >
        <div className="flex w-max items-center gap-4">
          {visibleItems.map((item, index) => (
            <div key={index}>
              <DoctorCard
                name={item.name}
                image={item.img}
                rating={item.rating}
                specialty={item.specialty}
              />
            </div>
          ))}
          {items.length > 8 && (
            <Link href="">
              <div className="flex flex-col justify-center items-center w-32 h-32 rounded-full">
                <p className="text-center text-zinc-400 text-xl pe-2">
                  See more
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
