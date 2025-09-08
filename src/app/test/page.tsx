"use client";

import { LoadingPage } from "@/components/pages/LoadingPage";
import { useEffect, useState } from "react";
import { set } from "zod";

type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  // other fields if you need
};

type PatientProfile = {
  id: string;
  user_id: string;
  subscription_tier: string;
  user: User; // 👈 include the nested user
};

export default function UserHome() {
  const [userId, setUserId] = useState<string | null>(null);
  const [patientProfileId, setPatientProfileId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
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

        setUserName(profile.user.first_name + " " + profile.user.last_name);
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

  if (loading) return <LoadingPage message="Loading Your Profile" />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>You are logged in</h1>
      <p>
        <strong>User Name:</strong> {userName}
      </p>
      <p>
        <strong>User ID:</strong> {userId}
      </p>
      <p>
        <strong>Patient Profile ID:</strong> {patientProfileId}
      </p>
    </div>
  );
}
