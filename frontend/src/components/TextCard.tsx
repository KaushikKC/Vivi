"use client";

import React, { useState } from "react";
import avatar from "../images/avatar.png";
import Image from "next/image";
import { IoMdShare } from "react-icons/io";
import { BiSolidCommentDetail } from "react-icons/bi";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import example from "../images/example.png";
import close from "../images/close.png";
import Link from "next/link";

const TextCard: React.FC = () => {
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
    <section className="bg-gray-800 p-5 rounded-lg mb-4 max-w-3xl">
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
        <Image src={close} alt="Close Icon" className="h-5 w-5" />
      </div>
      <div className="my-3">
        <p className="text-[17px]">
          Lorem ipsum is simply dummy text of the printing and typesetting
          industry. Lorem ipsum has been the industry&apos;s standard dummy text
          ever since the 1500s. Lorem ipsum is simply dummy text of the printing
          and typesetting industry. Lorem ipsum has been the industry&apos;s
          standard dummy text ever since the 1500s.
        </p>
        <Image
          src={example}
          alt="Example Content"
          className="mt-3 w-full rounded-md"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="flex items-center gap-1">
            <FaThumbsUp
              className={`h-5 w-5 ${isLiked
                ? "text-blue-500"
                : "text-gray-400"}`}
            />
            <span className="text-white">
              {likes}
            </span>
          </button>
          <button onClick={handleDislike} className="flex items-center gap-1">
            <FaThumbsDown
              className={`h-5 w-5 ${isDisliked
                ? "text-red-500"
                : "text-gray-400"}`}
            />
            <span className="text-white">
              {dislikes}
            </span>
          </button>
          <BiSolidCommentDetail className="h-5 w-5 text-gray-400" />
          <IoMdShare className="h-5 w-5 text-gray-400" />
        </div>
        <Link href="/details">
          <button className="text-[16px] border border-[#7482F1] bg-transparent py-1 px-3 rounded-xl h-fit transition duration-200">
            Know more
          </button>
        </Link>
      </div>
    </section>
  );
};

export default TextCard;
