"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("patient"); // default to patient
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          user_type: userType,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/login");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl mb-4">Register</h1>

      <input
        type="text"
        placeholder="First Name"
        className="input"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        className="input"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <select
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
        className="input"
        required
      >
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
      </select>

      <input
        type="email"
        placeholder="Email"
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />

      {errorMsg && <p className="text-red-600">{errorMsg}</p>}
      <button type="submit" className="btn-primary mt-4 w-full">
        Register
      </button>
    </form>
  );
}
