import { FaStar } from "react-icons/fa";

interface DoctorRowCardProps {
  name: string;
  specialty: string;
  hospital?: string;
  rating: number;
  reviews?: number;
  image?: string;
}

export function DoctorRowCard({
  name,
  specialty,
  hospital = "Hospital",
  rating,
  reviews = 0,
  image = "http://placehold.co/100",
}: DoctorRowCardProps) {
  return (
    <div className="flex items-center p-2 bg-white border-2 border-neutral-100 rounded-lg h-32 gap-2">
      <img src={image} alt={name} className="h-28 rounded-sm" />
      <div className="flex flex-col justify-between h-full py-1">
        <div>
          <p className="font-normal text-lg text-neutral-800">{name}</p>
          <p className="font-medium text-neutral-500">
            {specialty} | {hospital}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FaStar className="text-amber-300 -translate-y-0.5" />
          <p className="font-medium text-neutral-800">{rating.toFixed(1)}</p>
          <p className="text-neutral-400 text-sm">({reviews} reviews)</p>
        </div>
      </div>
    </div>
  );
}
