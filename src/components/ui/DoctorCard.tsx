import { FaStar } from "react-icons/fa";

interface DoctorCardProps {
  name: string;
  image: string;
  rating: number;
  specialty: string;
}

export function DoctorCard({
  name,
  image,
  rating,
  specialty,
}: DoctorCardProps) {
  return (
    <div className="p-4 flex-col shadow-md shadow-zinc-200 rounded-xl bg-white min-w-[180px]">
      <img
        src={image}
        alt={name}
        className="rounded-lg w-full h-32 object-cover"
      />
      <div className="flex justify-between pt-3">
        <p className="text-lg text-zinc-800 font-medium">{name}</p>
        <div className="flex gap-1 items-center">
          <p className="text-zinc-500 text-sm">{rating}</p>
          <FaStar className="text-amber-300 text-sm" />
        </div>
      </div>
      <p className="text-sm text-zinc-500 mt-1">{specialty}</p>
    </div>
  );
}
