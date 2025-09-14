"use client";
import { ArrowBack } from "@/components/nav";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaUser } from "react-icons/fa";
import { FaCalendarCheck, FaNotesMedical } from "react-icons/fa6";
import { IoChatboxEllipses } from "react-icons/io5";
import { MdCancel, MdEdit } from "react-icons/md";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { LoadingPage } from "@/components/pages/LoadingPage";

interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  slot_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export default function AppointmentPage() {
  const router = useRouter();
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await fetch(`/api/appointments/${appointmentId}`);
        if (response.ok) {
          const appointmentData = await response.json();
          console.log("API Response:", appointmentData);
          setAppointment(appointmentData);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch appointment");
        }
      } catch (err) {
        setError("Network error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointmentData();
    }
  }, [appointmentId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "cancelled":
        return "text-red-500";
      case "completed":
        return "text-blue-500";
      default:
        return "text-neutral-500";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-50 border-green-200";
      case "pending":
        return "bg-yellow-50 border-yellow-200";
      case "cancelled":
        return "bg-red-50 border-red-200";
      case "completed":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-neutral-50 border-neutral-200";
    }
  };

  const handleReschedule = () => {
    router.push(`/book?reschedule=true&appointmentId=${appointment?.id}`);
  };

  const handleCancel = async () => {
    if (!appointment) return;

    const confirmCancel = confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (!confirmCancel) return;

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (response.ok) {
        const updatedAppointment = await response.json();
        setAppointment(updatedAppointment.data);
      } else {
        alert("Failed to cancel appointment");
      }
    } catch (error) {
      alert("Error cancelling appointment");
      console.error(error);
    }
  };

  if (loading) return <LoadingPage message="Loading appointment details..." />;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!appointment) return <p>No appointment found</p>;

  return (
    <div className="relative min-h-screen bg-white">
      {/* Main content with padding bottom for fixed footer */}
      <div className="pb-24 px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <ArrowBack />
          <h2 className="text-xl sm:text-2xl font-bold">Appointment Details</h2>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        {/* Appointment Details Card */}
        <div className="space-y-6">
          <div className="border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Status Header */}
            <div
              className={`p-4 border-b ${getStatusBgColor(appointment.status)}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-neutral-800">
                    Appointment #{appointment.id.slice(-6)}
                  </h2>
                  <p
                    className={`text-sm font-medium capitalize ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBgColor(
                      appointment.status
                    )} ${getStatusColor(appointment.status)}`}
                  >
                    {appointment.status.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Info */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#00BAB8]/10">
                    <FaCalendarAlt className="text-[#00BAB8] text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Date</p>
                    <p className="font-medium">
                      {formatDate(appointment.appointment_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#00BAB8]/10">
                    <FaClock className="text-[#00BAB8] text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Time</p>
                    <p className="font-medium">
                      {formatTime(appointment.appointment_time)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#00BAB8]/10">
                  <FaUser className="text-[#00BAB8] text-lg" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Doctor ID</p>
                  <p className="font-medium">Dr. {appointment.doctor_id}</p>
                </div>
              </div>

              {appointment.notes && (
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#00BAB8]/10">
                    <FaNotesMedical className="text-[#00BAB8] text-lg" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-500">Notes</p>
                    <p className="font-medium text-sm">{appointment.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 text-neutral-700">
            <div className="flex flex-col items-center space-y-2">
              <div className="relative flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full border-neutral-100 bg-neutral-50">
                <FaCalendarCheck className="text-[#00BAB8] text-3xl sm:text-4xl z-10" />
                <div className="absolute bg-white h-8 w-8 z-0 rounded-2xl" />
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm text-neutral-500">Created</p>
                <p className="font-semibold text-xs sm:text-sm">
                  {new Date(appointment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="relative flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full border-neutral-100 bg-neutral-50">
                <MdEdit className="text-[#00BAB8] text-3xl sm:text-4xl z-10" />
                <div className="absolute bg-white h-8 w-8 z-0 rounded-2xl" />
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm text-neutral-500">Updated</p>
                <p className="font-semibold text-xs sm:text-sm">
                  {new Date(appointment.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="relative flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full border-neutral-100 bg-neutral-50">
                <IoChatboxEllipses className="text-[#00BAB8] text-3xl sm:text-4xl z-10" />
                <div className="absolute bg-white h-8 w-8 z-0 rounded-2xl" />
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm text-neutral-500">Slot ID</p>
                <p className="font-semibold text-xs sm:text-sm">
                  #{appointment.slot_id.slice(-4)}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <div className="bg-neutral-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-3">
                Appointment Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Patient ID:</span>
                  <span>{appointment.patient_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Appointment ID:</span>
                  <span className="font-mono">{appointment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Slot ID:</span>
                  <span className="font-mono">{appointment.slot_id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 safe-area-pb">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          {/* Chat Button */}
          <button
            onClick={() => console.log("Chat clicked")}
            className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            <IoChatboxEllipses className="text-2xl sm:text-3xl text-[#00BAB8]" />
          </button>

          {/* Action Buttons */}
          {appointment.status !== "cancelled" &&
            appointment.status !== "completed" && (
              <>
                {/* Reschedule Button */}
                <div className="flex-1">
                  <AnimatedButton
                    text="Reschedule"
                    fullWidth
                    onClick={handleReschedule}
                    style="h-12 sm:h-14 bg-[#00BAB8] hover:bg-[#00A5A3]"
                    textSize="text-sm sm:text-lg"
                  />
                </div>

                {/* Cancel Button */}
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                >
                  <MdCancel className="text-2xl sm:text-3xl text-red-500" />
                </button>
              </>
            )}

          {/* If cancelled or completed, show status message */}
          {(appointment.status === "cancelled" ||
            appointment.status === "completed") && (
            <div className="flex-1 text-center py-3">
              <p
                className={`font-medium ${getStatusColor(appointment.status)}`}
              >
                Appointment {appointment.status}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
