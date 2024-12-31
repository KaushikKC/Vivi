"use client";

import React, { useState } from "react";
import avatar from "../images/avatar.png";
import Image from "next/image";
import AudioPlayer from "./AudioPlayer";

// Dummy data for comments (replace with actual data)
const comments = [
  {
    id: 1,
    username: "User1",
    avatar: avatar,
    comment: "Great job! I can do this task."
  },
  {
    id: 2,
    username: "User2",
    avatar: avatar,
    audioUrl: "/path/to/audio2.mp3"
  },
  {
    id: 3,
    username: "User3",
    avatar: avatar,
    comment: "I can complete this task easily."
  }
];

interface AwardPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onPayReward: (selectedUser: string) => void;
  bountyAmount: string; // The bounty amount passed as a prop
  totalResponses: number; // The total responses count passed as a prop
}

const AwardPopup: React.FC<AwardPopupProps> = ({
  isVisible,
  onClose,
  onPayReward,
  bountyAmount,
  totalResponses
}) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleCommentClick = (username: string) => {
    // Toggle the selection state for the comment
    setSelectedUser(username === selectedUser ? null : username);
  };

  const handlePayReward = () => {
    if (selectedUser) {
      onPayReward(selectedUser);
    } else {
      alert("Please select a user to pay the reward.");
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
              Total Responses: {totalResponses || 2}
            </p>
            <p className="text-sm text-gray-400">
              Bounty Amount:{" "}
              <span className="font-semibold">{bountyAmount || 0.05} ETH</span>
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-600 mt-6 pt-6">
          <div className="space-y-4">
            {comments.map(comment =>
              <div
                key={comment.id}
                className={`flex items-start space-x-3 p-3 rounded-xl cursor-pointer transition-colors duration-300 
                  ${selectedUser === comment.username
                    ? "bg-gray-600 border-2 border-[#9F62ED]"
                    : "hover:bg-gray-700"}`}
                onClick={() => handleCommentClick(comment.username)}
              >
                {/* Checkmark icon */}
                {selectedUser === comment.username &&
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
                  </div>}
                {/* Comment Content */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
                    <Image
                      src={comment.avatar}
                      alt={comment.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      {comment.username}
                    </h4>
                    {/* Conditionally render Audio Player or Comment */}
                    {comment.audioUrl
                      ? <AudioPlayer audioUrl={comment.audioUrl} />
                      : <p className="text-sm text-gray-200">
                          {comment.comment}
                        </p>}
                  </div>
                </div>
              </div>
            )}
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
