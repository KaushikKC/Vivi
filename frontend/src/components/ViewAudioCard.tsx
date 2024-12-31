"use client";

import Image from "next/image";
import React, { useState } from "react";
import avatar from "../images/avatar.png";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import AudioPlayer from "./AudioPlayer";

interface ViewAudioCardProps {
  audioUrl: string;
}
function ViewAudioCard({ audioUrl }: ViewAudioCardProps) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      if (isDisliked) {
        setDislikes(dislikes - 1);
        setIsDisliked(false);
      }
      setIsLiked(true);
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setDislikes(dislikes - 1);
      setIsDisliked(false);
    } else {
      setDislikes(dislikes + 1);
      if (isLiked) {
        setLikes(likes - 1);
        setIsLiked(false);
      }
      setIsDisliked(true);
    }
  };

  return (
    <section className="bg-gray-800 p-5 rounded-lg mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={avatar}
            alt=""
            className="w-10 h-10 bg-gray-700 rounded-full"
          />
          <div>
            <h3 className="text-[16px] font-semibold">Madhu Varsha</h3>
            <p className="text-sm text-gray-400">
              Posted on Monday, 28 December 2024
            </p>
          </div>
        </div>
      </div>
      <div className="my-3 flex justify-center w-fit">
        <div className="w-fit bg-gray-700/50 rounded-lg p-2">
          <AudioPlayer audioUrl={audioUrl} />
        </div>
      </div>
      {/* Attach Bounty */}
      <div className="relative p-3 border-2 rounded-xl w-auto border-[#7482F1] my-5">
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="flex items-center gap-1">
            <FaThumbsUp
              className={`h-5 w-5 ${
                isLiked ? "text-blue-500" : "text-gray-400"
              }`}
            />
            <span className="text-white">{likes}</span>
          </button>
          <button onClick={handleDislike} className="flex items-center gap-1">
            <FaThumbsDown
              className={`h-5 w-5 ${
                isDisliked ? "text-red-500" : "text-gray-400"
              }`}
            />
            <span className="text-white">{dislikes}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ViewAudioCard;
