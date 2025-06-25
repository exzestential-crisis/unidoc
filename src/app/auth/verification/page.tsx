"use client";

import React, { useState, useRef } from "react";

export default function VerificationPage() {
  // ui
  const [values, setValues] = useState(Array(6).fill(""));
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef(
    Array.from({ length: 6 }, () => React.createRef<HTMLInputElement>())
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValues = [...values];
    newValues[index] = e.target.value.slice(0, 1); // Only allow one character
    setValues(newValues);

    if (e.target.value && index < 5) {
      inputRefs.current[index + 1]?.current?.focus(); // Safely focus next input
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && values[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1]?.current?.focus(); // Safely move focus back
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[100dvh] bg-white">
      <div className="flex flex-col items-center">
        <h2 className="text-black font-bold text-2xl">Verify your account</h2>
        <p className="text-gray-400">
          Please enter the verification code sent to your email
        </p>

        <div className="flex space-x-2 just my-4">
          {values.map((value, index) => (
            <input
              key={index}
              type="text"
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              ref={inputRefs.current[index]}
              className="
                        w-16 h-16
                        text-center font-bold
                        border-4 border-zinc-100 rounded-lg

                        bg-white
                        hover:bg-zinc-100 hover:border-zinc-200 hover:shadow-[0_6px_0_theme('colors.zinc.200')] hover:translate-y-[1px] 

                        focus:outline-none focus:ring-0
                        "
            />
          ))}
        </div>

        <button
          type="button"
          className="text-xs my-4 hover:underline text-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resendCooldown > 0
            ? `Didn't get an email? Resend verification code in ${resendCooldown}s`
            : "Didn't get an email? Resend verification code"}
        </button>

        <button className="bg-[#525858] rounded-full text-xl m-4 p-4 w-full">
          Submit
        </button>
      </div>
    </div>
  );
}
