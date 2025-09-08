// components/Header.tsx
import Link from "next/link";
import React from "react";
import { FaRegBell } from "react-icons/fa";
import { UnidocLogo } from "../../../public";

const Header = () => {
  return (
    <Link href="/" className="header flex justify-between items-center">
      <div className="flex items-center justify-start">
        <img
          src={UnidocLogo.src}
          alt="Logo"
          className="h-16 me-4 rounded-full"
        />
        <h2 className="text-[#525858] font-semibold text-2xl text-start">
          Whenever, Wherever
        </h2>
      </div>
      <div className="flex items-center">
        <FaRegBell className="text-4xl" />
      </div>
    </Link>
  );
};

export default Header;
