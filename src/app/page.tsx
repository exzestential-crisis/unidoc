"use client";

import { FaRegBell, FaStar } from "react-icons/fa";
import { SearchBar, DoctorCard } from "@/components/ui";
import HorizontalShowcase from "@/components/ui/HorizontalShowcase";

export default function Home() {
  // Updated specialties array with colors for SVGs
  const specialties = [
    {
      name: "General Practitioner",
      icon: "/assets/body-icons/healthicons--stethoscope.svg",
      color: "bg-cyan-50",
    },
    {
      name: "Pediatrician",
      icon: "/assets/body-icons/healthicons--child-program.svg",
      color: "bg-sky-50",
    },
    {
      name: "Cardiologist",
      icon: "/assets/body-icons/healthicons--heart-organ.svg",
      color: "bg-rose-50",
    },
    {
      name: "Pulmonologist",
      icon: "/assets/body-icons/healthicons--lungs-24px.svg",
      color: "bg-teal-50",
    },
    {
      name: "Nephrologist",
      icon: "/assets/body-icons/healthicons--kidneys-24px.svg",
      color: "bg-violet-50",
    },
    {
      name: "Gastroenterologist",
      icon: "/assets/body-icons/healthicons--stomach.svg",
      color: "bg-lime-50",
    },
  ];

  const doctors = [
    { name: "Dr. Alice Smith", specialty: "Cardiologist", rating: 4.8 },
    { name: "Dr. Bob Johnson", specialty: "Pulmonologist", rating: 4.5 },
    { name: "Dr. Carol Lee", specialty: "General Practitioner", rating: 4.2 },
    { name: "Dr. David Kim", specialty: "Nephrologist", rating: 4.7 },
    { name: "Dr. Emma Garcia", specialty: "Pediatrician", rating: 4.9 },
    { name: "Dr. Frank Wright", specialty: "Gastroenterologist", rating: 4.4 },
    { name: "Dr. Grace Chen", specialty: "Dermatologist", rating: 4.3 },
    { name: "Dr. Henry Patel", specialty: "Endocrinologist", rating: 4.6 },
    { name: "Dr. Irene Lopez", specialty: "Neurologist", rating: 4.1 },
    { name: "Dr. Jack Wilson", specialty: "Orthopedic Surgeon", rating: 4.0 },
  ];

  return (
    <div className="homepage bg-zinc-100 p-4">
      {/* Header */}
      <div className="header flex justify-between items-center">
        <div className="flex items-center">
          <img src="http://placehold.co/50" alt="Logo" className="h-16 mx-4" />
          <h2 className="text-[#525858] font-semibold text-lg text-center">
            Whenever, wherever
          </h2>
        </div>
        <div className="flex items-center mx-4 gap-4">
          <img
            src="http://placehold.co/50"
            alt="Profile"
            className="rounded-full h-14"
          />
          <FaRegBell className="text-[#525858] text-4xl" />
        </div>
      </div>
      {/* Searchbar */}
      <div className="p-4">
        <SearchBar />
      </div>
      {/* Specialty Section */}
      <div className="flex-col">
        <div className="flex justify-between">
          <h3 className="text-xl font-semibold text-[#525858] my-4">
            Doctors Specialty
          </h3>
          <button className="text-zinc-500 cursor-pointer">See more</button>
        </div>

        <div className="grid grid-cols-3 gap-4 px-4">
          {specialties.map((specialty, index) => (
            <div
              key={index}
              className="
              bg-white 
              h-44 rounded-xl p-4 
              flex flex-col items-center justify-center 
              hover:shadow-lg 
              transition-shadow duration-200
              cursor-pointer
              "
            >
              {/* Option 1: CSS Filter Method (works with any SVG) */}
              <div className={`${specialty.color} rounded-full p-3 mb-3`}>
                <img
                  src={specialty.icon}
                  alt={specialty.name}
                  className="w-12 h-12 object-contain"
                />
              </div>

              <p className="text-sm text-center text-[#525858] font-medium">
                {specialty.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Doctors Near You Section */}
      <div className="flex-col mt-6">
        <h3 className="text-xl font-semibold text-[#525858] my-4">
          Doctors Near You
        </h3>

        {/* Doctor Cards */}
        <HorizontalShowcase items={doctors} />
      </div>

      {/* Top Doctors Section */}
      <div className="flex-col mt-6">
        <h3 className="text-xl font-semibold text-[#525858] my-4">
          Top Doctors
        </h3>
      </div>
    </div>
  );
}
