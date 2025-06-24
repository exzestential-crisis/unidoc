"use client";

import { FaRegBell, FaStar } from "react-icons/fa";
import { SearchBar, DoctorCard } from "@/components/ui";

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
        <div className="flex gap-4 overflow-x-auto">
          <DoctorCard
            name="Dr. Name"
            image="http://placehold.co/150"
            rating={4.5}
            specialty="Specialty"
          />
        </div>
      </div>
    </div>
  );
}
