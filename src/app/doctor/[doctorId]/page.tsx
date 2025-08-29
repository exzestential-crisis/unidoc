"use client";
import { ArrowBack } from "@/components/nav";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { specialties as allSpecialties } from "@/constants/specialties";
import { FaCalendarCheck, FaStar } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6";
import { IoChatboxEllipses } from "react-icons/io5";

export default function DoctorPage() {
  const router = useRouter();

  const { doctorId } = useParams<{ doctorId: string }>();
  const [doctor, setDoctor] = useState<any>(null);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!doctor) return <p>No doctor found</p>;

  const handleBookClick = () => {
    router.push(`/book?doctorId=${doctor.id}`);
  };

  return (
    <div className="relative p-6 mx-auto min-h-screen">
      <div className="absolute">
        <ArrowBack />
      </div>
      <div className="flex justify-center w-full pb-6">
        <h2 className="text-3xl font-bold">Doctor Details</h2>
      </div>
      {/* Name + Profile image */}

      <div className="space-y-4">
        <div>
          {/* Doctor Name, Hospitals, and Reviews */}
          <div className="flex flex-col items-center justify-center h-90 w-full border border-neutral-200 rounded-2xl shadow-sm">
            <img
              src={doctor.users?.profile_image_url}
              alt=""
              className="h-full w-full"
            />

            <div className="flex flex-col w-full p-4  text-neutral-500 text-xl">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-800">
                    Dr. {doctor.users?.first_name} {doctor.users?.last_name}
                  </h2>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FaStar className="text-amber-400 mb-1" />
                  <p>{doctor.rating_average}</p>({doctor.total_reviews} reviews)
                </div>
              </div>

              <div>
                <p>
                  {getSpecialtyName(doctor.specialization_id)} |{" "}
                  {/* ✅ show hospitals */}
                  {doctor.doctor_hospitals?.length > 0 ? (
                    doctor.doctor_hospitals.map((dh: any, idx: number) => (
                      <span key={dh.id}>
                        {dh.hospitals?.name}
                        {idx < doctor.doctor_hospitals.length - 1 && ", "}
                      </span>
                    ))
                  ) : (
                    <span>No hospitals assigned</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-neutral-700 py-4">
          <div className="flex flex-col items-center space-y-2">
            <div className="relative flex items-center justify-center h-20 w-20 rounded-full border-neutral-100 bg-neutral-50">
              <FaClipboardUser className="text-[#00BAB8] text-5xl z-10" />
              <div className="absolute bg-white h-9 w-9 z-0 rounded-2xl" />
            </div>
            <p
              className={`text-center font-semibold py-1
                ${
                  doctor.is_accepting_patients
                    ? "text-green-500"
                    : "text-red-600"
                }`}
            >
              {doctor.is_accepting_patients ? (
                <>
                  Accepting <br /> Patients
                </>
              ) : (
                <>
                  Not Accepting <br /> Patients
                </>
              )}
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="relative flex items-center justify-center h-20 w-20 rounded-full border-neutral-100 bg-neutral-50">
              <FaCalendarCheck className="text-[#00BAB8] text-5xl z-10" />
              <div className="absolute bg-white h-9 w-9 z-0 rounded-2xl" />
            </div>
            <div className="h-10">
              <p className="font-bold text-xl text-center">
                {doctor.years_experience}+
              </p>
              <p className="text-neutral-500">Years</p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="relative flex items-center justify-center h-20 w-20 rounded-full border-neutral-100 bg-neutral-50">
              <FaStar className="text-[#00BAB8] text-5xl z-10" />
              <div className="absolute bg-white h-9 w-9 z-0 rounded-2xl" />
            </div>
            <div className="h-10">
              <p className="font-bold text-xl text-center">
                {doctor.rating_average}
              </p>
              <p className="text-neutral-500">Rating</p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="relative flex items-center justify-center h-20 w-20 rounded-full border-neutral-100 bg-neutral-50">
              <IoChatboxEllipses className="text-[#00BAB8] text-5xl z-10" />
              <div className="absolute bg-white h-9 w-9 z-0 rounded-2xl" />
            </div>
            <div className="h-10">
              <p className="font-bold text-xl text-center">
                {doctor.total_reviews}+
              </p>
              <p className="text-neutral-500">Reviews</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        {doctor.bio && (
          <div>
            <strong className="text-2xl">About</strong>
            <p className="mt-1 text-gray-700">{doctor.bio}</p>
          </div>
        )}

        {/* Experience */}
        {doctor.years_experience && (
          <p>
            <strong>Years of Experience:</strong>
          </p>
        )}

        {/* Rating */}
        <p>
          <strong>Rating:</strong>/5.0
        </p>

        {/* Consultation Fee */}
        {doctor.consultation_fee && (
          <p>
            <strong>Consultation Fee:</strong> ${doctor.consultation_fee}
          </p>
        )}

        {/* Contact Info */}
        {doctor.users?.phone && (
          <p>
            <strong>Phone:</strong> {doctor.users.phone}
          </p>
        )}
        {doctor.users?.gender && (
          <p>
            <strong>Gender:</strong> {doctor.users.gender}
          </p>
        )}

        {/* License */}
        {doctor.license_number && (
          <p>
            <strong>License Number:</strong> {doctor.license_number}
          </p>
        )}

        {/* Accepting Patients */}
        <p>
          <strong>Status:</strong>{" "}
        </p>

        {/* Profile Image (again small circle) */}
        {doctor.users?.profile_image_url && (
          <img
            src={doctor.users.profile_image_url}
            alt="Doctor Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
        )}

        {/* Languages */}
        {doctor.languages_spoken && (
          <div>
            <strong>Languages:</strong>
            <p>{JSON.stringify(doctor.languages_spoken)}</p>
          </div>
        )}

        {/* Education */}
        {doctor.education && (
          <div>
            <strong>Education:</strong>
            <pre className="p-2 rounded text-sm">
              {JSON.stringify(doctor.education, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
