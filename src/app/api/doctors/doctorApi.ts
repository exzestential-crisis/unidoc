import { ApiResponse, DoctorSearchFilters } from "@/types/doctor";

export const fetchDoctors = async (
  filters: DoctorSearchFilters
): Promise<ApiResponse> => {
  const params = new URLSearchParams();

  // Handle all search filters
  if (filters.q) params.append("q", filters.q);
  if (filters.limit) params.append("limit", String(filters.limit));
  if (filters.offset) params.append("offset", String(filters.offset));
  if (filters.verified !== undefined)
    params.append("verified", String(filters.verified));
  if (filters.accepting_patients !== undefined)
    params.append("accepting_patients", String(filters.accepting_patients));
  if (filters.specialization_id)
    params.append("specialization_id", filters.specialization_id);
  if (filters.min_experience)
    params.append("min_experience", filters.min_experience);
  if (filters.max_experience)
    params.append("max_experience", filters.max_experience);
  if (filters.gender) params.append("gender", filters.gender);
  if (filters.language) params.append("language", filters.language);
  if (filters.min_rating) params.append("min_rating", filters.min_rating);

  const response = await fetch(`/api/doctors?${params.toString()}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch doctors: ${response.status} ${response.statusText}`
    );
  }

  const result: ApiResponse = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Invalid response format");
  }

  return result;
};
