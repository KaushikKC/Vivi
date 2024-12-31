"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Image from "next/image";
import avatar from "../../images/avatar.png";
import logo from "../../images/vivi1.png";
import Link from "next/link";
import BountyAudioCard from "@/components/BountyAudioCard";
import BountyTextCard from "@/components/BountyTextCard";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";

const Bounty: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<"closed" | "pending">(
    "pending"
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [audioUrl, setAudioUrl] = useState<string>("");

  return (
    <div className="bg-gradient-to-br from-[#204660] to-[#5E3C8B] min-h-screen text-white font-rajdhani">
      <div className="absolute flex justify-between w-full top-6">
        <div className=" left-0 flex items-center justify-start space-x-3 mr-5">
          <Link href="/">
            <Image
              src={logo}
              alt="logo"
              className="ml-10 h-16 w-16 rounded-full"
            />
          </Link>
        </div>
        <div className=" right-0 flex items-center justify-end space-x-3 mr-5">
          <Image src={avatar} alt="avatar" className="h-12 w-12" />
          <ConnectWalletButton />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Navbar />
      </div>

      <main className="p-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-zenDots mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#9F62ED] via-[#FFFFFF] to-[#3AAEF8]">
          Bounty Management
        </h2>
        <div className="flex space-x-4 items-center mb-4">
          <p>Choose Filters:</p>
          <button
            className={`text-[16px] font-semibold border border-[#7482F1] py-1 px-3 rounded-xl h-fit transition duration-200 whitespace-nowrap ${
              activeFilter === "closed"
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                : "bg-transparent hover:bg-gradient-to-r from-purple-500 to-blue-500"
            }`}
            onClick={() => setActiveFilter("closed")}
          >
            Closed Bounties
          </button>
          <button
            className={`text-[16px] font-semibold border border-[#7482F1] py-1 px-3 rounded-xl h-fit transition duration-200 whitespace-nowrap ${
              activeFilter === "pending"
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                : "bg-transparent hover:bg-gradient-to-r from-purple-500 to-blue-500"
            }`}
            onClick={() => setActiveFilter("pending")}
          >
            Pending Bounties
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Render cards conditionally based on active filter */}
          {activeFilter === "closed" && (
            <>
              <BountyAudioCard audioUrl={audioUrl} />
              <BountyTextCard />
            </>
          )}
          {activeFilter === "pending" && (
            <>
              <BountyAudioCard audioUrl={audioUrl} />
              <BountyTextCard />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Bounty;
