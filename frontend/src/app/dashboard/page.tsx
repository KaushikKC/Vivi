"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Image from "next/image";
import avatar from "../../images/avatar.png";
import { FaMicrophone } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdImages } from "react-icons/io";
import { LuMessageSquareText } from "react-icons/lu";
import AudioCard from "../../components/AudioCard";
import TextCard from "../../components/TextCard";
import logo from "../../images/vivi1.png";
import Link from "next/link";
const Dashboard: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  return (
    <div className="bg-gradient-to-br from-[#204660] to-[#5E3C8B] min-h-screen text-white font-rajdhani">
      <div className="flex justify-between items-center">
        <Link href="/">
          <Image
            src={logo}
            alt="logo"
            className="ml-10 h-16 w-16 rounded-full"
          />
        </Link>
        <Navbar />
        <div className="flex items-center justify-center space-x-3 mr-5">
          <Image src={avatar} alt="avatar" className="h-12 w-12" />
          <p className="border border-white rounded-full text-[18px] p-2 bg-clip-text text-transparent bg-gradient-to-r from-[#9F62ED] to-[#3AAEF8] font-semibold">
            0x1D3z.....k2d4
          </p>
        </div>
      </div>

      <main className="p-4 max-w-3xl mx-auto">
        {/* Create a new Post */}
        <section className="mb-6 bg-gray-800 p-5 rounded-lg">
          <h2 className="text-3xl font-zenDots mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#9F62ED] via-[#FFFFFF] to-[#3AAEF8]">
            Create a new Post
          </h2>

          <div className="flex my-2 space-x-3">
            <Image
              src={avatar}
              alt=""
              className="border-2 border-white h-12 w-12 rounded-full"
            />
            <textarea
              className="w-full bg-gray-700 text-white p-2 rounded-md mb-3 focus:outline-none focus:ring "
              placeholder="What's on your mind?"
              rows={3}
            />
            <button className="text-[18px] font-semibold border border-[#7482F1] bg-transparent hover:bg-gradient-to-r from-purple-500 to-blue-500 focus:bg-gradient-to-r focus:from-purple-500 focus:to-blue-500 py-1 px-3 rounded-xl h-fit transition duration-200">
              Post
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative p-3 border-2 rounded-xl w-auto border-[#7482F1]">
                <div className="absolute -top-4 left-3 bg-gray-800 px-2 text-white font-semibold text-[18px]">
                  Attach Bounty
                </div>
                <input
                  type="text"
                  className="bg-transparent text-white w-full focus:outline-none"
                  placeholder="Enter bounty in ETH"
                  defaultValue="0.005 ETH"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="text-[16px] bg-gray-800 p-3 rounded-xl flex items-center gap-2  transition-colors border border-[#7482F1]"
                >
                  Post as Audio
                  <IoMdArrowDropdown className="text-white" />
                </button>

                {/* Dropdown Options */}
                {showDropdown &&
                  <div className="absolute top-full mt-2 bg-gray-800 rounded shadow-lg w-40 z-10">
                    {/* Post as Audio Option */}
                    <div
                      className="flex items-center gap-2 py-2 px-3 hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => {
                        console.log("Post as Audio selected");
                        setShowDropdown(false);
                      }}
                    >
                      <FaMicrophone className="text-purple-400" />
                      <span>Post as Audio</span>
                    </div>

                    {/* Post as Text Option */}
                    <div
                      className="flex items-center gap-2 py-2 px-3 hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => {
                        console.log("Post as Text selected");
                        setShowDropdown(false);
                      }}
                    >
                      <LuMessageSquareText className="text-green-400" />
                      <span>Post as Text</span>
                    </div>
                  </div>}
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                <FaMicrophone className="h-9 w-9 text-white p-2" />
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                <IoMdImages className="h-9 w-9 text-white p-2" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label
                className={`relative inline-block w-12 h-6 cursor-pointer ${isAnonymous
                  ? "bg-blue-600"
                  : "bg-gray-700"} rounded-full transition-colors`}
              >
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                />
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform transform peer-checked:translate-x-6" />
              </label>
              <span className="text-sm text-white">
                {isAnonymous ? "Post Anonymously" : "Post Publicly"}
              </span>
            </div>
          </div>
        </section>

        {/* Post */}
        <AudioCard />
        <TextCard />
      </main>
    </div>
  );
};

export default Dashboard;
