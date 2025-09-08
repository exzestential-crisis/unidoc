import React from "react";
import { useRouter } from "next/navigation";
import { Specialty } from "@/constants/specialties";

interface SpecialtySectionProps {
  specialties: Specialty[];
  showAllSpecialties: boolean;
  onToggleShowAll: () => void;
}

const SpecialtySection: React.FC<SpecialtySectionProps> = ({
  specialties,
  showAllSpecialties,
  onToggleShowAll,
}) => {
  const router = useRouter();

  const handleSpecialtyClick = (specialty: Specialty) => {
    // Use specialization_id to match API expectations
    router.push(
      `/search?specialization_id=${encodeURIComponent(specialty.id)}`
    );
  };

  return (
    <div className="flex-col">
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-semibold text-[#525858]">
          Doctors Specialty
        </h3>
        {specialties.length > 6 && (
          <button
            className="text-neutral-500 cursor-pointer"
            onClick={onToggleShowAll}
          >
            {showAllSpecialties ? "Show less" : "See more"}
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {specialties.map((specialty) => (
          <button
            key={specialty.id}
            onClick={() => handleSpecialtyClick(specialty)}
            className="flex flex-col items-center justify-center py-8 rounded-lg text-sm text-slate-900 border-4 border-zinc-200 bg-white shadow-[0_6px_0_theme('colors.zinc.200')] hover:shadow-[0_6px_0_theme('colors.zinc.300')] hover:bg-white hover:border-zinc-300 active:translate-y-2 active:shadow-[0_2px_0_theme('colors.zinc.300')] active:bg-zinc-100 active:border--zinc-200 transition-all"
          >
            {specialty.icon && (
              <span
                className={`flex items-center justify-center w-16 h-16 rounded-full ${
                  specialty.color || "bg-gray-100"
                } mb-2`}
              >
                <img
                  src={specialty.icon}
                  className="w-12 h-12 object-contain"
                  alt={specialty.name}
                />
              </span>
            )}
            {specialty.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpecialtySection;
