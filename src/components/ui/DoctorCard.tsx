import Link from "next/link";
import { FaStar } from "react-icons/fa";

interface DoctorCardProps {
  id: string;
  name: string;
  image?: string;
  rating: number;
  specialty: string;
}

export function DoctorCard({
  id,
  name,
  image = "http://placehold.co/100",
  rating,
  specialty,
}: DoctorCardProps) {
  return (
    <Link href={`/doctor/${id}`}>
      <div
        className="
        p-2 my-2 flex-col
        border-2 border-neutral-100
        rounded-lg bg-white w-[150px]
        hover:shadow-md"
      >
        <img
          src={image}
          alt={name}
          className="rounded-sm w-full h-32 object-cover"
        />
        <div className="flex justify-between pt-3">
          <p className="text-lg text-neutral-800 font-normal">{name}</p>
          <div className="flex gap-1 items-center">
            <p className="text-neutral-500 text-sm">{rating}</p>
            <FaStar className="text-amber-300 text-sm" />
          </div>
        </div>
        <p className="text-sm text-neutral-500 mt-1">{specialty}</p>
      </div>
    </Link>
  );
}
