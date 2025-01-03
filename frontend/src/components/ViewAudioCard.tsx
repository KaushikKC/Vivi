"use client";

import React, { useState } from "react";
import AudioPlayer from "./AudioPlayer";

interface ViewAudioCardProps {
  audioUrl: string;
}
function ViewAudioCard({ audioUrl }: ViewAudioCardProps) {
  const [showBountyModal, setShowBountyModal] = useState(false);
  const [bountyAmount, setBountyAmount] = useState("0.005");

  const handleAddBounty = () => {
    // Add your bounty logic here
    setShowBountyModal(false);
  };

  return (
    <>
      <section className="bg-gray-800 p-5 rounded-lg mt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Posted on Monday, 28 December 2024
          </p>
        </div>
        <div className="my-3 flex justify-center w-fit">
          <div className="w-fit bg-gray-700/50 rounded-lg p-2">
            <AudioPlayer audioUrl={audioUrl} />
          </div>
        </div>

        <button
          onClick={() => setShowBountyModal(true)}
          className="text-[16px] my-3 font-semibold border border-[#7482F1] bg-transparent hover:bg-gradient-to-r from-purple-500 to-blue-500 focus:bg-gradient-to-r focus:from-purple-500 focus:to-blue-500 py-1 px-3 rounded-xl h-fit transition duration-200 whitespace-nowrap "
        >
          Add Bounty
        </button>
      </section>
      {/* Bounty Modal */}
      {showBountyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl w-96">
            <h2 className="text-xl font-semibold text-white mb-4">
              Add Bounty
            </h2>
            <div className="relative p-3 border-2 rounded-xl w-auto border-[#7482F1] mb-4">
              <div className="absolute -top-4 left-3 bg-gray-800 px-2 text-white font-semibold text-[18px]">
                Enter Amount
              </div>
              <input
                type="text"
                className="bg-transparent text-white w-full focus:outline-none"
                placeholder="Enter bounty in ETH"
                value={bountyAmount}
                onChange={(e) => setBountyAmount(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowBountyModal(false)}
                className="px-4 py-2 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBounty}
                className="px-4 py-2 bg-[#7482F1] text-white rounded-lg hover:bg-[#5b6ad4] transition-colors"
              >
                Add Bounty
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewAudioCard;
