"use client";

import React, { useState } from "react";
import avatar from "../images/avatar.png";
import Image from "next/image";
import AudioPlayer from "./AudioPlayer";
import { contractAddress } from "@/constants/contractAddress";
import { abi } from "@/constants/abi";
import { useAccount, useWriteContract } from "wagmi";
import axios from "axios";

interface Comment {
  _id: string;
  commentType: "TEXT" | "VOICE";
  content?: {
    text?: string;
    voice?: {
      data: string | Buffer;
      contentType: string;
    };
  };
  contentHash?: string;
  creatorAddress: string;
  isAnonymous: boolean;
  createdAt: string;
  likes?: number;
  dislikes?: number;
}

interface AwardPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onPayReward: (selectedUser: string) => void;
  bountyAmount: string; // The bounty amount passed as a prop
  totalResponses: number; // The total responses count passed as a prop
  comments: Comment | undefined;
  postId: number;
}

const AwardPopup: React.FC<AwardPopupProps> = ({
  isVisible,
  onClose,
  bountyAmount,
  totalResponses,
  comments,
  postId,
}) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isProcessing, setIsProcessing] = useState(false);
  const { writeContract } = useWriteContract();
  const { address } = useAccount();

  const handleCommentClick = (username: string) => {
    // Toggle the selection state for the comment
    setSelectedUser(username === selectedUser ? null : username);
  };

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Function to convert voice data to audio URL
  const getAudioUrl = (comment: Comment): string | undefined => {
    if (!comment.content?.voice?.data) return undefined;

    try {
      // Check if the data is already a string or needs conversion
      const base64String =
        typeof comment.content.voice.data === "object"
          ? Buffer.from(comment.content.voice.data).toString("base64")
          : comment.content.voice.data;

      // Create blob from base64
      const byteCharacters = Buffer.from(base64String, "base64").toString(
        "binary"
      );
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/wav" });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error creating audio URL:", error);
      return undefined; // Return undefined instead of null on error
    }
  };
  const handlePayReward = async () => {
    if (!selectedUser) {
      alert("Please select a user to pay the reward.");
      return;
    }

    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    setIsProcessing(true);
    try {
      // Call smart contract
      await writeContract(
        {
          address: contractAddress,
          abi: abi,
          functionName: "awardBounty",
          args: [BigInt(postId), selectedUser],
        },
        {
          onSuccess: async () => {
            try {
              // Call backend API to update bounty status
              const apiResponse = await axios.post(
                `https://vivi-backend.vercel.app/api/posts/${postId}/pay-bounty`,
                {
                  recipientAddress: selectedUser,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              if (apiResponse.data.status === "success") {
                onClose(); // Close the popup
                // You might want to add a success notification here
                // toast.success("Bounty paid successfully!");
              }
            } catch (error) {
              console.error("Error updating bounty status:", error);
              // toast.error("Failed to update bounty status");
            }
          },
          onError: (error) => {
            console.error("Transaction failed:", error);
            // toast.error("Transaction failed");
          },
        }
      );
    } catch (error) {
      console.error("Error paying bounty:", error);
      // toast.error("Failed to pay bounty");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg w-[600px] shadow-lg transform transition-all duration-300">
        {/* Top section displaying total responses and bounty */}
        <div className="flex items-center mb-6">
          <div className="text-white">
            <p className="text-lg font-semibold">
              Total Responses: {totalResponses}
            </p>
            <p className="text-sm text-gray-400">
              Bounty Amount:{" "}
              <span className="font-semibold">{bountyAmount} ETH</span>
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-600 mt-6 pt-6">
          <div className="space-y-4">
            {comments &&
              [comments].map((comment: Comment) => (
                <div
                  key={comment._id}
                  className={`flex items-start space-x-3 p-3 rounded-xl cursor-pointer transition-colors duration-300 
                  ${
                    selectedUser === comment.creatorAddress
                      ? "bg-gray-600 border-2 border-[#9F62ED]"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleCommentClick(comment.creatorAddress)}
                >
                  {/* Checkmark icon */}
                  {selectedUser === comment.creatorAddress && (
                    <div className="w-5 h-5 bg-[#9F62ED] rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="white"
                        className="w-3 h-3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 00-1.414 0L8 11.586 4.707 8.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  {/* Comment Content */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
                      <Image
                        src={avatar}
                        alt={comment.creatorAddress}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        {truncateAddress(comment.creatorAddress)}
                      </h4>
                      {/* Conditionally render Audio Player or Comment */}
                      {comment.commentType === "VOICE" ? (
                        <AudioPlayer
                          audioUrl={getAudioUrl(comment)}
                          key={comment._id}
                        />
                      ) : (
                        <p className="text-sm text-gray-200">
                          {comment?.content?.text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Buttons at the bottom */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={handlePayReward}
            className="bg-gradient-to-r from-[#9F62ED] to-[#3AAEF8] font-bold text-white px-6 py-3 rounded-lg shadow-md hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-[#9F62ED]"
          >
            Pay Reward
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white hover:font-bold px-6 py-3 rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AwardPopup;
