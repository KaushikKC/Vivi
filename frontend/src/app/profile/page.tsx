"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Image from "next/image";
import avatar from "../../images/avatar.png";
import logo from "../../images/vivi1.png";
import Link from "next/link";
import ViewAudioCard from "@/components/ViewAudioCard";
import ViewTextCard from "@/components/ViewTextCard";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";

const Profile: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#204660] to-[#5E3C8B] min-h-screen text-white font-rajdhani">
      <div className="absolute flex justify-between w-full top-6">
        <div className=" left-0 flex items-center justify-start space-x-3 mr-5">
          <Link href="/">
            <Image
              src={logo}
              alt="logo"
              className="ml-10 h-16 w-16 rounded-full"
            />
          </Link>
        </div>
        <div className=" right-0 flex items-center justify-end space-x-3 mr-5">
          <Image src={avatar} alt="avatar" className="h-12 w-12" />
          <ConnectWalletButton />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Navbar />
      </div>

      <main className="p-4 max-w-3xl mx-auto">
        {/* Create a new Post */}
        <section className="mb-6 bg-gray-800 p-5 rounded-lg">
          <div className="flex my-2 space-x-3">
            <Image
              src={avatar}
              alt=""
              className="border-2 border-white h-[100px] w-[100px] rounded-full"
            />
            <div>
              <p className="text-[24px] font-semibold">Madhu Varsha</p>
              <input
                type="text"
                className="bg-transparent text-white w-full focus:outline-none"
                placeholder="Write a description about yourself"
              />
            </div>
            <p className="cursor-pointer hover:underline">Edit</p>
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
          <ViewAudioCard />
          <ViewAudioCard />
          <ViewTextCard />
          <ViewTextCard />
        </div>
      </main>
    </div>
  );
};

export default Profile;
