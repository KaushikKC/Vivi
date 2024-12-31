"use client";

import Image from "next/image";
import React, { useState } from "react";
import avatar from "../images/avatar.png";
import AudioPlayer from "./AudioPlayer";
import AwardPopup from "./AwardPopup"; // Import the AwardPopup component

function PendingBountyAudioCard() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Handle reward payment
  const handlePayReward = (selectedUser: string) => {
    alert(`Reward paid to ${selectedUser}`);
    // Implement logic for paying the reward to the selected user.
  };

  // Toggle popup visibility
  const togglePopup = () => setIsPopupVisible(!isPopupVisible);

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
          <AudioPlayer />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="bg-gray-600 w-fit px-3 rounded-xl ">
          <p className="text-white">
            Amount: <span className="font-semibold">0.05 ETH</span>
          </p>
        </div>
        <div className="bg-gray-600 w-fit px-3 rounded-xl ">
          <p className="text-white">
            Expires in: <span className="font-semibold">2 days</span>
          </p>
        </div>
        <div className="bg-gray-600 w-fit px-3 rounded-xl ">
          <p className="text-white">
            Responses: <span className="font-semibold">20</span>
          </p>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={togglePopup}
          className="text-[16px] mt-3 font-semibold border border-[#7482F1] bg-transparent hover:bg-gradient-to-r from-purple-500 to-blue-500 focus:bg-gradient-to-r focus:from-purple-500 focus:to-blue-500 py-1 px-3 rounded-xl h-fit transition duration-200 whitespace-nowrap"
        >
          Award Manually
        </button>
      </div>

      {/* Use the AwardPopup component */}
      <AwardPopup
        isVisible={isPopupVisible}
        onClose={togglePopup}
        onPayReward={handlePayReward}
        bountyAmount="0.05 ETH"
        totalResponses={20}
      />
    </section>
  );
}

export default PendingBountyAudioCard;
