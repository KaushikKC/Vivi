"use client";

import Image from "next/image";
import React from "react";
import avatar from "../images/avatar.png";
import AudioPlayer from "./AudioPlayer";

<<<<<<< HEAD:frontend/src/components/ClosedBountyAudioCard.tsx
function ClosedBountyAudioCard() {
=======
interface BountyAudioCardProps {
  audioUrl: string;
}

function BountyAudioCard({ audioUrl }: BountyAudioCardProps) {
>>>>>>> origin/main:frontend/src/components/BountyAudioCard.tsx
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

      {/* New Section: Rewarded User */}
      <div className="mt-4 bg-gray-700 p-3 rounded-lg">
        <p className="text-gray-400 text-sm font-medium ">Rewarded User:</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={avatar}
              alt=""
              className="w-10 h-10 bg-gray-700 rounded-full"
            />
            <div>
              <h3 className="text-[16px] font-semibold">John Doe</h3>
            </div>
          </div>
          <div className="bg-gray-600 px-3 py-1 rounded-lg">
            <p className="text-white font-semibold">0.05 ETH</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClosedBountyAudioCard;
