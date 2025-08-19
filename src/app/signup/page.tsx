"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ArrowBack } from "@/components/nav";
import Input from "@/components/ui/Input";
import { FaCheck } from "react-icons/fa";
import { Apple, Facebook, Google } from "../../../public";
import Link from "next/link";
import { AnimatedButton } from "@/components";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("patient"); // default to patient
  const [loading, setLoading] = useState(false);

  // Individual field errors
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  type FieldName = "firstName" | "lastName" | "email" | "password";

  // Clear specific field error when user starts typing
  const clearFieldError = (field: FieldName) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Validate individual fields
  const validateField = (field: string, value: string) => {
    switch (field) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.trim().length < 2)
          return "First name must be at least 2 characters";
        break;
      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.trim().length < 2)
          return "Last name must be at least 2 characters";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email address";
        break;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        break;
    }
    return "";
  };

  // Validate all fields before submission
  const validateAllFields = () => {
    const errors = {
      firstName: validateField("firstName", firstName),
      lastName: validateField("lastName", lastName),
      email: validateField("email", email),
      password: validateField("password", password),
    };

    setFieldErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();

    // Clear all previous errors
    setFieldErrors({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });

    // Validate all fields first
    if (!validateAllFields()) {
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            user_type: "patient",
          },
        },
      });

      if (error) {
        // Handle specific Supabase errors
        if (
          error.message.includes("email") ||
          error.message.includes("already")
        ) {
          setFieldErrors((prev) => ({
            ...prev,
            email:
              "This email is already registered. Please use a different email.",
          }));
        } else if (error.message.includes("password")) {
          setFieldErrors((prev) => ({
            ...prev,
            password: error.message,
          }));
        } else {
          // Generic error - show on email field as fallback
          setFieldErrors((prev) => ({
            ...prev,
            email: error.message,
          }));
        }
      } else if (!data.user) {
        setFieldErrors((prev) => ({
          ...prev,
          email: "This email is already in use. Please choose another email.",
        }));
      } else {
        // Success!
        router.push("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setFieldErrors((prev) => ({
        ...prev,
        email: "An unexpected error occurred. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-neutral-100 shadow rounded min-h-[100dvh] p-4">
      <ArrowBack />

      <div className="flex flex-col items-center mb-6 px-8">
        <h1 className="text-4xl font-bold mb-2 text-[#00BAB8] pt-10">
          Sign Up
        </h1>
        <h2 className="text-neutral-400 font-bold">Sign up to UniDoc today!</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 w-full max-w-md pt-10"
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                id="first_name"
                label="First Name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  clearFieldError("firstName");
                }}
                className={fieldErrors.firstName ? "border-red-500" : ""}
              />
              {fieldErrors.firstName && (
                <p className="text-red-500 text-sm mt-1 ml-1">
                  {fieldErrors.firstName}
                </p>
              )}
            </div>
            <div className="flex-1">
              <Input
                type="text"
                id="last_name"
                label="Last Name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  clearFieldError("lastName");
                }}
                className={fieldErrors.lastName ? "border-red-500" : ""}
              />
              {fieldErrors.lastName && (
                <p className="text-red-500 text-sm mt-1 ml-1">
                  {fieldErrors.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <Input
              type="email"
              id="email"
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              className={fieldErrors.email ? "border-red-500" : ""}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              id="password"
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
              }}
              showPasswordToggle
              className={fieldErrors.password ? "border-red-500" : ""}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <AnimatedButton text="Sign Up" type="submit" fullWidth />
        </form>

        <div className="flex justify-between p-4 w-full">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="peer appearance-none h-7 w-7 rounded-full border border-neutral-400 checked:bg-[#00BAB8] checked:border-none focus:outline-none transition-colors duration-300 ease-in-out"
              />
              <span className="absolute text-white left-[7px] top-2 text-sm hidden peer-checked:inline ">
                <FaCheck />
              </span>
            </label>
            <p className="text-neutral-500">Remember Me</p>
          </div>

          <div className="flex items-center">
            <p className="text-[#00BAB8] font-bold">Forgot Password?</p>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex w-full items-center gap-4 text-neutral-300 p-4">
            <hr className="flex-1" />
            <p className="whitespace-nowrap">Or continue with</p>
            <hr className="flex-1" />
          </div>

          <div className="flex w-full justify-around items-center p-4">
            <img
              src={Google.src}
              alt="Google"
              className="w-14 h-14 cursor-pointer"
            />
            <img
              src={Facebook.src}
              alt="Facebook"
              className="w-14 h-14 cursor-pointer"
            />
            <img
              src={Apple.src}
              alt="Apple"
              className="w-12 h-14 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="flex w-full justify-center items-center gap-2">
        <p className="text-neutral-500 text-center">Already have an account?</p>
        <Link
          className="text-[#009689] underline font-bold text-lg cursor-pointer"
          href={"/login"}
        >
          <p>Login</p>
        </Link>
      </div>
    </div>
  );
}
