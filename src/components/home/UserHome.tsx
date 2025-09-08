"use client";

import { useState } from "react";
import { SearchBar } from "@/components/ui";
import Header from "@/components/ui/Header";
import ErrorState from "@/components/ui/ErrorState";
import SpecialtySection from "@/components/ui/SpecialtySection";
import {
  DoctorsNearYouSection,
  TopDoctorsSection,
  AvailableTodaySection,
} from "@/components/ui/DoctorSections";
import { useDoctors } from "@/lib/hooks/use-doctors";
import {
  getPrioritizedSpecialties,
  getDisplayedSpecialties,
} from "@/utils/specialtyUtils";
import {
  transformDoctorForCard,
  transformDoctorForRowCard,
  categorizeDoctors,
} from "@/utils/doctorUtils";

// Updated Home page to remove onSpecialtyClick prop
export default function Home() {
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);
  const { doctors, loading, error } = useDoctors(); // Removed handleSearch

  // Get and organize specialties
  const specialties = getPrioritizedSpecialties();
  const displayedSpecialties = getDisplayedSpecialties(
    specialties,
    showAllSpecialties
  );

  // Categorize doctors
  const { doctorsNearYou, topDoctors, availableToday } =
    categorizeDoctors(doctors);

  // Transform doctors for display
  const doctorsNearYouCards = doctorsNearYou.map(transformDoctorForCard);
  console.log("transformed cards sample:", doctorsNearYouCards[0]);
  const topDoctorsCards = topDoctors.map(transformDoctorForRowCard);
  const availableTodayCards = availableToday.map(transformDoctorForCard);

  // Event handlers
  const handleToggleSpecialties = () => {
    setShowAllSpecialties((prev) => !prev);
  };

  // Error state (simplified since search is handled elsewhere)
  if (error) {
    return (
      <div className="homepage bg-[#00bab8]">
        <div className="container mx-auto p-4">
          <Header />
        </div>
        <div className="rounded-2xl bg-white p-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-500">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage bg-[#00bab8]">
      <div className="container mx-auto p-4">
        <Header />
        <div className="p-4">
          <SearchBar /> {/* No onSearch prop - will redirect to search page */}
        </div>
      </div>
      <div className="rounded-2xl bg-white p-4">
        {/* Specialty Section */}
        <SpecialtySection
          specialties={displayedSpecialties}
          showAllSpecialties={showAllSpecialties}
          onToggleShowAll={handleToggleSpecialties}
        />

        {/* Rest of the sections remain the same */}
        <DoctorsNearYouSection
          title="Doctors Near You"
          doctors={doctorsNearYouCards}
          loading={loading}
        />

        <TopDoctorsSection topDoctors={topDoctorsCards} loading={loading} />

        <AvailableTodaySection
          title="Available Today"
          doctors={availableTodayCards}
          loading={loading}
        />

        {doctors.length === 0 && !loading && (
          <div className="flex items-center justify-center h-32">
            <div className="text-lg text-gray-500">No doctors found</div>
          </div>
        )}
        <div className="h-20 w-full" />
      </div>
    </div>
  );
}
