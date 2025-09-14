"use client";
import { ArrowBack } from "@/components/nav";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { specialties as allSpecialties } from "@/constants/specialties";
import { FaCalendarCheck, FaStar } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6";
import { IoChatboxEllipses } from "react-icons/io5";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { DoctorPageSkeleton } from "@/components/skeletons";
import { Doctor, DoctorHospital } from "@/types/doctor";

export default function DoctorPage() {
  const router = useRouter();
  const { doctorId } = useParams<{ doctorId: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await fetch(`/api/doctors/${doctorId}`);
        if (response.ok) {
          const json = await response.json();
          console.log("API Response:", json);

          // flatten it so doctor contains everything
          setDoctor({ ...json.data.doctor, services: json.data.services });
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch doctor");
        }
      } catch (err) {
        setError("Network error");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctorData();
    }
  }, [doctorId]);

  // 🔹 helper to get specialty name
  const getSpecialtyName = (specializationId: string) => {
    const specialty = allSpecialties.find((s) => s.id === specializationId);
    return specialty?.name || "General Practice";
  };

  if (loading) return <DoctorPageSkeleton />;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!doctor) return <p>No doctor found</p>;

  const handleBookClick = () => {
    router.push(`/book?doctorId=${doctor.id}`);
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Main content with padding bottom for fixed footer */}
      <div className="pb-24 px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <ArrowBack />
          <h2 className="text-xl sm:text-2xl font-bold">Doctor Details</h2>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        {/* Doctor Profile Card */}
        <div className="space-y-6">
          <div className="border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Profile Image */}
            <div className="aspect-video sm:aspect-[4/3] overflow-hidden">
              <img
                src={doctor.users?.profile_image_url}
                alt={`Dr. ${doctor.users?.first_name} ${doctor.users?.last_name}`}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Doctor Info */}
            <div className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800">
                    Dr. {doctor.users?.first_name} {doctor.users?.last_name}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <FaStar className="text-amber-400" />
                  <span>{doctor.rating_average}</span>
                  <span className="text-neutral-500">
                    ({doctor.total_reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="mt-2 text-sm sm:text-base text-neutral-600">
                <p>
                  {getSpecialtyName(doctor.specialization_id ?? "")}
                  {doctor.doctor_hospitals.length > 0 ? (
                    doctor.doctor_hospitals?.map(
                      (dh: DoctorHospital, idx: number) => (
                        <span key={dh.id}>
                          {dh.hospitals?.name}
                          {idx < doctor.doctor_hospitals.length - 1 && ", "}
                        </span>
                      )
                    )
                  ) : (
                    <span>No hospitals assigned</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 text-neutral-700">
            <div className="flex flex-col items-center space-y-2">
              <div className="relative flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full border-neutral-100 bg-neutral-50">
                <FaClipboardUser className="text-[#00BAB8] text-3xl sm:text-4xl z-10" />
                <div className="absolute bg-white h-8 w-8 z-0 rounded-2xl" />
              </div>
              <p
                className={`text-center text-xs sm:text-sm font-semibold
                  ${
                    doctor.is_accepting_patients
                      ? "text-green-500"
                      : "text-red-600"
                  }`}
              >
                {doctor.is_accepting_patients ? (
                  <>
                    Accepting
                    <br />
                    Patients
                  </>
                ) : (
                  <>
                    Not Accepting
                    <br />
                    Patients
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="relative flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full border-neutral-100 bg-neutral-50">
                <FaCalendarCheck className="text-[#00BAB8] text-3xl sm:text-4xl z-10" />
                <div className="absolute bg-white h-8 w-8 z-0 rounded-2xl" />
              </div>
              <div className="text-center">
                <p className="font-bold text-lg sm:text-xl">
                  {doctor.years_experience}+
                </p>
                <p className="text-xs sm:text-sm text-neutral-500">Years</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="relative flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full border-neutral-100 bg-neutral-50">
                <FaStar className="text-[#00BAB8] text-3xl sm:text-4xl z-10" />
                <div className="absolute bg-white h-8 w-8 z-0 rounded-2xl" />
              </div>
              <div className="text-center">
                <p className="font-bold text-lg sm:text-xl">
                  {doctor.rating_average}
                </p>
                <p className="text-xs sm:text-sm text-neutral-500">Rating</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="relative flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full border-neutral-100 bg-neutral-50">
                <IoChatboxEllipses className="text-[#00BAB8] text-3xl sm:text-4xl z-10" />
                <div className="absolute bg-white h-8 w-8 z-0 rounded-2xl" />
              </div>
              <div className="text-center">
                <p className="font-bold text-lg sm:text-xl">
                  {doctor.total_reviews}+
                </p>
                <p className="text-xs sm:text-sm text-neutral-500">Reviews</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            {/* Bio */}
            {doctor.bio && (
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                  About
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  {doctor.bio}
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="space-y-3 text-sm sm:text-base">
              {doctor.consultation_fee && (
                <div className="flex justify-between">
                  <span className="font-semibold">Consultation Fee:</span>
                  <span>${doctor.consultation_fee}</span>
                </div>
              )}

              {doctor.users?.phone && (
                <div className="flex justify-between">
                  <span className="font-semibold">Phone:</span>
                  <span>{doctor.users.phone}</span>
                </div>
              )}

              {doctor.users?.gender && (
                <div className="flex justify-between">
                  <span className="font-semibold">Gender:</span>
                  <span className="capitalize">{doctor.users.gender}</span>
                </div>
              )}

              {doctor.license_number && (
                <div className="flex justify-between">
                  <span className="font-semibold">License Number:</span>
                  <span>{doctor.license_number}</span>
                </div>
              )}
            </div>

            {/* Languages */}
            {doctor.languages_spoken && (
              <div>
                <h4 className="font-semibold mb-2">Languages Spoken:</h4>
                <p className="text-sm sm:text-base">
                  {Array.isArray(doctor.languages_spoken)
                    ? doctor.languages_spoken.join(", ")
                    : doctor.languages_spoken}
                </p>
              </div>
            )}

            {/* Education */}
            {doctor.education && (
              <div>
                <h4 className="font-semibold mb-2">Education:</h4>
                <div className="text-sm sm:text-base">
                  {typeof doctor.education === "object" ? (
                    <pre className="p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                      {JSON.stringify(doctor.education, null, 2)}
                    </pre>
                  ) : (
                    <p>{doctor.education}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 safe-area-pb">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          {/* Chat Button */}
          <button
            onClick={() => console.log("Chat clicked")}
            className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            <IoChatboxEllipses className="text-2xl sm:text-3xl text-[#00BAB8]" />
          </button>

          {/* Book Button */}
          <div className="flex-1">
            <AnimatedButton
              text="Book Consultation"
              fullWidth
              onClick={handleBookClick}
              style="h-12 sm:h-14"
              textSize="text-sm sm:text-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
