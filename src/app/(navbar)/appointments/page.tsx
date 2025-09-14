"use client";
import { ArrowBack } from "@/components/nav";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCalendarCheck, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { FaUser, FaCalendarDays, FaStethoscope } from "react-icons/fa6";
import { AppointmentPageSkeleton } from "@/components/skeletons";

interface DoctorProfile {
  id: string;
  years_of_experience: number;
  bio: string;
  consultation_fee: number;
  specialization_id: string;
  users: {
    first_name: string;
    last_name: string;
    gender: string;
    phone: string;
    profile_image_url?: string;
  };
  medical_specialties: {
    id: string;
    name: string;
  };
  doctor_hospitals: Array<{
    id: string;
    is_primary: boolean;
    hospitals: {
      id: string;
      name: string;
      address: string;
    };
  }>;
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  doctor_id: string;
  patient_id: string;
  concern?: string;
  created_at: string;
  updated_at: string;
  doctor_profiles: DoctorProfile;
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/appointments");
        if (response.ok) {
          const json = await response.json();
          console.log("API Response:", json);
          console.log("First appointment:", json.data?.[0]);
          console.log("Doctor profile:", json.data?.[0]?.doctor_profiles);
          setAppointments(json.data || []);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch appointments");
        }
      } catch (err) {
        setError("Network error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "text-blue-600 bg-blue-50";
      case "completed":
        return "text-green-600 bg-green-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      case "no_show":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Scheduled";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      case "no_show":
        return "No Show";
      default:
        return status;
    }
  };

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
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isUpcoming = (dateString: string, timeString: string) => {
    const appointmentDateTime = new Date(`${dateString}T${timeString}`);
    return appointmentDateTime > new Date();
  };

  const getDoctorName = (appointment: Appointment) => {
    if (!appointment.doctor_profiles?.users) return "Unknown Doctor";
    const { first_name, last_name } = appointment.doctor_profiles.users;
    return `Dr. ${first_name} ${last_name}`;
  };

  const getDoctorSpecialty = (appointment: Appointment) => {
    return (
      appointment.doctor_profiles?.medical_specialties?.name ||
      "General Medicine"
    );
  };

  const getPrimaryHospital = (appointment: Appointment) => {
    const primaryHospital = appointment.doctor_profiles?.doctor_hospitals?.find(
      (dh) => dh.is_primary
    );
    return primaryHospital?.hospitals?.name || "Hospital not specified";
  };

  // Separate upcoming and past appointments
  const upcomingAppointments = appointments.filter(
    (apt) =>
      isUpcoming(apt.appointment_date, apt.appointment_time) &&
      apt.status === "scheduled"
  );
  const pastAppointments = appointments.filter(
    (apt) =>
      !isUpcoming(apt.appointment_date, apt.appointment_time) ||
      apt.status !== "scheduled"
  );

  if (loading) return <AppointmentPageSkeleton />;
  if (error) return <p className="text-red-500 p-4">Error: {error}</p>;

  return (
    <div className="relative min-h-screen bg-white">
      <div className="pb-6 px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <ArrowBack />
          <h2 className="text-xl sm:text-2xl font-bold">My Appointments</h2>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-2xl">
            <div className="flex justify-center mb-2">
              <FaCalendarCheck className="text-blue-600 text-2xl" />
            </div>
            <p className="font-bold text-lg text-blue-600">
              {upcomingAppointments.length}
            </p>
            <p className="text-xs text-blue-600">Upcoming</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-2xl">
            <div className="flex justify-center mb-2">
              <FaCalendarDays className="text-green-600 text-2xl" />
            </div>
            <p className="font-bold text-lg text-green-600">
              {appointments.length}
            </p>
            <p className="text-xs text-green-600">Total</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-2xl">
            <div className="flex justify-center mb-2">
              <FaClock className="text-gray-600 text-2xl" />
            </div>
            <p className="font-bold text-lg text-gray-600">
              {pastAppointments.length}
            </p>
            <p className="text-xs text-gray-600">Past</p>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <FaCalendarCheck className="text-gray-400 text-6xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Appointments Yet
            </h3>
            <p className="text-gray-500 mb-6">
              You haven&apos;t scheduled any appointments.
            </p>
            <button
              onClick={() => router.push("/doctors")}
              className="bg-[#00BAB8] text-white px-6 py-3 rounded-full font-medium hover:bg-[#00A5A3] transition-colors"
            >
              Find a Doctor
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Upcoming Appointments
                </h3>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border border-neutral-200 rounded-2xl shadow-sm p-4 bg-white"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          {/* Doctor Profile Image and Name */}
                          <div className="flex items-center gap-3 mb-3">
                            {appointment.doctor_profiles?.users
                              ?.profile_image_url ? (
                              <img
                                src={
                                  appointment.doctor_profiles.users
                                    .profile_image_url
                                }
                                alt={getDoctorName(appointment)}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-[#00BAB8] flex items-center justify-center">
                                <FaUser className="text-white text-lg" />
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold text-gray-800 text-lg">
                                {getDoctorName(appointment)}
                              </h4>
                              <div className="flex items-center gap-2">
                                <FaStethoscope className="text-[#00BAB8] text-sm" />
                                <span className="text-sm text-gray-600">
                                  {getDoctorSpecialty(appointment)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Hospital Location */}
                          <div className="flex items-center gap-2 mb-2">
                            <FaMapMarkerAlt className="text-gray-500 text-sm" />
                            <span className="text-sm text-gray-600">
                              {getPrimaryHospital(appointment)}
                            </span>
                          </div>

                          {/* Date and Time */}
                          <div className="flex items-center gap-2 mb-1">
                            <FaCalendarCheck className="text-gray-500 text-sm" />
                            <span className="text-sm text-gray-600">
                              {formatDate(appointment.appointment_date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaClock className="text-gray-500 text-sm" />
                            <span className="text-sm text-gray-600">
                              {formatTime(appointment.appointment_time)}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {getStatusText(appointment.status)}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() =>
                            router.push(`/doctors/${appointment.doctor_id}`)
                          }
                          className="flex-1 bg-[#00BAB8] text-white py-2 px-4 rounded-full text-sm font-medium hover:bg-[#00A5A3] transition-colors"
                        >
                          View Doctor
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                          Reschedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Past Appointments
                </h3>
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border border-neutral-200 rounded-2xl shadow-sm p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          {/* Doctor Profile Image and Name */}
                          <div className="flex items-center gap-3 mb-3">
                            {appointment.doctor_profiles?.users
                              ?.profile_image_url ? (
                              <img
                                src={
                                  appointment.doctor_profiles.users
                                    .profile_image_url
                                }
                                alt={getDoctorName(appointment)}
                                className="w-12 h-12 rounded-full object-cover grayscale"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center">
                                <FaUser className="text-white text-lg" />
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold text-gray-600 text-lg">
                                {getDoctorName(appointment)}
                              </h4>
                              <div className="flex items-center gap-2">
                                <FaStethoscope className="text-gray-400 text-sm" />
                                <span className="text-sm text-gray-500">
                                  {getDoctorSpecialty(appointment)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Hospital Location */}
                          <div className="flex items-center gap-2 mb-2">
                            <FaMapMarkerAlt className="text-gray-400 text-sm" />
                            <span className="text-sm text-gray-500">
                              {getPrimaryHospital(appointment)}
                            </span>
                          </div>

                          {/* Date and Time */}
                          <div className="flex items-center gap-2 mb-1">
                            <FaCalendarCheck className="text-gray-400 text-sm" />
                            <span className="text-sm text-gray-500">
                              {formatDate(appointment.appointment_date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaClock className="text-gray-400 text-sm" />
                            <span className="text-sm text-gray-500">
                              {formatTime(appointment.appointment_time)}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {getStatusText(appointment.status)}
                        </div>
                      </div>

                      {appointment.concern && (
                        <div className="mt-3 p-3 bg-white rounded-lg">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Concern: </span>
                            {appointment.concern}
                          </p>
                        </div>
                      )}

                      <div className="mt-4">
                        <button
                          onClick={() =>
                            router.push(`/appointments/${appointment.id}`)
                          }
                          className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                        >
                          View Appointment Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
