"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { AnimatedButton } from "@/components";

interface Profile {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    profile_image_url?: string;
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/patient-profile");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data: Profile = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <p className="p-4">Loading profile...</p>;
  if (!profile) return <p className="p-4">Profile not found.</p>;

  return (
    <div className="min-h-[100dvh] bg-neutral-100 p-4 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-3xl font-bold text-[#00BAB8] mb-6">My Profile</h1>

      {/* Profile info */}
      <div className="flex flex-col items-center mb-6">
        {profile.user.profile_image_url ? (
          <img
            src={profile.user.profile_image_url}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-2"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 mb-2" />
        )}
        <p className="text-lg font-bold">
          {profile.user.first_name} {profile.user.last_name}
        </p>
        <p className="text-neutral-500">{profile.user.email}</p>
        {profile.user.phone && (
          <p className="text-neutral-500">{profile.user.phone}</p>
        )}
      </div>

      {/* Option buttons */}
      <div className="w-full max-w-md flex flex-col gap-4">
        <button
          className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition"
          onClick={() => router.push("/profile/account-info")}
        >
          <span>Account Info</span>
        </button>

        <button
          className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition"
          onClick={() => router.push("/profile/health-info")}
        >
          <span>Health Info</span>
        </button>

        <button
          className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition"
          onClick={() => router.push("/profile/subscription")}
        >
          <span>Subscription</span>
        </button>

        <button
          className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition"
          onClick={() => router.push("/profile/security")}
        >
          <span>Security</span>
        </button>

        <AnimatedButton text="Logout" fullWidth onClick={handleLogout} />
      </div>
    </div>
  );
}
