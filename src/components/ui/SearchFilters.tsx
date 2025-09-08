// components/ui/SearchFilters.tsx
import React, { useState } from "react";
import { specialties } from "@/constants/specialties";

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void;
  currentFilters: any;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onFilterChange,
  currentFilters,
}) => {
  const [localFilters, setLocalFilters] = useState({
    verified: currentFilters.verified || false,
    accepting_patients: currentFilters.accepting_patients || false,
    specialization_id: currentFilters.specialization_id || "",
    min_experience: currentFilters.min_experience || "",
    max_experience: currentFilters.max_experience || "",
    gender: currentFilters.gender || "",
    language: currentFilters.language || "",
    min_rating: currentFilters.min_rating || "",
  });

  const handleFilterUpdate = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      verified: false,
      accepting_patients: false,
      specialization_id: "",
      min_experience: "",
      max_experience: "",
      gender: "",
      language: "",
      min_rating: "",
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-[#00bab8] hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Checkboxes */}
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={localFilters.verified}
              onChange={(e) => handleFilterUpdate("verified", e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Verified Only</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={localFilters.accepting_patients}
              onChange={(e) =>
                handleFilterUpdate("accepting_patients", e.target.checked)
              }
              className="rounded"
            />
            <span className="text-sm">Accepting Patients</span>
          </label>
        </div>

        {/* Specialty Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Specialty</label>
          <select
            value={localFilters.specialization_id}
            onChange={(e) =>
              handleFilterUpdate("specialization_id", e.target.value)
            }
            className="w-full p-2 border rounded-md text-sm"
          >
            <option value="">All Specialties</option>
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            value={localFilters.gender}
            onChange={(e) => handleFilterUpdate("gender", e.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          >
            <option value="">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Experience Range */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Min Experience (years)
          </label>
          <input
            type="number"
            min="0"
            value={localFilters.min_experience}
            onChange={(e) =>
              handleFilterUpdate("min_experience", e.target.value)
            }
            className="w-full p-2 border rounded-md text-sm"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Max Experience (years)
          </label>
          <input
            type="number"
            min="0"
            value={localFilters.max_experience}
            onChange={(e) =>
              handleFilterUpdate("max_experience", e.target.value)
            }
            className="w-full p-2 border rounded-md text-sm"
            placeholder="50"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-1">Min Rating</label>
          <select
            value={localFilters.min_rating}
            onChange={(e) => handleFilterUpdate("min_rating", e.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          >
            <option value="">Any</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
