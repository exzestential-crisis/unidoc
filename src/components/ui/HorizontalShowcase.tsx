import Link from "next/link";
import { DoctorCard } from "./DoctorCard";
import { useRef, useState, useEffect } from "react";

type Item = {
  id: string;
  name: string;
  rating: number;
  specialty: string;
  image: string; // match DoctorCard prop name
  hospital?: string; // pass hospital through
  is_veified?: boolean; // pass verified through
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
    // update if you change card size
    const cardWidth = 220 + 16; // card width + gap (matches your Card w-[220px])
    const scrollAmount = cardWidth * 3;
    scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    const cardWidth = 220 + 16;
    const scrollAmount = cardWidth * 3;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    checkScrollButtons();
    // handle resize so button state stays correct
    const handleResize = () => checkScrollButtons();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 h-80 w-20 -translate-y-1/2 z-10 bg-gradient-to-l from-0% to-white"
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
          className="absolute right-0 top-1/2 h-80 w-20 -translate-y-1/2 z-10 bg-gradient-to-r from-0% to-white"
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
          {visibleItems.map((item) => (
            <DoctorCard
              key={item.id} // you can place it directly on DoctorCard
              id={item.id}
              name={item.name}
              image={item.image}
              rating={item.rating}
              specialty={item.specialty}
              hospital={item.hospital}
              is_verified={item.is_veified}
            />
          ))}

          {items.length > 8 && (
            <Link href="" key="see-more-card">
              <div className="flex flex-col justify-center items-center w-32 h-32 rounded-full">
                <p className="text-center text-neutral-400 text-xl pe-2">
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
