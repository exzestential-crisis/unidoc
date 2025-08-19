/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        unidoc: {
          50: "#e6f6f5",
          100: "#c0e8e4",
          200: "#99d9d3",
          300: "#73cbc1",
          400: "#4dbdad",
          500: "#009689", // your main brand color
          600: "#007d70",
          700: "#006157",
          800: "#00443d",
          900: "#002724",
        },
      },
    },
  },
  safelist: [
    // All -50 background colors
    "bg-slate-50",
    "bg-gray-50",
    "bg-zinc-50",
    "bg-neutral-50",
    "bg-stone-50",
    "bg-red-50",
    "bg-orange-50",
    "bg-amber-50",
    "bg-yellow-50",
    "bg-lime-50",
    "bg-green-50",
    "bg-emerald-50",
    "bg-teal-50",
    "bg-cyan-50",
    "bg-sky-50",
    "bg-blue-50",
    "bg-indigo-50",
    "bg-violet-50",
    "bg-purple-50",
    "bg-fuchsia-50",
    "bg-pink-50",
    "bg-rose-50",
  ],
};
