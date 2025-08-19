"use client";

import { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import {
  SearchBar,
  DoctorRowCard,
  AnimatedButton,
  ProfileIcon,
} from "@/components/ui";
import HorizontalShowcase from "@/components/ui/HorizontalShowcase";
import Link from "next/link";

interface Specialty {
  id: string;
  name: string;
  description: string;
  category: string;
  is_active: boolean;
  icon: string | null;
  color: string | null;
}

interface Doctor {
  name: string;
  specialty: string;
  rating: number;
}

export default function Home() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);

  const doctors: Doctor[] = [
    { name: "Dr. Alice Smith", specialty: "Cardiologist", rating: 4.8 },
    { name: "Dr. Bob Johnson", specialty: "Pulmonologist", rating: 4.5 },
    { name: "Dr. Carol Lee", specialty: "General Practitioner", rating: 4.2 },
    { name: "Dr. David Kim", specialty: "Nephrologist", rating: 4.7 },
    { name: "Dr. Emma Garcia", specialty: "Pediatrician", rating: 4.9 },
    { name: "Dr. Frank Wright", specialty: "Gastroenterologist", rating: 4.4 },
  ];

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await fetch("/api/medical-specialties");
        const json = await res.json();
        if (json.success) {
          const all: Specialty[] = json.data || [];

          // Ensure the first six in this order:
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

          all.forEach((s) => {
            if (priorityOrder.includes(s.name)) {
              prioritized[priorityOrder.indexOf(s.name)] = s; // keep the order
            } else {
              remaining.push(s);
            }
          });

          setSpecialties([...prioritized, ...remaining]);
        } else {
          console.error("Failed to fetch specialties:", json);
        }
      } catch (err) {
        console.error("Error fetching specialties:", err);
      } finally {
        setLoadingSpecialties(false);
      }
    };

    fetchSpecialties();
  }, []);

  const displayedSpecialties = showAllSpecialties
    ? specialties
    : specialties.slice(0, 6);

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
          <div className="flex items-center ms-4 gap-2">
            <Link href={"/login"}>
              <p className="text-center font-bold px-4 text-lg">Login</p>
            </Link>
            <Link href={"/signup"}>
              <p className="text-center font-bold px-4 text-lg">Signup</p>
            </Link>
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

          {loadingSpecialties ? (
            <p>Loading specialties...</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {displayedSpecialties.map((specialty) => (
                <button
                  key={specialty.id}
                  onClick={() =>
                    console.log("Specialty clicked:", specialty.name)
                  }
                  className={`
                        flex flex-col items-center justify-center
                        py-8 rounded-xl
                        text-neutral-600
                        shadow-[0_6px_0_theme('colors.neutral.200')]
                        border-4 border-neutral-200
                        bg-white
                        hover:bg-neutral-200 hover:border-neutral-300 hover:shadow-[0_6px_0_theme('colors.neutral.300')] hover:translate-y-[1px]
                        transition-transform
                      `}
                >
                  {/* Icon with circular background */}
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

                  {/* Specialty name */}
                  {specialty.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Doctors Near You Section */}
        <div className="flex-col mt-6">
          <h3 className="text-xl font-semibold text-[#525858] mb-4">
            Doctors Near You
          </h3>
          <HorizontalShowcase items={doctors} />
        </div>

        {/* Top Doctors Section */}
        <div className="flex justify-between mt-6">
          <h3 className="text-xl font-semibold text-[#525858] my-4">
            Top Doctors
          </h3>
          <button className="text-neutral-500 cursor-pointer">See more</button>
        </div>

        {/* Doctor Row Cards */}
        {doctors.slice(0, 3).map((doctor, idx) => (
          <div key={doctor.name + idx} className="mb-4">
            <DoctorRowCard
              name={doctor.name}
              specialty={doctor.specialty}
              rating={doctor.rating}
              reviews={300}
            />
          </div>
        ))}

        <div className="h-20 w-full" />
      </div>
    </div>
  );
}
