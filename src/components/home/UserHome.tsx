"use client";

import { useEffect, useState } from "react";

type PatientProfile = {
  id: string;
  user_id: string;
  // add other fields if you want
};

export default function UserHome() {
  const [userId, setUserId] = useState<string | null>(null);
  const [patientProfileId, setPatientProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/patient-profile");

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const profile: PatientProfile = await res.json();

        setUserId(profile.user_id);
        setPatientProfileId(profile.id);
      } catch (err: any) {
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <div>Loading your profile...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>You are logged in</h1>
      <p>
        <strong>User ID:</strong> {userId}
      </p>
      <p>
        <strong>Patient Profile ID:</strong> {patientProfileId}
      </p>
    </div>
  );
}
