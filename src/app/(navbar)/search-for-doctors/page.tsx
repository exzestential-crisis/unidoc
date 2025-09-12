"use client";
import { ArrowBack } from "@/components/nav";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { specialties as allSpecialties } from "@/constants/specialties";
import {
  FaSearch,
  FaClock,
  FaStar,
  FaUserMd,
  FaLanguage,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { FaClipboardUser, FaStethoscope } from "react-icons/fa6";
import AnimatedButton from "@/components/ui/AnimatedButton";

interface FilterState {
  q: string;
  specialization_id: string[];
  min_experience: string;
  max_experience: string;
  min_rating: string;
  gender: string;
  language: string;
  verified: boolean;
  accepting_patients: boolean;
  min_fee: string;
  max_fee: string;
}

const LANGUAGES = ["English", "Spanish", "French", "German", "Italian"];

const EXPERIENCE_OPTIONS = [
  { value: "1", label: "1+ years" },
  { value: "3", label: "3+ years" },
  { value: "5", label: "5+ years" },
  { value: "10", label: "10+ years" },
  { value: "15", label: "15+ years" },
  { value: "20", label: "20+ years" },
];

const RATING_OPTIONS = [
  { value: "3.0", label: "3.0+" },
  { value: "3.5", label: "3.5+" },
  { value: "4.0", label: "4.0+" },
  { value: "4.5", label: "4.5+" },
  { value: "5.0", label: "5.0" },
];

export default function SearchFilterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    q: "",
    specialization_id: [],
    min_experience: "",
    max_experience: "",
    min_rating: "",
    gender: "",
    language: "",
    verified: false,
    accepting_patients: false,
    min_fee: "",
    max_fee: "",
  });

  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // ✅ Initialize from searchParams cleanly
  useEffect(() => {
    const initialFilters: FilterState = {
      q: searchParams.get("q") || "",
      specialization_id: searchParams.getAll("specialization_id"),
      min_experience: searchParams.get("min_experience") || "",
      max_experience: searchParams.get("max_experience") || "",
      min_rating: searchParams.get("min_rating") || "",
      gender: searchParams.get("gender") || "",
      language: searchParams.get("language") || "",
      verified: searchParams.get("verified") === "true",
      accepting_patients: searchParams.get("accepting_patients") === "true",
      min_fee: searchParams.get("min_fee") || "",
      max_fee: searchParams.get("max_fee") || "",
    };
    setFilters(initialFilters);
  }, [searchParams]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSpecialty = (specialtyId: string) => {
    setFilters((prev) => ({
      ...prev,
      specialization_id: prev.specialization_id.includes(specialtyId)
        ? prev.specialization_id.filter((id) => id !== specialtyId)
        : [...prev.specialization_id, specialtyId],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      q: "",
      specialization_id: [],
      min_experience: "",
      max_experience: "",
      min_rating: "",
      gender: "",
      language: "",
      verified: false,
      accepting_patients: false,
      min_fee: "",
      max_fee: "",
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.q) count++;
    if (filters.specialization_id.length) count++;
    if (filters.min_experience) count++;
    if (filters.max_experience) count++;
    if (filters.min_rating) count++;
    if (filters.gender) count++;
    if (filters.language) count++;
    if (filters.verified) count++;
    if (filters.accepting_patients) count++;
    return count;
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (filters.q) params.set("q", filters.q);
    filters.specialization_id.forEach((id) =>
      params.append("specialization_id", id)
    );
    if (filters.min_experience)
      params.set("min_experience", filters.min_experience);
    if (filters.max_experience)
      params.set("max_experience", filters.max_experience);
    if (filters.min_rating) params.set("min_rating", filters.min_rating);
    if (filters.gender) params.set("gender", filters.gender);
    if (filters.language) params.set("language", filters.language);
    if (filters.verified) params.set("verified", "true");
    if (filters.accepting_patients) params.set("accepting_patients", "true");

    router.push(`/search?${params.toString()}`);
  };

  const getSpecialtyName = (id: string) => {
    return allSpecialties.find((s) => s.id === id)?.name || id;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <ArrowBack />
          <h2 className="text-xl sm:text-2xl font-bold">Search Filters</h2>
          <button
            onClick={clearAllFilters}
            className="text-sm text-[#00BAB8] font-medium"
            disabled={getActiveFilterCount() === 0}
          >
            Clear All
          </button>
        </div>

        {/* Active Filters Count */}
        {getActiveFilterCount() > 0 && (
          <div className="mb-4 p-3 bg-[#00BAB8]/10 rounded-lg">
            <div className="flex items-center gap-2">
              <FaFilter className="text-[#00BAB8]" />
              <span className="text-sm font-medium">
                {getActiveFilterCount()} filter
                {getActiveFilterCount() !== 1 ? "s" : ""} applied
              </span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Search Query */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FaSearch className="text-[#00BAB8]" />
              Search Keywords
            </label>
            <input
              type="text"
              placeholder="Doctor name, condition, etc..."
              value={filters.q}
              onChange={(e) => updateFilter("q", e.target.value)}
              className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BAB8]/20 focus:border-[#00BAB8]"
            />
          </div>

          {/* Specialties */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FaStethoscope className="text-[#00BAB8]" />
              Specialties{" "}
              {filters.specialization_id.length > 0 &&
                `(${filters.specialization_id.length})`}
            </label>
            <button
              onClick={() => setShowSpecialtyModal(true)}
              className="w-full p-3 border border-neutral-200 rounded-lg text-left bg-white hover:bg-gray-50 transition-colors"
            >
              {filters.specialization_id.length > 0 ? (
                <div className="flex flex-wrap gap-1 bg-none">
                  {filters.specialization_id.slice(0, 2).map((id) => (
                    <span
                      key={id}
                      className="px-2 py-1 bg-[#00BAB8]/10 text-[#00BAB8] text-xs rounded"
                    >
                      {getSpecialtyName(id)}
                    </span>
                  ))}
                  {filters.specialization_id.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{filters.specialization_id.length - 2} more
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-gray-500">Select specialties...</span>
              )}
            </button>
          </div>

          {/* Experience Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaClock className="text-[#00BAB8]" />
                Min Experience
              </label>
              <select
                value={filters.min_experience}
                onChange={(e) => updateFilter("min_experience", e.target.value)}
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BAB8]/20 focus:border-[#00BAB8]"
              >
                <option value="">Any</option>
                {EXPERIENCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Max Experience
              </label>
              <select
                value={filters.max_experience}
                onChange={(e) => updateFilter("max_experience", e.target.value)}
                className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BAB8]/20 focus:border-[#00BAB8]"
              >
                <option value="">Any</option>
                {EXPERIENCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FaStar className="text-[#00BAB8]" />
              Minimum Rating
            </label>
            <select
              value={filters.min_rating}
              onChange={(e) => updateFilter("min_rating", e.target.value)}
              className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BAB8]/20 focus:border-[#00BAB8]"
            >
              <option value="">Any Rating</option>
              {RATING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ⭐
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FaUserMd className="text-[#00BAB8]" />
              Gender Preference
            </label>
            <select
              value={filters.gender}
              onChange={(e) => updateFilter("gender", e.target.value)}
              className="w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BAB8]/20 focus:border-[#00BAB8]"
            >
              <option value="">Any Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FaLanguage className="text-[#00BAB8]" />
              Language Spoken
            </label>
            <button
              onClick={() => setShowLanguageModal(true)}
              className="w-full p-3 border border-neutral-200 rounded-lg text-left bg-white hover:bg-gray-50 transition-colors"
            >
              {filters.language || (
                <span className="text-gray-500">Select language...</span>
              )}
            </button>
          </div>

          {/* Toggle Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-[#00BAB8]/10 rounded-full flex items-center justify-center">
                  <FaClipboardUser className="text-[#00BAB8]" />
                </div>
                <div>
                  <span className="font-medium">Verified Doctors Only</span>
                  <p className="text-sm text-gray-500">
                    Show only verified profiles
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={(e) => updateFilter("verified", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00BAB8]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BAB8]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaClipboardUser className="text-green-600" />
                </div>
                <div>
                  <span className="font-medium">Accepting New Patients</span>
                  <p className="text-sm text-gray-500">
                    Available for appointments
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.accepting_patients}
                  onChange={(e) =>
                    updateFilter("accepting_patients", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00BAB8]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00BAB8]"></div>
              </label>
            </div>
          </div>

          {/* Note about consultation fees */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Consultation fee filtering will be
              available in a future update. You can view fees on individual
              doctor profiles.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Search Button */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-neutral-200 p-4 z-40">
        <div className="max-w-md mx-auto">
          <AnimatedButton
            text="Search Doctors"
            fullWidth
            onClick={handleSearch}
            style="h-12 sm:h-14"
            textSize="text-sm sm:text-lg"
          />
        </div>
      </div>

      {/* ✅ Specialties Modal works with specialization_id */}
      {showSpecialtyModal && (
        <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Select Specialties</h3>
              <button
                onClick={() => setShowSpecialtyModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-96">
              {allSpecialties.map((specialty) => (
                <label
                  key={specialty.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.specialization_id.includes(specialty.id)}
                    onChange={() => toggleSpecialty(specialty.id)}
                    className="w-4 h-4 text-[#00BAB8] border-gray-200 rounded focus:ring-[#00BAB8]"
                  />
                  <span>{specialty.name}</span>
                </label>
              ))}
            </div>
            <div className="p-4 border-t">
              <button
                onClick={() => setShowSpecialtyModal(false)}
                className="w-full py-3 bg-[#00BAB8] text-white rounded-lg font-medium"
              >
                Done ({filters.specialization_id.length} selected)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Language Modal works same way */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Select Language</h3>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-96">
              <button
                onClick={() => {
                  updateFilter("language", "");
                  setShowLanguageModal(false);
                }}
                className="w-full text-left p-2 hover:bg-gray-50 rounded-lg"
              >
                Any Language
              </button>
              {LANGUAGES.map((language) => (
                <button
                  key={language}
                  onClick={() => {
                    updateFilter("language", language);
                    setShowLanguageModal(false);
                  }}
                  className={`w-full text-left p-2 hover:bg-gray-50 rounded-lg ${
                    filters.language === language
                      ? "bg-[#00BAB8]/10 text-[#00BAB8]"
                      : ""
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
