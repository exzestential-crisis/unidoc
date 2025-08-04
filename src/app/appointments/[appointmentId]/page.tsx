"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AppointmentDetails() {
  const params = useParams();
  const appointmentId = params.appointmentId;

  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState("null");

  useEffect(() => {
    if (!appointmentId) return;

    async function fetchAppointment() {
      setError("");
      setAppointment(null);

      try {
        const res = await fetch(`/api/appointments/${appointmentId}`, {
          credentials: "include", // <--- add this
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to fetch appointment.");
        } else {
          setAppointment(data);
        }
      } catch (err) {
        setError("Network error.");
      }
    }

    fetchAppointment();
  }, [appointmentId]);

  if (!appointmentId) return <p>Loading appointment ID...</p>;

  return (
    <div>
      <h2>Appointment Details for ID: {appointmentId}</h2>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {appointment && <pre>{JSON.stringify(appointment, null, 2)}</pre>}

      {!appointment && !error && <p>Loading appointment data...</p>}
    </div>
  );
}
