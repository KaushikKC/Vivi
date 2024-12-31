"use client";

import React, { useState } from "react";
import avatar from "../images/avatar.png";
import Image from "next/image";
import { FaReplyAll, FaThumbsDown, FaThumbsUp } from "react-icons/fa";

const CommentTextCard: React.FC = () => {
  const [likes, setLikes] = useState<number>(0);
  const [dislikes, setDislikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isDisliked, setIsDisliked] = useState<boolean>(false);

  const handleLike = (): void => {
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

  const handleDislike = (): void => {
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
    <section className="bg-gray-800 p-5 rounded-lg mt-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={avatar}
            alt="User Avatar"
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
      <div className="my-3">
        <p className="text-[17px]">
          Lorem ipsum is simply dummy text of the printing and typesetting
          industry.
        </p>
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
          <FaReplyAll className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </section>
  );
};

export default CommentTextCard;
