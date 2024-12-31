"use client";

import React, { useRef, useState } from "react";
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
import AudioPlayer from "../../components/AudioPlayer";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";

const Dashboard: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [postType, setPostType] = useState<"text" | "audio">("text");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRecordClick = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file.name);
    }
  };

  const handlePostTypeSelect = (type: "text" | "audio") => {
    setPostType(type);
    setShowDropdown(false);
  };

  return (
    <div className="bg-gradient-to-br from-[#204660] to-[#5E3C8B] min-h-screen text-white font-rajdhani">
      {/* Header */}
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

          {/* Main Section */}
          <main className="p-4 max-w-3xl mx-auto">
            {/* Create a New Post */}
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
                  className="w-full bg-gray-700 text-white p-2 rounded-md mb-3 focus:outline-none focus:ring"
                  placeholder="What's on your mind?"
                  rows={3}
                />
                <button className="text-[18px] font-semibold border border-[#7482F1] bg-transparent hover:bg-gradient-to-r from-purple-500 to-blue-500 focus:bg-gradient-to-r focus:from-purple-500 focus:to-blue-500 py-1 px-3 rounded-xl h-fit transition duration-200">
                  Post
                </button>
              </div>
              <div className="flex flex-col space-y-4">
                  <div className="flex items-center gap-4">
                      <div className="flex items-center gap-4">
    

                        {/* Post Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="text-[16px] bg-gray-800 p-3 rounded-xl flex items-center gap-2 transition-colors border border-[#7482F1]"
                          >
                            {postType === "audio" ? (
                              <>
                                <FaMicrophone className="text-purple-400" />
                                <span>Post as Audio</span>
                              </>
                            ) : (
                              <>
                                <LuMessageSquareText className="text-green-400" />
                                <span>Post as Text</span>
                              </>
                            )}
                            <IoMdArrowDropdown className="text-white" />
                          </button>
                          {showDropdown && (
                            <div className="absolute top-full mt-2 bg-gray-800 rounded shadow-lg w-40 z-10">
                              <div
                                className="flex items-center gap-2 py-2 px-3 hover:bg-gray-700 cursor-pointer transition-colors"
                                onClick={() => handlePostTypeSelect("audio")}
                              >
                                <FaMicrophone className="text-purple-400" />
                                <span>Post as Audio</span>
                              </div>
                              <div
                                className="flex items-center gap-2 py-2 px-3 hover:bg-gray-700 cursor-pointer transition-colors"
                                onClick={() => handlePostTypeSelect("text")}
                              >
                                <LuMessageSquareText className="text-green-400" />
                                <span>Post as Text</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Microphone Button */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`bg-gradient-to-r from-purple-500 to-blue-500 rounded-full cursor-pointer ${isRecording ? "opacity-70" : "hover:opacity-90"
                              }`}
                            onClick={handleRecordClick}
                          >
                            <FaMicrophone className="h-9 w-9 text-white p-2" />
                          </div>
                        </div>

                        {/* Attach Image */}
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full cursor-pointer"
                          onClick={handleImageClick}
                        >
                          <IoMdImages className="h-9 w-9 text-white p-2" />
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </div>
                        {selectedImage && (
                          <span className="text-sm text-gray-300 ml-[-10px]">
                            {selectedImage}
                          </span>
                        )}
                      </div>

                      {/* Anonymous Toggle */}
                      <div className="flex items-center gap-2">
                        <label
                          className={`relative inline-block w-12 h-6 cursor-pointer ${isAnonymous ? "bg-blue-600" : "bg-gray-700"
                            } rounded-full transition-colors`}
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
                          {isAnonymous ? "Go Incognito" : "Go Public"}
                        </span>
                      </div>
                    </div>
                    {isRecording && (
                      <span className="text-red-500 flex items-center gap-2 mt-2">
                        <span className="animate-pulse h-2 w-2 rounded-full bg-red-500"></span>
                        Recording...
                      </span>
                    )}
                    {audioUrl && (
                      <div className="w-full bg-gray-700/50 rounded-lg p-2">
                        <AudioPlayer audioUrl={audioUrl} />
                      </div>
                    )}
                  </div>
                 
              
                </section>

                {/* Posts */}
                <AudioCard audioUrl={audioUrl} />
                <TextCard />
              </main>
            </div>
            
            );
};

            export default Dashboard;
