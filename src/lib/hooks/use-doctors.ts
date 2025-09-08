import { useState, useEffect, useCallback } from "react";
import { Doctor, SearchFilters } from "@/types/doctor";
import { fetchDoctors } from "@/app/api/doctors/doctorApi";

export const useDoctors = (initialFilters?: SearchFilters) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  // initialize with initialFilters if provided
  const [filters, setFilters] = useState<SearchFilters>(
    initialFilters || { q: "", limit: 20, offset: 0 }
  );

  const loadDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchDoctors(filters);
      setDoctors(result.data);
      setTotalCount(result.totalCount || 0);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      updateFilters({ q: query, offset: 0 });
    },
    [updateFilters]
  );

  const resetFilters = useCallback(() => {
    setFilters({
      q: "",
      limit: 20,
      offset: 0,
    });
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && doctors.length < totalCount) {
      updateFilters({ offset: doctors.length });
    }
  }, [loading, doctors.length, totalCount, updateFilters]);

  return {
    doctors,
    loading,
    error,
    filters,
    totalCount,
    handleSearch,
    updateFilters,
    resetFilters,
    loadMore,
    refetch: loadDoctors,
  };
};
