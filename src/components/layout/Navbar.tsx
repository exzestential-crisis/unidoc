"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaCalendar,
  FaRegCalendar,
  FaRegUser,
  FaStethoscope,
  FaUser,
} from "react-icons/fa";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoChatbubble, IoChatbubbleOutline } from "react-icons/io5";

export default function Navbar() {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Home",
      icon: GoHome,
      activeIcon: GoHomeFill,
      link: "/",
    },
    {
      name: "Appointments",
      icon: FaRegCalendar,
      activeIcon: FaCalendar,
      link: "/appointments",
    },
    {
      name: "Doctors",
      icon: FaStethoscope,
      activeIcon: FaStethoscope,
      link: "/doctors",
    },
    {
      name: "Messages",
      icon: IoChatbubbleOutline,
      activeIcon: IoChatbubble,
      link: "/messages",
    },
    {
      name: "Profile",
      icon: FaRegUser,
      activeIcon: FaUser,
      link: "/profile",
    },
  ];

  // Find the active tab index
  const activeIndex = tabs.findIndex((tab) => tab.link === pathname);

  // Calculate the position of the sliding background
  // Each tab takes up 1/5 of the width, so we need to position at the center of each tab
  const slidePosition =
    activeIndex !== -1 ? activeIndex * (100 / tabs.length) : 0;

  return (
    <div
      className="
    fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] 
    max-w-md h-16 
    bg-[#00bab8] z-50 
    rounded-full shadow-lg
    
    transition-colors duration-300 ease-in-out
    "
    >
      <div className="flex items-center justify-around h-full relative">
        {/* Sliding background indicator */}
        <div
          className="absolute top-1/2 w-12 h-12 bg-white rounded-full transition-all duration-300 ease-out"
          style={{
            left: `${slidePosition + 100 / tabs.length / 2}%`,
            transform: "translateY(-55%) translateX(-50%)",
            marginTop: "2px", // Slightly lower position
          }}
        />

        {tabs.map((tab, index) => (
          <NavTab
            key={index}
            icon={tab.icon}
            activeIcon={tab.activeIcon}
            name={tab.name}
            link={tab.link}
            isActive={pathname === tab.link}
          />
        ))}
      </div>
    </div>
  );
}

type NavTabType = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: string;
  link: string;
  isActive: boolean;
  className?: string;
};

const NavTab = ({
  name,
  icon: Icon,
  activeIcon: ActiveIcon,
  link,
  isActive,
  className,
}: NavTabType) => {
  return (
    <Link
      href={link}
      className={`flex flex-col items-center justify-center p-3 transition-colors duration-200 hover:bg-white/10 relative z-10 ${className}`}
      aria-label={name}
    >
      <div className="flex items-center justify-center">
        {isActive ? (
          <ActiveIcon className="text-[#00bab8] w-6 h-6" />
        ) : (
          <Icon className="text-white w-6 h-6" />
        )}
      </div>
    </Link>
  );
};
