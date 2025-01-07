"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import avatar from "../images/avatar.png";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { BiSolidCommentDetail } from "react-icons/bi";
import { IoMdShare } from "react-icons/io";
import close from "../images/close.png";
import Link from "next/link";
import AudioPlayer from "./AudioPlayer";
import axios from "axios";
import { contractAddress } from "@/constants/contractAddress";
import { abi } from "@/constants/abi";
import { useAccount, useWriteContract } from "wagmi";

interface AudioCardProps {
  _id: string;
  audioUrl: string | undefined;
  creatorAddress: string;
  timestamp: number;
  likes: string[];
  dislikes: string[];
  commentCount: number;
  postId: number;
  isProcessing?: boolean;
}

const AudioCard: React.FC<AudioCardProps> = ({
  _id,
  audioUrl,
  creatorAddress,
  timestamp,
  likes,
  dislikes,
  commentCount,
  postId,
  isProcessing
}) => {
  const [userData, setUserData] = useState<{
    name: string;
    profilePicture?: string;
  }>({
    name: "Anonymous"
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [likesCount, setLikesCount] = useState<number>(likes.length);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dislikesCount, setDislikesCount] = useState<number>(dislikes.length);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [isLiked, setIsLiked] = useState<boolean>(
    likes.includes(address || "")
  );
  const [isDisliked, setIsDisliked] = useState<boolean>(
    dislikes.includes(address || "")
  );

  useEffect(
    () => {
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `https://vivi-backend.vercel.app/api/users/profile/${creatorAddress}`
          );
          const data = await response.json();
          if (data) {
            setUserData({
              name: data.name || "Anonymous",
              profilePicture: data.profilePicture
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      if (creatorAddress) {
        fetchUserData();
      }
    },
    [creatorAddress]
  );

  useEffect(
    () => {
      // Check if user has already liked/disliked
      if (address) {
        setIsLiked(likes.includes(address));
        setIsDisliked(dislikes.includes(address));
      }
    },
    [address, likes, dislikes]
  );

  useEffect(
    () => {
      if (address) {
        const storedReaction = localStorage.getItem(
          `reaction-${_id}-${address}`
        );
        if (storedReaction) {
          const {
            isLiked: storedLiked,
            isDisliked: storedDisliked
          } = JSON.parse(storedReaction);
          setIsLiked(storedLiked);
          setIsDisliked(storedDisliked);
        }
      }
    },
    [_id, address]
  );

  const fetchCurrentReactions = async () => {
    try {
      const response = await axios.get(
        `https://vivi-backend.vercel.app/api/comments/${_id}/reactions?isPost=${"true"}`
      );
      if (response.data.status === "success") {
        setLikesCount(response.data.likes);
        setDislikesCount(response.data.dislikes);
      }
    } catch (error) {
      console.error("Error fetching reactions:", error);
    }
  };

  useEffect(
    () => {
      fetchCurrentReactions();
      const interval = setInterval(fetchCurrentReactions, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    },
    [_id]
  );

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const handleReaction = async (type: "like" | "dislike") => {
    if (!address) {
      alert("Please connect your wallet");
      return;
    }

    try {
      // Call smart contract
      writeContract({
        address: contractAddress,
        abi: abi,
        functionName: type === "like" ? "likePost" : "dislikePost",
        args: [BigInt(postId)]
      });

      // Call backend API
      const response = await axios.post(
        `https://vivi-backend.vercel.app/api/comments/${_id}/reaction`,
        {
          type,
          isPost: true,
          creatorAddress: address
        },
        {
          headers: {
            Authorization: `Bearer ${address}`
          }
        }
      );

      if (response.data.status === "success") {
        setLikesCount(response.data.likes);
        setDislikesCount(response.data.dislikes);

        if (type === "like") {
          setLikesCount(prev => prev + (isLiked ? -1 : 1));
          setIsLiked(!isLiked);
          if (isDisliked) {
            setDislikesCount(prev => prev - 1);
            setIsDisliked(false);
          }
        } else {
          setDislikesCount(prev => prev + (isDisliked ? -1 : 1));
          setIsDisliked(!isDisliked);
          if (isLiked) {
            setLikesCount(prev => prev - 1);
            setIsLiked(false);
          }
        }

        // Store reaction state in localStorage
        localStorage.setItem(
          `reaction-${_id}-${address}`,
          JSON.stringify({
            isLiked: type === "like" ? !isLiked : false,
            isDisliked: type === "dislike" ? !isDisliked : false,
            timestamp: Date.now()
          })
        );
      }
    } catch (error) {
      console.error(`Error ${type}ing post:`, error);
      alert(`Failed to ${type} post. Please try again.`);
    }
  };

  const handleLike = () => handleReaction("like");
  const handleDislike = () => handleReaction("dislike");

  return (
    <Link href={`/details/${postId}`}>
      <section
        className="bg-gray-800 p-5 rounded-lg mb-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
        style={{
          boxShadow: "2px 4px 6px rgba(163, 187, 212, 0.3)" /* Blue shadow */
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={userData.profilePicture || avatar}
              alt="User avatar"
              width={40}
              height={40}
              className="w-10 h-10 bg-gray-700 rounded-full object-cover border-2 border-gray-600 shadow-sm hover:shadow-md transition-transform duration-300 hover:scale-105"
            />
            <div>
              <h3 className="text-[16px] font-semibold text-white">
                {isLoading ? "Loading..." : userData.name}
              </h3>
              <p className="text-sm text-gray-400 shadow-text">
                Posted on {formatDate(timestamp)}
              </p>
            </div>
          </div>
          <Image
            src={close}
            alt="Close icon"
            className="h-5 w-5 cursor-pointer shadow-sm hover:shadow-md transition-transform duration-200 hover:rotate-90 hover:scale-110"
          />
        </div>
        <div className="my-3">
          {isProcessing
            ? <div className="flex items-center justify-center p-4">
                <div className="animate-pulse text-gray-400">
                  Processing audio...
                </div>
              </div>
            : <AudioPlayer audioUrl={audioUrl} />}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 transition-colors duration-200 hover:text-blue-500"
            >
              <FaThumbsUp
                className={`h-5 w-5 ${isLiked
                  ? "text-blue-500"
                  : "text-gray-400"} shadow-sm hover:shadow-md transition-transform duration-200 hover:scale-110`}
              />
              <span className="text-white">
                {likesCount}
              </span>
            </button>
            <button
              onClick={handleDislike}
              className="flex items-center gap-1 transition-colors duration-200 hover:text-red-500"
            >
              <FaThumbsDown
                className={`h-5 w-5 ${isDisliked
                  ? "text-red-500"
                  : "text-gray-400"} shadow-sm hover:shadow-md transition-transform duration-200 hover:scale-110`}
              />
              <span className="text-white">
                {dislikesCount}
              </span>
            </button>
            <div className="flex items-center gap-1">
              <BiSolidCommentDetail className="h-5 w-5 text-gray-400 shadow-sm hover:shadow-md transition-transform duration-200 hover:scale-110 hover:text-gray-300" />
              <span className="text-white">
                {commentCount}
              </span>
            </div>
            <IoMdShare className="h-5 w-5 text-gray-400 shadow-sm hover:shadow-md cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-gray-300" />
          </div>
          <Link href={`/details/${postId}`}>
            <button className="text-[16px] border border-[#7482F1] text-[#7482F1] bg-transparent py-1 px-3 rounded-xl h-fit shadow-sm hover:shadow-md transition-all duration-300 hover:bg-[#7482F1] hover:text-white">
              Know more
            </button>
          </Link>
        </div>
      </section>
    </Link>
  );
};

export default AudioCard;
