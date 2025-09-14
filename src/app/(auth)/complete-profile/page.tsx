"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ArrowBack } from "@/components/nav";
import Input from "@/components/ui/Input";
import { AnimatedButton } from "@/components";

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
  const [subscriptionTier] = useState("free"); // no set subscription option for now
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const bloodTypeOptions = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
    "Unknown",
  ];

  // Individual field errors
  const [fieldErrors, setFieldErrors] = useState({
    emergencyName: "",
    emergencyPhone: "",
    bloodType: "",
    allergies: "",
    chronic: "",
  });

  type FieldName =
    | "emergencyName"
    | "emergencyPhone"
    | "bloodType"
    | "allergies"
    | "chronic";

  // Clear specific field error when user starts typing
  const clearFieldError = (field: FieldName) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Validate individual fields
  const validateField = (field: string, value: string) => {
    switch (field) {
      case "emergencyName":
        if (!value.trim()) return "Emergency contact name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        break;
      case "emergencyPhone":
        if (!value.trim()) return "Emergency contact phone is required";
        if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(value.trim()))
          return "Please enter a valid phone number";
        break;
      case "bloodType":
        // Blood type is now a dropdown, so no validation needed for format
        break;
    }
    return "";
  };

  // Validate all required fields before submission
  const validateAllFields = () => {
    const errors = {
      emergencyName: validateField("emergencyName", emergencyName),
      emergencyPhone: validateField("emergencyPhone", emergencyPhone),
      bloodType: validateField("bloodType", bloodType),
      allergies: "",
      chronic: "",
    };

    setFieldErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  useEffect(() => {
    if (!userId) {
      // If no userId, redirect back to signup or login
      router.push("/signup");
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest("[data-dropdown]")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userId, router]);

  if (userType !== "patient") {
    return (
      <div className="bg-neutral-100 shadow rounded min-h-[100dvh] p-4">
        <ArrowBack />
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-8">
          <div className="text-center bg-white rounded-lg shadow p-8 max-w-md">
            <h1 className="text-2xl font-bold text-[#00BAB8] mb-4">
              Profile Setup
            </h1>
            <p className="text-neutral-600">
              Profile completion for user type <strong>{userType}</strong> is
              not implemented yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Clear previous errors
    setFieldErrors({
      emergencyName: "",
      emergencyPhone: "",
      bloodType: "",
      allergies: "",
      chronic: "",
    });

    if (!validateAllFields()) return;

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from("patient_profiles")
        .upsert(
          {
            user_id: userId,
            emergency_contact_name: emergencyName,
            emergency_contact_phone: emergencyPhone,
            blood_type: bloodType,
            allergies: JSON.stringify(
              allergies.split(",").map((s) => s.trim())
            ),
            chronic_conditions: JSON.stringify(
              chronic.split(",").map((s) => s.trim())
            ),
            subscription_tier: subscriptionTier,
          },
          { onConflict: "user_id" }
        );

      if (insertError) {
        console.error(insertError);
        setFieldErrors((prev) => ({
          ...prev,
          emergencyName: "Failed to save profile. Please try again.",
        }));
        setLoading(false);
        return;
      }

      // Redirect user to login or dashboard after profile complete
      router.push("/login");
    } catch (err) {
      console.error("Profile completion error:", err);
      setFieldErrors((prev) => ({
        ...prev,
        emergencyName: "An unexpected error occurred. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-neutral-100 shadow rounded min-h-[100dvh] p-4">
      <ArrowBack />

      <div className="flex flex-col items-center mb-6 px-8">
        <h1 className="text-4xl font-bold mb-2 text-[#00BAB8] pt-10">
          Complete Profile
        </h1>
        <h2 className="text-neutral-400 font-bold mb-6">
          Complete your patient profile to get started!
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 w-full max-w-md pt-6"
        >
          <div>
            <Input
              type="text"
              id="emergency_name"
              label="Emergency Contact Name"
              value={emergencyName}
              onChange={(e) => {
                setEmergencyName(e.target.value);
                clearFieldError("emergencyName");
              }}
              className={fieldErrors.emergencyName ? "border-red-500" : ""}
            />
            {fieldErrors.emergencyName && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {fieldErrors.emergencyName}
              </p>
            )}
          </div>

          <div>
            <Input
              type="tel"
              id="emergency_phone"
              label="Emergency Contact Phone"
              value={emergencyPhone}
              onChange={(e) => {
                setEmergencyPhone(e.target.value);
                clearFieldError("emergencyPhone");
              }}
              className={fieldErrors.emergencyPhone ? "border-red-500" : ""}
            />
            {fieldErrors.emergencyPhone && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {fieldErrors.emergencyPhone}
              </p>
            )}
          </div>

          <div data-dropdown>
            <div
              className={`relative w-full ${
                fieldErrors.bloodType ? "border-red-500" : ""
              }`}
            >
              {/* Custom Dropdown */}
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="peer w-full px-4 py-11 max-h-[76px] pt-8 text-xl text-black rounded-lg bg-neutral-100 shadow-sm shadow-neutral-300 focus:outline-none cursor-pointer"
              >
                {bloodType || " "}
              </div>

              <label
                className={`absolute left-6 text-neutral-400 transition-all pointer-events-none ${
                  bloodType.length > 0
                    ? "top-2 text-sm"
                    : "top-6 text-xl peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-focus:top-2 peer-focus:text-sm"
                }`}
              >
                Blood Type
              </label>

              {/* Custom dropdown arrow */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className={`w-5 h-5 text-neutral-400 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Dropdown Options */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-neutral-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {bloodTypeOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setBloodType(option);
                        setIsDropdownOpen(false);
                        clearFieldError("bloodType");
                      }}
                      className="px-4 py-3 cursor-pointer text-neutral-800 hover:bg-[#009689] hover:text-white transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {fieldErrors.bloodType && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {fieldErrors.bloodType}
              </p>
            )}
          </div>

          <div>
            <Input
              type="text"
              id="allergies"
              label="Allergies (comma separated)"
              value={allergies}
              onChange={(e) => {
                setAllergies(e.target.value);
                clearFieldError("allergies");
              }}
              className={fieldErrors.allergies ? "border-red-500" : ""}
            />
            {fieldErrors.allergies && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {fieldErrors.allergies}
              </p>
            )}
          </div>

          <div>
            <Input
              type="text"
              id="chronic"
              label="Chronic Conditions (comma separated)"
              value={chronic}
              onChange={(e) => {
                setChronic(e.target.value);
                clearFieldError("chronic");
              }}
              className={fieldErrors.chronic ? "border-red-500" : ""}
            />
            {fieldErrors.chronic && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {fieldErrors.chronic}
              </p>
            )}
          </div>

          <div className="pt-4">
            <AnimatedButton
              text={loading ? "Saving..." : "Complete Profile"}
              type="submit"
              fullWidth
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
