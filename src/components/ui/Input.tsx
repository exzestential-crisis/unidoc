"use client";

import { useState, ChangeEvent } from "react";
import { ClosedEye, OpenEye } from "@/components/icons";

interface InputProps {
  type?: "text" | "email" | "password";
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  id: string;
  showPasswordToggle?: boolean;
  className?: string;
}

export default function Input({
  type = "text",
  value,
  onChange,
  label,
  id,
  showPasswordToggle = false,
  className = "",
}: InputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const inputType =
    type === "password" && showPasswordToggle
      ? passwordVisible
        ? "text"
        : "password"
      : type;

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type={inputType}
        id={id}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer w-full p-6 pt-8 text-xl text-black rounded-lg bg-white shadow shadow-zinc-200 placeholder-transparent focus:outline-none"
      />
      <label
        htmlFor={id}
        className={`absolute left-6 text-zinc-400 transition-all ${
          value.length > 0
            ? "top-2 text-sm"
            : "top-6 text-xl peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-focus:top-2 peer-focus:text-sm"
        }`}
      >
        {label}
      </label>

      {/* Password visibility toggle */}
      {type === "password" && showPasswordToggle && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-6 top-1/2 -translate-y-1/2"
        >
          {passwordVisible ? <OpenEye /> : <ClosedEye />}
        </button>
      )}
    </div>
  );
}
