"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SearchBar, DoctorRowCard } from "@/components/ui";
import HorizontalShowcase from "@/components/ui/HorizontalShowcase";
import {
  specialties as allSpecialties,
  Specialty,
} from "@/constants/specialties";
import { FaRegBell } from "react-icons/fa";
import { id } from "zod/locales";

interface Doctor {
  id: string;
  user_id: string;
  specialization_id: string;
  bio: string;
  rating_average: number;
  total_reviews: number;
  years_experience: number;
  is_verified: boolean;
  is_accepting_patients: boolean;
  consultation_fee: number;
  hospital_affiliation: string;
  languages_spoken: string[];
  availability_schedule: any;
  created_at: string;
  users: {
    first_name: string;
    last_name: string;
    gender: string;
    phone: string;
  };
}

interface ApiResponse {
  data: Doctor[];
  count: number;
  success: boolean;
}

export default function Home() {
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Priority first six specialties
  const priorityOrder = [
    "General Practice",
    "Pediatrics",
    "Cardiology",
    "Pulmonologist",
    "Nephrologist",
    "Gastro-enterologist",
  ];

  const prioritized: Specialty[] = [];
  const remaining: Specialty[] = [];

  allSpecialties.forEach((s) => {
    if (priorityOrder.includes(s.name)) {
      prioritized[priorityOrder.indexOf(s.name)] = s;
    } else {
      remaining.push(s);
    }
  });

  const specialties = [...prioritized, ...remaining];
  const displayedSpecialties = showAllSpecialties
    ? specialties
    : specialties.slice(0, 6);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/doctors?limit=50");

        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const result: ApiResponse = await response.json();

        if (result.success && result.data) {
          setDoctors(result.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Helper function to get specialty name by ID
  const getSpecialtyName = (specializationId: string): string => {
    const specialty = allSpecialties.find((s) => s.id === specializationId);
    return specialty?.name || "General Practice";
  };

  // Helper function to format doctor name
  const formatDoctorName = (doctor: Doctor): string => {
    return `Dr. ${doctor.users.first_name} ${doctor.users.last_name}`;
  };

  // Transform doctor data for components
  const transformDoctorForRowCard = (doctor: Doctor) => ({
    id: doctor.id,
    name: formatDoctorName(doctor),
    specialty: getSpecialtyName(doctor.specialization_id),
    hospital: doctor.hospital_affiliation || "Hospital",
    rating: doctor.rating_average || 0,
    reviews: doctor.total_reviews || 0,
    image: "http://placehold.co/100", // You can add profile images later
  });

  const transformDoctorForCard = (doctor: Doctor) => ({
    id: doctor.id,
    name: formatDoctorName(doctor),
    specialty: getSpecialtyName(doctor.specialization_id),
    rating: doctor.rating_average || 0,
    image: "http://placehold.co/100", // You can add profile images later
  });

  // Get different categories of doctors
  const doctorsNearYou = doctors.slice(0, 6); // For now, just take first 6

  const topDoctors = [...doctors]
    .sort((a, b) => (b.rating_average || 0) - (a.rating_average || 0))
    .slice(0, 3);

  const availableToday = doctors
    .filter((doctor) => doctor.is_accepting_patients)
    .slice(0, 6);

  // Skeleton components
  const DoctorRowCardSkeleton = () => (
    <div className="flex items-center p-2 border-2 border-neutral-100 rounded-lg h-32 gap-2">
      <div className="h-28 w-24 bg-gray-200 rounded-sm animate-pulse" />
      <div className="flex flex-col justify-between h-full py-1 flex-1">
        <div>
          <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-8 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
        </div>
      </div>
    </div>
  );

  const DoctorCardSkeleton = () => (
    <div className="p-2 my-2 flex-col border-2 border-neutral-100 rounded-lg w-[150px]">
      <div className="rounded-sm w-full h-32 bg-gray-200 animate-pulse" />
      <div className="flex justify-between pt-3">
        <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
        <div className="flex gap-1 items-center">
          <div className="h-4 bg-gray-200 rounded w-6 animate-pulse" />
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-16 mt-1 animate-pulse" />
    </div>
  );

  const HorizontalShowcaseSkeleton = () => (
    <div className="flex gap-2 overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <DoctorCardSkeleton key={i} />
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="homepage bg-[#00bab8]">
        <div className="container mx-auto p-4">
          <div className="header flex justify-between items-center">
            <div className="flex items-center justify-start">
              <img
                src="http://placehold.co/50"
                alt="Logo"
                className="h-16 me-4"
              />
              <h2 className="text-[#525858] font-semibold text-lg text-start">
                Whenever, Wherever
              </h2>
            </div>
            <div className="flex items-center">
              <FaRegBell className="text-4xl" />
            </div>
          </div>
          <div className="p-4">
            <SearchBar />
          </div>
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
      <div className="container mx-auto p-4 ">
        {/* Header */}
        <div className="header flex justify-between items-center">
          <div className="flex items-center justify-start">
            <img
              src="http://placehold.co/50"
              alt="Logo"
              className="h-16 me-4"
            />
            <h2 className="text-[#525858] font-semibold text-lg text-start">
              Whenever, Wherever
            </h2>
          </div>
          <div className="flex items-center">
            <FaRegBell className="text-4xl" />
          </div>
        </div>
        {/* Searchbar */}
        <div className="p-4">
          <SearchBar />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4">
        {/* Specialty Section */}
        <div className="flex-col">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold text-[#525858]">
              Doctors Specialty
            </h3>
            {specialties.length > 6 && (
              <button
                className="text-neutral-500 cursor-pointer"
                onClick={() => setShowAllSpecialties((prev) => !prev)}
              >
                {showAllSpecialties ? "Show less" : "See more"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {displayedSpecialties.map((specialty) => (
              <button
                key={specialty.id}
                onClick={() =>
                  console.log("Specialty clicked:", specialty.name)
                }
                className={`
                  flex flex-col items-center justify-center
                  py-8 rounded-lg
                  text-sm text-slate-900
                  border-4 border-zinc-200
                  bg-white
                  shadow-[0_6px_0_theme('colors.zinc.200')]
                  hover:shadow-[0_6px_0_theme('colors.zinc.300')]
                  hover:bg-white
                  hover:border-zinc-300
                  active:translate-y-2 active:shadow-[0_2px_0_theme('colors.zinc.300')] active:bg-zinc-100 active:border--zinc-200
                  transition-all
                `}
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
                    />
                  </span>
                )}
                {specialty.name}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Near You Section */}
        <div className="flex-col mt-6">
          <h3 className="text-xl font-semibold text-[#525858] mb-4">
            Doctors Near You
          </h3>
          {loading ? (
            <HorizontalShowcaseSkeleton />
          ) : doctorsNearYou.length > 0 ? (
            <HorizontalShowcase
              items={doctorsNearYou.map(transformDoctorForCard)}
            />
          ) : null}
        </div>

        {/* Top Doctors Section */}
        <div className="flex justify-between mt-6">
          <h3 className="text-xl font-semibold text-[#525858] my-4">
            Top Doctors
          </h3>
          <button className="text-neutral-500 cursor-pointer">See more</button>
        </div>

        {/* Doctor Row Cards */}
        {loading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mb-4">
                <DoctorRowCardSkeleton />
              </div>
            ))}
          </>
        ) : topDoctors.length > 0 ? (
          topDoctors.map((doctor, idx) => (
            <div key={doctor.id + idx} className="mb-4">
              <DoctorRowCard {...transformDoctorForRowCard(doctor)} />
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No top doctors found
          </div>
        )}

        {/* Available Today Section */}
        <div className="flex-col mt-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold text-[#525858]">
              Available Today
            </h3>
            <button className="text-neutral-500 cursor-pointer">
              See more
            </button>
          </div>
          {loading ? (
            <HorizontalShowcaseSkeleton />
          ) : availableToday.length > 0 ? (
            <HorizontalShowcase
              items={availableToday.map(transformDoctorForCard)}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No doctors available today
            </div>
          )}
        </div>

        {/* Show message if no doctors found */}
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
