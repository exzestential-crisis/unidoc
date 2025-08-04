"use client";

import { useState } from "react";

export default function RescheduleTest() {
  const [message, setMessage] = useState("");

  async function handleReschedule() {
    const res = await fetch(
      "/api/appointments/a181a0aa-300c-4c5c-9120-dee903136b31",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // very important!
        body: JSON.stringify({
          slot_id: "00d4b267-9f3f-4d9d-bd99-d4ee7c4a26f7",
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      setMessage("❌ Error: " + data.error);
    } else {
      setMessage("✅ Rescheduled: " + JSON.stringify(data));
    }
  }

  return (
    <div className="p-4">
      <button
        onClick={handleReschedule}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Test Reschedule
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
