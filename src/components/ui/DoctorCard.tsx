import Link from "next/link";
import { FaStar } from "react-icons/fa";

type DoctorCardProps = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
  hospital?: string;
};

export function DoctorCard({
  id,
  name,
  image = "http://placehold.co/400x300",
  rating,
  specialty,
  hospital,
}: DoctorCardProps) {
  return (
    <Link href={`/doctor/${id}`}>
      <div
        className="
          p-4 my-3 flex-col
          border-2 border-neutral-100
          rounded-xl bg-white
          hover:shadow-md
          w-[220px] h-[310px]   /* slightly taller for hospital */
        "
      >
        <img
          src={image}
          alt={name}
          className="rounded-md w-full h-44 object-cover"
        />

        {/* Doctor name */}
        <p className="mt-3 text-xl text-neutral-800 font-semibold truncate">
          {name}
        </p>

        {/* Specialty + rating row */}
        <div className="flex justify-between items-center mt-1">
          <p className="text-neutral-500 text-md truncate">{specialty}</p>
          <div className="flex items-center gap-1">
            <p className="text-sm text-neutral-600">{rating}</p>
            <FaStar className="text-amber-400 " />
          </div>
        </div>

        {/* Hospital */}
        <p className=" text-neutral-500 truncate mt-1">
          {hospital || "No hospital listed"}
        </p>
      </div>
    </Link>
  );
}
