"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

interface Service {
  id: string;
  name: string;
  description?: string;
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
      } catch (err: any) {
        setError(err.message);
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && selectedService) {
      setStep(2); // go to concern input
    } else if (step === 2 && concern.trim() !== "") {
      fetchSlots();
      setStep(3); // go to appointment selection
    } else if (step === 3 && selectedSlot) {
      alert(
        `Booking confirmed for ${doctor?.name}, service: ${selectedService?.name}, slot: ${selectedSlot.appointment_date} @ ${selectedSlot.start_time}\nConcern: ${concern}`
      );
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!doctor) return <p>No doctor found</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Book with {doctor.name}</h1>

      {/* Step 1: Services */}
      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold mb-2">Select a Service</h2>
          {services.length > 0 ? (
            <ul className="list-disc ml-6">
              {services.map((s) => (
                <li key={s.id} className="mb-2">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="service"
                      value={s.id}
                      className="mr-2"
                      checked={selectedService?.id === s.id}
                      onChange={() => setSelectedService(s)}
                    />
                    <strong>{s.name}</strong>
                    {s.description && (
                      <p className="text-gray-700">{s.description}</p>
                    )}
                  </label>
                </li>
              ))}
              {/* Permanent Other button */}
              <li className="mb-2">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="service"
                    value="other"
                    className="mr-2"
                    checked={selectedService?.id === "other"}
                    onChange={() =>
                      setSelectedService({ id: "other", name: "Other" })
                    }
                  />
                  <strong>Other</strong>
                </label>
              </li>
            </ul>
          ) : (
            <p>No services available for this doctor.</p>
          )}
        </>
      )}

      {/* Step 2: Concern Input */}
      {step === 2 && (
        <>
          <h2 className="text-xl font-semibold mb-2">Describe Your Concern</h2>
          <textarea
            className="w-full border p-2 rounded"
            rows={5}
            placeholder="Enter your concern or symptoms here..."
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
          />
        </>
      )}

      {/* Step 3: Appointment Slots */}
      {step === 3 && (
        <>
          <h2 className="text-xl font-semibold mb-2">
            Select an Appointment Slot for {selectedService?.name}
          </h2>

          {/* Date tabs */}
          <div className="flex gap-2 mb-4">
            {Object.keys(slotsByDate).map((date) => (
              <button
                key={date}
                className={`px-3 py-1 rounded ${
                  date === activeDate
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setActiveDate(date)}
              >
                {date}
              </button>
            ))}
          </div>

          {/* Slots for active date */}
          {activeDate && slotsByDate[activeDate].length > 0 ? (
            <ul className="list-disc ml-6">
              {slotsByDate[activeDate].map((slot) => (
                <li key={slot.id} className="mb-1">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="slot"
                      value={slot.id}
                      className="mr-2"
                      checked={selectedSlot?.id === slot.id}
                      onChange={() => setSelectedSlot(slot)}
                      disabled={slot.is_booked}
                    />
                    {slot.start_time} {slot.is_booked && "(Booked)"}
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <p>No slots available for this date.</p>
          )}
        </>
      )}

      {/* Navigation Buttons */}
      <div className="mt-4">
        {step > 1 && (
          <button
            className="mr-2 px-3 py-1 bg-gray-300 text-black rounded"
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>
        )}
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={handleNext}
          disabled={
            (step === 1 && !selectedService) ||
            (step === 2 && concern.trim() === "") ||
            (step === 3 && !selectedSlot)
          }
        >
          {step === 3 ? "Confirm Booking" : "Next"}
        </button>
      </div>
    </div>
  );
}
