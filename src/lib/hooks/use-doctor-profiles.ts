// hooks/use-doctor-profiles.ts
"use client";

import { useState, useEffect } from "react";
import { DoctorProfile } from "@/lib/schemas/doctor-profile";

interface UseDoctorProfilesOptions {
  limit?: number;
  offset?: number;
  verified?: boolean;
  accepting_patients?: boolean;
  specialization_id?: string;
  autoFetch?: boolean;
}

interface DoctorProfilesResponse {
  data: DoctorProfile[];
  count: number;
  total?: number;
  success: boolean;
}

export function useDoctorProfiles(options: UseDoctorProfilesOptions = {}) {
  const [data, setData] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const fetchDoctorProfiles = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();

      if (options.limit) params.append("limit", options.limit.toString());
      if (options.offset) params.append("offset", options.offset.toString());
      if (options.verified !== undefined)
        params.append("verified", options.verified.toString());
      if (options.accepting_patients !== undefined)
        params.append(
          "accepting_patients",
          options.accepting_patients.toString()
        );
      if (options.specialization_id)
        params.append("specialization_id", options.specialization_id);

      const url = `/api/doctor-profiles${
        params.toString() ? "?" + params.toString() : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DoctorProfilesResponse = await response.json();

      if (!result.success) {
        throw new Error("Failed to fetch doctor profiles");
      }

      setData(result.data);
      setCount(result.count);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setData([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount and when options change
  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchDoctorProfiles();
    }
  }, [
    options.limit,
    options.offset,
    options.verified,
    options.accepting_patients,
    options.specialization_id,
    options.autoFetch,
  ]);

  return {
    data,
    loading,
    error,
    count,
    refetch: fetchDoctorProfiles,
  };
}
