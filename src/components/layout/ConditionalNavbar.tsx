// app/components/ConditionalNavbar.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // List of routes where Navbar should NOT be displayed
  const hideNavbarRoutes = [
    "/signup",
    "/login",
    "/forgot-password",
    "/complete-profile",
    "/terms",
    "/privacy-policy",
    "/about",
    "/contact",
  ];

  if (hideNavbarRoutes.includes(pathname)) return null;

  return <Navbar />;
}
