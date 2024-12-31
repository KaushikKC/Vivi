"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Image from "next/image";
import avatar from "../../images/avatar.png"; // Default avatar
import logo from "../../images/vivi1.png";
import Link from "next/link";
import ViewAudioCard from "@/components/ViewAudioCard";
import ViewTextCard from "@/components/ViewTextCard";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";

const Profile: React.FC = () => {
<<<<<<< HEAD
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Madhu Varsha");
  const [bio, setBio] = useState("Write a description about yourself");
  const [avatarUrl, setAvatarUrl] = useState(avatar); // Avatar image state

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save changes, you can connect this to a backend or local storage
  };

  // Handle avatar image selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUrl(URL.createObjectURL(file)); // Update avatar image
    }
  };

=======
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [audioUrl, setAudioUrl] = useState<string>("");
>>>>>>> origin/main
  return (
    <div className="bg-gradient-to-br from-[#204660] to-[#5E3C8B] min-h-screen text-white font-rajdhani">
      <div className="absolute flex justify-between w-full top-6">
        <div className="left-0 flex items-center justify-start space-x-3 mr-5">
          <Link href="/">
            <Image
              src={logo}
              alt="logo"
              className="ml-10 h-16 w-16 rounded-full"
            />
          </Link>
        </div>
<<<<<<< HEAD
        <div className="right-0 flex items-center justify-end space-x-3 mr-5">
          <Link href="/profile">
            <Image src={avatarUrl} alt="avatar" className="h-12 w-12" />
          </Link>
          <p className="border border-white rounded-full text-[18px] p-2 bg-clip-text text-transparent bg-gradient-to-r from-[#9F62ED] to-[#3AAEF8] font-semibold">
            0x1D3z.....k2d4
          </p>
=======
        <div className=" right-0 flex items-center justify-end space-x-3 mr-5">
          <Image src={avatar} alt="avatar" className="h-12 w-12" />
          <ConnectWalletButton />
>>>>>>> origin/main
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Navbar />
      </div>

      <main className="p-4 max-w-3xl mx-auto">
        {/* Create a new Post */}
        <section className="mb-6 bg-gray-800 p-5 rounded-lg">
          <div className="flex gap-5 items-center">
        <div className="relative">
  <Image
    src={avatarUrl}
    alt="avatar"
    className="border-2 border-white h-20 w-20 rounded-full object-cover"
  />
  {isEditing && (
    <input
      type="file"
      accept="image/*"
      onChange={handleAvatarChange}
      className="absolute bottom-0 right-0 opacity-0 cursor-pointer"
    />
  )}
</div>
          <div className="flex my-2 space-x-3">
            <div className="flex flex-col">
              <p className="text-[24px] font-semibold truncate">
                {isEditing
                  ? <input
                      type="text"
                      className="bg-transparent text-white w-full focus:outline-none"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  : name}
              </p>
              <div>
                {isEditing
                  ? <textarea
                      className="bg-transparent text-white w-full focus:outline-none"
                      placeholder="Write a description about yourself"
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                    />
                  : <p>{bio}</p>}
              </div>
              
            </div>
            
            <div className="flex justify-end w-full">
              {isEditing
                ? <button
                    className="border border-white bg-transparent text-white p-2 rounded-md h-fit"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                : <button
                    className="border border-white bg-transparent text-white p-2 rounded-md h-fit"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>}
            </div>
          </div>
          </div>
        </section>
        <div className="flex justify-between items-center">
          <div className="flex space-x-5 items-center">
            <h2 className="text-2xl font-zenDots mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#9F62ED] via-[#FFFFFF] to-[#3AAEF8]">
              My Posts
            </h2>
            <p>40 posts</p>
          </div>
          <p className="cursor-pointer hover:underline">See all</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ViewAudioCard audioUrl={audioUrl} />
          <ViewAudioCard audioUrl={audioUrl} />
          <ViewTextCard />
          <ViewTextCard />
        </div>
      </main>
    </div>
  );
};

export default Profile;
