"use client";

import React, { useState } from "react";
import Image from "next/image";
import header from "../../images/header.png";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { useRouter } from "next/navigation";

const ProfileSetup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    lensId: "",
    profilePicture: null as File | null,
  });
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        profilePicture: e.target.files![0],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className="font-rajdhani">
      <div className="bg-gradient-to-br from-[#204660] to-[#5E3C8B] min-h-screen flex flex-col items-center text-white">
        <div className="absolute top-0 w-full flex justify-between items-center p-6">
          <header className="flex items-center space-x-2">
            <Image
              src={header}
              alt="Header Logo"
              width={180}
              height={90}
              className="h-30 w-60"
            />
          </header>
          <ConnectWalletButton />
        </div>

        <div className="mt-32 w-full max-w-md p-8 bg-black bg-opacity-40 backdrop-blur-md rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#9F62ED] via-[#FFFFFF] to-[#3AAEF8]">
            Complete Your Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-lg">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                className="w-full p-3 rounded-lg bg-white bg-opacity-10 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#9F62ED]"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-lg">Lens ID</label>
              <input
                type="text"
                value={formData.lensId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lensId: e.target.value }))
                }
                className="w-full p-3 rounded-lg bg-white bg-opacity-10 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#9F62ED]"
                placeholder="Enter your Lens ID"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-lg">Profile Picture</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-white hover:bg-opacity-5">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="text-sm text-gray-400">
                      Click to upload profile picture
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full p-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-[#9F62ED] to-[#3AAEF8] hover:opacity-90 transition-opacity"
            >
              Complete Setup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
