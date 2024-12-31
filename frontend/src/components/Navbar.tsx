"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
// import { useLensAuth } from "@/context/LensAuthContext";

const Navbar: React.FC = () => {
  // const { isAuthenticated, login, logout } = useLensAuth();
  const [activeTab, setActiveTab] = useState<string>("Home");
  const router = useRouter(); // Initialize the Next.js router

  const tabs: string[] = ["Home", "Posts", "Bounties", "Profile", "About Us"];

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "Home") {
      router.push("/dashboard"); // Navigate to /dashboard if Home is clicked
    } else if (tab === "Profile") {
      router.push("/profile"); // Navigate to /dashboard if Home is clicked
    } else if (tab === "Bounties") {
      router.push("/bounty"); // Navigate to /dashboard if Home is clicked
    }
  };

  return (
    <div className="mt-8 flex justify-center items-center font-rajdhani font-medium text-[20px]">
      <div className="flex space-x-5 bg-[#17151B] bg-opacity-50 backdrop-blur-md px-6 py-4 rounded-xl">
        {tabs.map((tab) => (
          <p
            key={tab}
            className={`relative py-2 px-4 rounded-full cursor-pointer text-white transition-all duration-300 transform ease-in-out ${
              activeTab === tab
                ? "bg-gradient-to-r from-purple-500 to-blue-500 scale-110 shadow-lg"
                : "hover:bg-gray-700 hover:scale-105 hover:shadow-md"
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {/* Tab text */}
            <span className="relative z-10">{tab}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
