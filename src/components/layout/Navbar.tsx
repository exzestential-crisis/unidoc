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

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md h-16 bg-[#295458] z-50 rounded-full shadow-lg">
      <div className="flex items-center justify-around h-full">
        {tabs.map((tab, index) => (
          <NavTab
            key={index}
            icon={tab.icon}
            activeIcon={tab.activeIcon}
            name={tab.name}
            link={tab.link}
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
  className?: string;
};

const NavTab = ({
  name,
  icon: Icon,
  activeIcon: ActiveIcon,
  link,
  className,
}: NavTabType) => {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <Link
      href={link}
      className={`flex flex-col items-center justify-center p-3 transition-colors duration-200 hover:bg-white/10 ${className} ${
        isActive ? "bg-white rounded-full" : ""
      }`}
      aria-label={name}
    >
      <div className="flex items-center justify-center">
        {isActive ? (
          <ActiveIcon className="text-[#295458] w-6 h-6" />
        ) : (
          <Icon className="text-white/60 w-6 h-6" />
        )}
      </div>
    </Link>
  );
};
