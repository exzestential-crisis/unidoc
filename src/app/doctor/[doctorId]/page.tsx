"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
          console.log("API Response:", json.data); // Debug log
          setDoctor(json.data);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!doctor) return <p>No doctor found</p>;

  const handleBookClick = () => {
    router.push(`/book?doctorId=${doctor.id}`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Doctor Profile</h1>

      <div className="space-y-4">
        {/* Name from users table */}
        <div>
          <h2 className="text-xl font-semibold">
            Dr. {doctor.users?.first_name} {doctor.users?.last_name}
          </h2>
        </div>

        {/* Specialization - if you added the join */}
        {doctor.specializations && (
          <p>
            <strong>Specialty:</strong> {doctor.specializations.name}
          </p>
        )}

        {/* Bio */}
        {doctor.bio && (
          <div>
            <strong>Bio:</strong>
            <p className="mt-1 text-gray-700">{doctor.bio}</p>
          </div>
        )}

        {/* Experience */}
        {doctor.years_experience && (
          <p>
            <strong>Years of Experience:</strong> {doctor.years_experience}
          </p>
        )}

        {/* Rating */}
        <p>
          <strong>Rating:</strong> {doctor.rating_average}/5.0 (
          {doctor.total_reviews} reviews)
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
          <span
            className={
              doctor.is_accepting_patients ? "text-green-600" : "text-red-600"
            }
          >
            {doctor.is_accepting_patients
              ? "Accepting New Patients"
              : "Not Accepting Patients"}
          </span>
        </p>

        {/* Profile Image */}
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
            <pre className=" p-2 rounded text-sm">
              {JSON.stringify(doctor.education, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
