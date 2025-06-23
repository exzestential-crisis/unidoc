"use client";

import { useState, ChangeEvent } from "react";
import { ClosedEye, OpenEye } from "@/components/icons";

interface InputProps {
  type?: "text" | "email" | "password";
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  showPasswordToggle?: boolean;
  disabled?: boolean;
}

export default function Input({
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  showPasswordToggle = false,
  disabled = false,
}: InputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // Base styles that are common to both variants
  const baseStyles = `
    w-full
    lg:p-3 lg:text-md 
    rounded-xl
    focus:outline-none focus:ring-2 
    transition-all duration-200
    text-slate-900 dark:text-white 
    bg-zinc-100 dark:bg-zinc-700 
    border border-zinc-200 dark:border-zinc-600
  `;

  const inputType =
    type === "password" && showPasswordToggle
      ? passwordVisible
        ? "text"
        : "password"
      : type;

  const eyeIconPosition = {
    blue: "top-1/2 -translate-y-1/2",
    plain: "top-[63%] -translate-y-1/2",
  };

  return (
    <div className="relative w-full">
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          ${baseStyles}
          ${className}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      />

      {/* Password visibility toggle */}
      {type === "password" && showPasswordToggle && (
        <div
          className={`
            absolute right-3
            transform
            flex items-center cursor-pointer
          `}
          onClick={togglePasswordVisibility}
        >
          {passwordVisible ? <ClosedEye /> : <OpenEye />}
        </div>
      )}
    </div>
  );
}
