"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client-test";

export default function CompleteProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const userId = searchParams.get("userId") || "";
  const userType = searchParams.get("type") || "";

  // Form state
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [chronic, setChronic] = useState("");
  const [subscriptionTier, setSubscriptionTier] = useState("free");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      // If no userId, redirect back to signup or login
      router.push("/register");
    }
  }, [userId, router]);

  if (userType !== "patient") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-lg">
          Profile completion for user type <strong>{userType}</strong> is not
          implemented yet.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: insertError } = await supabase
      .from("patient_profiles")
      .upsert(
        {
          user_id: userId,
          emergency_contact_name: emergencyName,
          emergency_contact_phone: emergencyPhone,
          blood_type: bloodType,
          allergies: JSON.stringify(allergies.split(",").map((s) => s.trim())),
          chronic_conditions: JSON.stringify(
            chronic.split(",").map((s) => s.trim())
          ),
          subscription_tier: subscriptionTier,
        },
        { onConflict: "user_id" }
      );

    if (insertError) {
      console.error(insertError);
      setError("Failed to save profile. Please try again.");
      setLoading(false);
      return;
    }

    // Redirect user to login or dashboard after profile complete
    router.push("/login?message=Profile completed! Please log in.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full space-y-4 border rounded p-6 shadow"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          Complete Your Patient Profile
        </h1>

        <input
          type="text"
          placeholder="Emergency Contact Name"
          value={emergencyName}
          onChange={(e) => setEmergencyName(e.target.value)}
          required
          className="border rounded px-3 py-2 w-full"
        />

        <input
          type="text"
          placeholder="Emergency Contact Phone"
          value={emergencyPhone}
          onChange={(e) => setEmergencyPhone(e.target.value)}
          required
          className="border rounded px-3 py-2 w-full"
        />

        <input
          type="text"
          placeholder="Blood Type (e.g. A+)"
          value={bloodType}
          onChange={(e) => setBloodType(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />

        <input
          type="text"
          placeholder="Allergies (comma separated)"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />

        <input
          type="text"
          placeholder="Chronic Conditions (comma separated)"
          value={chronic}
          onChange={(e) => setChronic(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />

        <select
          value={subscriptionTier}
          onChange={(e) => setSubscriptionTier(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          required
        >
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>

        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded border border-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Complete Profile"}
        </button>
      </form>
    </div>
  );
}
