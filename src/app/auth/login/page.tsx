"use client";

import { useState } from "react";
import { ArrowBack, ArrowForward } from "@/components/nav";
import { Facebook, Google } from "../../../../public";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <div className="min-h-[100dvh] bg-zinc-100 p-4">
      <ArrowBack size="extra-large" />

      <div className="flex flex-col p-4">
        <h2 className="font-bold text-4xl text-zinc-800 mb-40">Login</h2>

        <div className="flex flex-col space-y-4 w-full">
          <Input
            type="email"
            id="email"
            label="Email"
            value={formData.email}
            onChange={handleInputChange("email")}
          />

          <Input
            type="password"
            id="password"
            label="Password"
            value={formData.password}
            onChange={handleInputChange("password")}
            showPasswordToggle={true}
          />
        </div>

        <div className="flex justify-end items-center w-full">
          <p className="text-sm text-zinc-400 my-4">Forgot your password? </p>
          <ArrowForward size="small" />
        </div>

        <button className="bg-[#525858] rounded-full text-2xl p-4 shadow-md shadow-zinc-400">
          Login
        </button>
      </div>

      <div className="flex flex-col items-center mt-30">
        <p className="text-zinc-400 p-4">Or login with a social account</p>
        <div className="flex justify-center items-center gap-10">
          <div className="flex justify-center items-center bg-white rounded-xl h-20 w-20">
            <img src={Google.src} alt="" className="h-12" />
          </div>
          <div className="flex justify-center items-center bg-white rounded-xl h-20 w-20">
            <img src={Facebook.src} alt="" className="h-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
