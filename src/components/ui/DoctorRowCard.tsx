import { FaStar } from "react-icons/fa";
import Link from "next/link";

interface DoctorRowCardProps {
  id: string;
  name: string;
  specialty: string;
  hospital?: string;
  rating: number;
  reviews?: number;
  image?: string;
}

export function DoctorRowCard({
  id,
  name,
  specialty,
  hospital = "Hospital",
  rating,
  reviews = 0,
  image = "http://placehold.co/100",
}: DoctorRowCardProps) {
  return (
    <Link href={`/doctor/${id}`} className="block">
      <div className="flex items-center p-4 bg-white border-2 border-neutral-100 rounded-xl h-36 gap-4 hover:shadow-md cursor-pointer transition">
        <img
          src={image}
          alt={name}
          className="h-28 w-28 rounded-md object-cover flex-shrink-0"
        />
        <div className="flex flex-col justify-between h-full py-2">
          <div>
            <p className="font-semibold text-lg text-neutral-800 truncate">
              {name}
            </p>
            <p className="font-medium text-neutral-500 text-sm truncate">
              {specialty} | {hospital}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaStar className="text-amber-400" />
            <p className="font-medium text-neutral-800">{rating.toFixed(1)}</p>
            <p className="text-neutral-400 text-sm">({reviews} reviews)</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
