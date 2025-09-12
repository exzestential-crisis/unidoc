"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use this for app router
import { ArrowBack } from "@/components/nav";
import Input from "@/components/ui/Input";
import { FaCheck } from "react-icons/fa";
import { Apple, Facebook, Google } from "../../../../public";
import Link from "next/link";
import { login } from "./actions";
import { AnimatedButton } from "@/components";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter(); // Correct router for app directory

  return (
    <div className="bg-neutral-100 shadow rounded min-h-[100dvh] p-4">
      <ArrowBack />

      <div className="flex flex-col items-center mb-6 px-8">
        <h1 className="text-4xl font-bold mb-2 text-[#009689] pt-10">Login</h1>
        <h2 className="text-neutral-400 font-bold">Welcome back to UniDoc!</h2>

        <form
          className="space-y-6 w-full max-w-md pt-10"
          onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const formData = new FormData(e.currentTarget);

            try {
              const result = await login(formData); // Single call

              if (result.error) {
                setError(result.error);
              } else {
                // Successful login - redirect
                router.push("/");
              }
            } catch (err) {
              console.error(err);
              setError("An unexpected error occurred");
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          <div>
            <Input
              type="email"
              id="email"
              name="email" // Add name attribute
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Input
              type="password"
              id="password"
              name="password" // Add name attribute
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPasswordToggle
            />
          </div>

          <AnimatedButton
            text={isLoading ? "Logging in..." : "Login"}
            type="submit"
            fullWidth
            disabled={isLoading}
          />
        </form>

        <div className="flex justify-between p-4 w-full">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer appearance-none h-7 w-7 rounded-full border border-neutral-400 checked:bg-[#00BAB8] checked:border-none focus:outline-none transition-colors duration-300 ease-in-out"
              />
              <span className="absolute text-white left-[7px] top-2 text-sm hidden peer-checked:inline ">
                <FaCheck />
              </span>
            </label>
            <p className="text-neutral-500">Remember Me</p>
          </div>

          <div className="flex items-center">
            <p className="text-[#00BAB8] font-bold cursor-pointer">
              Forgot Password?
            </p>
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
        <p className="text-neutral-500 text-center">Don't have an account?</p>
        <Link
          className="text-[#009689] underline font-bold text-lg cursor-pointer"
          href={"/register"}
        >
          <p>Sign Up</p>
        </Link>
      </div>
    </div>
  );
}
