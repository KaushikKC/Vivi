"use client";

import Image from "next/image";
import React from "react";
import avatar from "../images/avatar.png";

interface ClosedBountyTextCardProps {
  content: string;
  timestamp: number;
  postId: number;
  bountyAmount: string;
  expiryDate?: string;
  responseCount?: number;
  creatorAddress?: string;
  creatorName?: string;
  rewardedAddress: string;
}

function ClosedBountyTextCard({
  content,
  timestamp,
  bountyAmount, // Default value
  responseCount = 0,
  rewardedAddress,
}: ClosedBountyTextCardProps) {
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <section className="bg-gray-800 p-5 rounded-lg mt-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Posted on {formatTimestamp(timestamp)}
        </p>
      </div>
      <div className="my-3">
        <p className="text-[17px]">{content}</p>
      </div>
      <div className="flex space-x-4">
        <div className="bg-gray-600 w-fit px-3 rounded-xl ">
          <p className="text-white">
            Amount: <span className="font-semibold">{bountyAmount} ETH</span>
          </p>
        </div>

        <div className="bg-gray-600 w-fit px-3 rounded-xl ">
          <p className="text-white">
            Responses: <span className="font-semibold">{responseCount}</span>
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
              <h3 className="text-[16px] font-semibold">
                {truncateAddress(rewardedAddress)}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClosedBountyTextCard;
