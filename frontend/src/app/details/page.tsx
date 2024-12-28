"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Image from "next/image";
import avatar from "../../images/avatar.png";
import { FaMicrophone } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdImages } from "react-icons/io";
import { LuMessageSquareText } from "react-icons/lu";
import AudioCard from "../../components/AudioCard";
import logo from "../../images/vivi1.png";
import Link from "next/link";
import CommentAudioCard from "@/components/CommentAudioCard";
import CommentTextCard from "@/components/CommentTextCard";

const Details: React.FC = () => {
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
        {/* Post */}
        <AudioCard />

        <section className="mt-6 bg-gray-800 p-5 rounded-lg">
          <h2 className="text-2xl font-zenDots mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#9F62ED] via-[#FFFFFF] to-[#3AAEF8]">
            Comments
          </h2>
          <div className="flex items-start gap-3 my-2">
            <Image
              src={avatar}
              alt=""
              className="border-2 border-white h-12 w-12 rounded-full"
            />
            <div className="flex-1 flex gap-3">
              <textarea
                className="flex-1 bg-gray-700 text-white p-2 rounded-md focus:outline-none focus:ring"
                placeholder="Add your comments"
                rows={2}
              />
              <button className="text-[16px] font-semibold border border-[#7482F1] bg-transparent hover:bg-gradient-to-r from-purple-500 to-blue-500 focus:bg-gradient-to-r focus:from-purple-500 focus:to-blue-500 py-1 px-3 rounded-xl h-fit transition duration-200 whitespace-nowrap">
                Add Comment
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-4 ">
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
        <CommentAudioCard />
        <CommentTextCard />
      </main>
    </div>
  );
};

export default Details;
