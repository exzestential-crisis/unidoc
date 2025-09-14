"use client";

import { BookPageSkeleton } from "@/components/skeletons";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

interface Service {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

interface Doctor {
  id: string;
  name: string;
  years_experience?: number;
  consultation_fee?: number;
  bio?: string;
  license_number?: string;
}

interface Slot {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time?: string;
  is_booked?: boolean;
}

export default function BookPage() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId");

  const [services, setServices] = useState<Service[]>([]);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [concern, setConcern] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [activeDate, setActiveDate] = useState<string | null>(null);

  // Fetch doctor + services
  useEffect(() => {
    if (!doctorId) {
      setError("No doctor selected");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/doctors/${doctorId}`);
        if (!res.ok) {
          const errJson = await res.json();
          throw new Error(errJson.error || "Failed to fetch doctor");
        }

        const json = await res.json();
        setDoctor(json.data?.doctor || null);
        setServices(json.data?.services || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  // Fetch appointment slots
  const fetchSlots = async () => {
    if (!doctorId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/doctors/${doctorId}/appointment-slots`);
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Failed to fetch slots");
      }
      const json = await res.json();
      const availableSlots: Slot[] = json.slots || [];
      setSlots(availableSlots);

      // Automatically set first available date as active
      const dates = Array.from(
        new Set(availableSlots.map((s) => s.appointment_date))
      );
      setActiveDate(dates[0] || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 1 && selectedService) {
      setStep(2); // go to concern input
    } else if (step === 2 && concern.trim() !== "") {
      fetchSlots();
      setStep(3); // go to appointment selection
    } else if (step === 3 && selectedSlot && selectedService) {
      // Make the actual booking API call
      setLoading(true);
      try {
        const response = await fetch("/api/book", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slot_id: selectedSlot.id,
            services_id: selectedService.id,
            concern: concern.trim(),
            appointment_type: "regular",
            is_priority: false,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to book appointment");
        }

        // Show success message
        alert(
          `Booking confirmed!\n` +
            `Doctor: ${result.data.appointment.doctor_name}\n` +
            `Service: ${result.data.appointment.service_name}\n` +
            `Date: ${selectedSlot.appointment_date}\n` +
            `Time: ${selectedSlot.start_time}\n` +
            `Concern: ${concern}`
        );

        window.location.href = "/appointments";
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Group slots by date for tabs
  const slotsByDate = useMemo(() => {
    return slots.reduce<Record<string, Slot[]>>((acc, slot) => {
      if (!acc[slot.appointment_date]) acc[slot.appointment_date] = [];
      acc[slot.appointment_date].push(slot);
      return acc;
    }, {});
  }, [slots]);

  // Service icons mapping
  const getServiceIcon = (serviceName: string) => {
    const iconMap: Record<string, string> = {
      consultation: "🦷",
      "tooth pain": "🦷",
      cleaning: "✨",
      braces: "🦷",
      "dental implant": "🦷",
      other: "💬",
    };
    return iconMap[serviceName.toLowerCase()] || "🦷";
  };

  if (loading) return <BookPageSkeleton />;

  if (error)
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  if (!doctor)
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <p className="text-center">No doctor found</p>
      </div>
    );

  return (
    <div className="min-h-screen text-gray-900 flex flex-col">
      {/* Scrollable content */}
      <div className="p-6 w-full bg-white flex-1 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Book Appointment
          </h1>
          <p className="text-gray-500">{doctor.name}</p>
        </div>

        {/* Step 1: Services */}
        {step === 1 && (
          <div className="mb-24">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 uppercase tracking-wide ">
                HOW WE MAY HELP YOU?
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {services.map((service) => (
                <div key={service.id} className="relative">
                  <input
                    type="radio"
                    name="service"
                    value={service.id}
                    id={`service-${service.id}`}
                    className="sr-only"
                    checked={selectedService?.id === service.id}
                    onChange={() => setSelectedService(service)}
                  />
                  <label
                    htmlFor={`service-${service.id}`}
                    className={`flex items-center justify-center p-6 rounded-2xl h-40 cursor-pointer transition-all duration-200 ${
                      selectedService?.id === service.id
                        ? "bg-[#00bab8] text-white shadow-lg transform scale-105"
                        : "bg-white border border-gray-200 hover:border-[#00bab8] hover:shadow-md"
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`text-3xl mb-3 ${
                          selectedService?.id === service.id
                            ? "filter brightness-0 invert"
                            : ""
                        }`}
                      >
                        {getServiceIcon(service.name)}
                      </div>
                      <div className="font-medium text-sm leading-tight">
                        {service.name}
                      </div>
                    </div>
                  </label>
                </div>
              ))}

              {/* Other service option */}
              <div className="relative">
                <input
                  type="radio"
                  name="service"
                  value="other"
                  id="service-other"
                  className="sr-only"
                  checked={selectedService?.id === "other"}
                  onChange={() =>
                    setSelectedService({ id: "other", name: "Other" })
                  }
                />
                <label
                  htmlFor="service-other"
                  className={`flex items-center justify-center p-6 rounded-2xl h-40 cursor-pointer transition-all duration-200 ${
                    selectedService?.id === "other"
                      ? "bg-[#00bab8] text-white shadow-lg transform scale-105"
                      : "bg-white border border-gray-200 hover:border-[#00bab8] hover:shadow-md"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`text-3xl mb-3 ${
                        selectedService?.id === "other"
                          ? "filter brightness-0 invert"
                          : ""
                      }`}
                    >
                      💬
                    </div>
                    <div className="font-medium text-sm leading-tight">
                      Other
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="text-center mb-6">
              <span className="text-gray-400 text-sm">2 of 4</span>
            </div>
          </div>
        )}

        {/* Step 2: Concern Input */}
        {step === 2 && (
          <div className="mb-24">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 uppercase tracking-wide mb-4">
                DESCRIBE YOUR CONCERN
              </h2>
              <textarea
                className="w-full border border-gray-200 p-4 rounded-xl resize-none focus:outline-none focus:border-[#00bab8] focus:ring-1 focus:ring-[#00bab8]"
                rows={6}
                placeholder="Please describe your symptoms or concerns in detail..."
                value={concern}
                onChange={(e) => setConcern(e.target.value)}
              />
            </div>

            <div className="text-center mb-6">
              <span className="text-gray-400 text-sm">3 of 4</span>
            </div>
          </div>
        )}

        {/* Step 3: Appointment Slots */}
        {step === 3 && (
          <div className="mb-24">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 uppercase tracking-wide mb-4">
                SELECT APPOINTMENT TIME
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Service: {selectedService?.name}
              </p>

              {/* Date tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {Object.keys(slotsByDate).map((date) => (
                  <button
                    key={date}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all duration-200 ${
                      date === activeDate
                        ? "bg-[#00bab8] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveDate(date)}
                  >
                    {new Date(date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </button>
                ))}
              </div>

              {/* Time slots */}
              {activeDate && slotsByDate[activeDate].length > 0 ? (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {slotsByDate[activeDate].map((slot) => (
                    <div key={slot.id} className="relative">
                      <input
                        type="radio"
                        name="slot"
                        value={slot.id}
                        id={`slot-${slot.id}`}
                        className="sr-only"
                        checked={selectedSlot?.id === slot.id}
                        onChange={() => setSelectedSlot(slot)}
                        disabled={slot.is_booked}
                      />
                      <label
                        htmlFor={`slot-${slot.id}`}
                        className={`block p-4 rounded-lg text-center cursor-pointer transition-all duration-200 ${
                          slot.is_booked
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : selectedSlot?.id === slot.id
                            ? "bg-[#00bab8] text-white shadow-lg"
                            : "bg-white border border-gray-200 hover:border-[#00bab8] hover:shadow-md"
                        }`}
                      >
                        <div className="font-medium">{slot.start_time}</div>
                        {slot.is_booked && (
                          <div className="text-xs mt-1">Booked</div>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No slots available for this date.
                </div>
              )}
            </div>

            <div className="text-center mb-6">
              <span className="text-gray-400 text-sm">4 of 4</span>
            </div>
          </div>
        )}
      </div>

      {/* Fixed footer buttons */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t border-gray-200 flex gap-3">
        <button
          className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-medium"
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
        >
          BACK
        </button>
        <button
          className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
            (step === 1 && selectedService) ||
            (step === 2 && concern.trim() !== "") ||
            (step === 3 && selectedSlot)
              ? "bg-[#00bab8] hover:bg-[#00a8a6]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={handleNext}
          disabled={
            (step === 1 && !selectedService) ||
            (step === 2 && concern.trim() === "") ||
            (step === 3 && !selectedSlot)
          }
        >
          {step === 3 ? "CONFIRM BOOKING" : "NEXT"}
        </button>
      </div>
    </div>
  );
}
