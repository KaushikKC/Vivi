import React, { useState } from "react";

export const Navbar = () => {
  const [activeTab, setActiveTab] = useState("Home");

  const tabs = ["Home", "Posts", "Bounties", "Profile", "About Us"];

  return (
    <div className="mt-8 flex justify-center">
      <div className="flex space-x-4 bg-[#17151B] bg-opacity-50 backdrop-blur-md px-6 py-4 rounded-xl">
        {tabs.map(tab =>
          <p
            key={tab}
            className={`relative py-3 px-4 rounded-xl cursor-pointer text-white transition-transform duration-200 ${activeTab ===
            tab
              ? "bg-gradient-to-r from-purple-500 to-blue-500 scale-105"
              : "hover:bg-gray-700"}`}
            onClick={() => setActiveTab(tab)}
          >
            {activeTab === tab &&
              <span className="absolute inset-0 border border-purple-500 rounded-full animate-pulse" />}
            <span className="relative z-10">
              {tab}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};
