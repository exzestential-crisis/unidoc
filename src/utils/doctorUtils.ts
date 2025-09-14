// utils/doctorUtils.ts
import { Doctor, DoctorHospital } from "@/types/doctor";
import { specialties as allSpecialties } from "@/constants/specialties";

export const getSpecialtyName = (specializationId: string): string => {
  const specialty = allSpecialties.find((s) => s.id === specializationId);
  return specialty?.name || "General Practice";
};

export const formatDoctorName = (doctor: Doctor): string =>
  `Dr. ${doctor.users.first_name} ${doctor.users.last_name}`.trim();

/**
 * Transform Doctor into Card-friendly data
 */
export const transformDoctorForCard = (doctor: Doctor) => {
  const primaryHospital: DoctorHospital | undefined =
    doctor.doctor_hospitals?.find((dh) => dh.is_primary);

  const hospitalName =
    primaryHospital?.hospitals?.name ||
    doctor.doctor_hospitals?.[0]?.hospitals?.name ||
    null;

  return {
    id: doctor.id,
    name: formatDoctorName(doctor),
    image: doctor.users?.profile_image_url || "http://placehold.co/400x300",
    rating: doctor.rating_average || 0,
    specialty: doctor.medical_specialties?.name || "General",
    hospital: hospitalName,
  };
};

/**
 * Transform Doctor into RowCard-friendly data
 */
export const transformDoctorForRowCard = (doctor: Doctor) => {
  const primaryHospital: DoctorHospital | undefined =
    doctor.doctor_hospitals?.find((dh) => dh.is_primary);

  const hospitalName =
    primaryHospital?.hospitals?.name ||
    doctor.doctor_hospitals?.[0]?.hospitals?.name ||
    null;

  return {
    id: doctor.id,
    name: formatDoctorName(doctor),
    image: doctor.users?.profile_image_url || "http://placehold.co/400x300",
    rating: doctor.rating_average || 0,
    specialty: doctor.medical_specialties?.name || "General",
    hospital: hospitalName,
    reviews: doctor.total_reviews || 0,
  };
};

/**
 * Categorize doctors into sections
 */
export const categorizeDoctors = (doctors: Doctor[]) => {
  const doctorsNearYou = doctors.slice(0, 6);

  const topDoctors = [...doctors]
    .sort((a, b) => (b.rating_average || 0) - (a.rating_average || 0))
    .slice(0, 3);

  const availableToday = doctors
    .filter((doctor) => doctor.is_accepting_patients)
    .slice(0, 6);

  return {
    doctorsNearYou,
    topDoctors,
    availableToday,
  };
};
