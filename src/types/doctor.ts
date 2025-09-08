// types/doctor.ts

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  gender?: string;
  phone?: string;
  profile_image_url?: string; // ✅ Add this
}
// Medical specialty interface
export interface MedicalSpecialty {
  id: string;
  name: string;
  description?: string;
  category?: string;
  icon?: string;
  color?: string;
}
export interface Hospital {
  id: string;
  name: string;
  city?: string;
  province?: string;
}

export interface DoctorHospital {
  is_primary: boolean;
  hospitals: Hospital;
}

export interface Doctor {
  id: string;
  user_id: string;
  license_number: string;
  specialization_id?: string;
  years_experience?: number;
  consultation_fee?: number;
  bio?: string;
  languages_spoken?: string[];
  is_verified: boolean;
  rating_average: number;
  total_reviews: number;
  total_appointments: number;
  is_accepting_patients: boolean;
  created_at: string;
  updated_at: string;
  users: {
    id: string;
    first_name: string;
    last_name: string;
    gender?: string;
    phone?: string;
    profile_image_url?: string;
  };
  medical_specialties?: {
    id: string;
    name: string;
  };
  doctor_hospitals?: DoctorHospital[]; // 👈 new relation
}

// Card views
export interface DoctorCard {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
  hospital?: string;
}

export interface DoctorRowCard {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviews: number;
  image: string;
}

// Search filters interface
export interface SearchFilters {
  q?: string;
  limit?: number;
  offset?: number;
  verified?: boolean;
  accepting_patients?: boolean;
  specialization_id?: string;
  min_experience?: string;
  max_experience?: string;
  gender?: string;
  language?: string;
  min_rating?: string;
  specialty_name?: string; // For URL-based specialty filtering
}

// API response interface
export interface ApiResponse<T = Doctor[]> {
  data: T;
  count: number;
  totalCount?: number;
  success: boolean;
  error?: string;
}
