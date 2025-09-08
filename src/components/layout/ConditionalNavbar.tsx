// app/components/ConditionalNavbar.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Exact routes where Navbar should NOT be displayed
  const hideExactRoutes = [
    "/signup",
    "/login",
    "/forgot-password",
    "/complete-profile",
    "/terms",
    "/privacy-policy",
    "/about",
    "/contact",
  ];

  // Route prefixes where Navbar should be hidden for ALL nested paths
  const hideRoutePrefixes = ["/doctor", "/appointments/", "/book"];

  const shouldHide =
    hideExactRoutes.includes(pathname) ||
    hideRoutePrefixes.some((prefix) => pathname.startsWith(prefix));

  if (shouldHide) return null;

  return <Navbar />;
}
