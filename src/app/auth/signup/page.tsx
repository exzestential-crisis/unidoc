"use client";

import { ArrowBack, ArrowForward } from "@/components/nav";
import { Facebook, Google } from "../../../../public";

export default function SignupPage() {
  return (
    <div className="min-h-[100dvh] bg-zinc-100 p-4">
      <ArrowBack size="extra-large" />

      <div className="flex flex-col p-4">
        <h2 className="font-bold text-4xl text-zinc-800 mb-30">Signup</h2>

        <div className="flex flex-col space-y-4 w-full">
          <div className="relative w-full">
            <input
              type="text"
              id="user"
              placeholder=" "
              className="peer w-full p-6 pt-8 text-xl text-black rounded-lg bg-white shadow shadow-zinc-200 placeholder-transparent focus:outline-none"
            />
            <label
              htmlFor="user"
              className="absolute left-6 top-6 text-xl text-zinc-400 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-focus:top-2 peer-focus:text-sm"
            >
              Username
            </label>
          </div>
          <div className="relative w-full">
            <input
              type="email"
              id="email"
              placeholder=" "
              className="peer w-full p-6 pt-8 text-xl text-black rounded-lg bg-white shadow shadow-zinc-200 placeholder-transparent focus:outline-none"
            />
            <label
              htmlFor="email"
              className="absolute left-6 top-6 text-xl text-zinc-400 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-focus:top-2 peer-focus:text-sm"
            >
              Email
            </label>
          </div>
          <div className="relative w-full">
            <input
              type="password"
              id="password"
              placeholder=" "
              className="peer w-full p-6 pt-8 text-xl text-black rounded-lg bg-white shadow shadow-zinc-200 placeholder-transparent focus:outline-none"
            />
            <label
              htmlFor="password"
              className="absolute left-6 top-6 text-xl text-zinc-400 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-xl peer-focus:top-2 peer-focus:text-sm"
            >
              Password
            </label>
          </div>
        </div>

        <div className="flex justify-end  items-center w-full ">
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
