import { FaStar } from "react-icons/fa";

interface DoctorCardProps {
  name: string;
  image?: string;
  rating: number;
  specialty: string;
}

export function DoctorCard({
  name,
  image = "http://placehold.co/100",
  rating,
  specialty,
}: DoctorCardProps) {
  return (
    <div
      className="
      p-2 my-2 flex-col 
      border-2 border-zinc-100
      rounded-lg bg-white w-[150px]"
    >
      <img
        src={image}
        alt={name}
        className="rounded-sm w-full h-32 object-cover"
      />
      <div className="flex justify-between pt-3">
        <p className="text-lg text-zinc-800 font-normal">{name}</p>
        <div className="flex gap-1 items-center">
          <p className="text-zinc-500 text-sm">{rating}</p>
          <FaStar className="text-amber-300 text-sm" />
        </div>
      </div>
      <p className="text-sm text-zinc-500 mt-1">{specialty}</p>
    </div>
  );
}
