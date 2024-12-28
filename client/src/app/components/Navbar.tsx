"use client";

import React, { useState } from "react";

const Navbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Home");

  const tabs: string[] = ["Home", "Posts", "Bounties", "Profile", "About Us"];

  return (
    <div className="mt-8 flex justify-center items-center font-rajdhani font-medium text-[20px]">
      <div className="flex space-x-5 bg-[#17151B] bg-opacity-50 backdrop-blur-md px-6 py-4 rounded-xl">
        {tabs.map(tab =>
          <p
            key={tab}
            className={`relative py-2 px-4 rounded-full cursor-pointer text-white transition-all duration-300 transform ease-in-out ${activeTab ===
            tab
              ? "bg-gradient-to-r from-purple-500 to-blue-500 scale-110 shadow-lg"
              : "hover:bg-gray-700 hover:scale-105 hover:shadow-md"}`}
            onClick={() => setActiveTab(tab)}
          >
            {/* Animated border effect for active tab */}
            {activeTab === tab &&
              <span className="absolute inset-0 rounded-full animate-pulse" />}

            {/* Tab text */}
            <span className="relative z-10">
              {tab}
            </span>

            {/* Add a subtle bounce animation to the active tab */}
            {activeTab === tab &&
              <div className="absolute inset-0 z-0 animate-bounce" />}
          </p>
        )}
      </div>
    </div>
  );
};

export default Navbar;
