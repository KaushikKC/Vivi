import React from "react";
import Image from "next/image";
import header from "./images/header.png";
import image1 from "./images/voice-sign.png";
import audio from "./images/audio-design.png";
import ShufflingCards from "./components/ShufflingCards";
import Navbar from "./components/Navbar";
import VoiceEffect from "./components/VoiceEffect";

const App: React.FC = () => {
  return (
    <div className="font-rajdhani">
      <div className="bg-gradient-to-br from-[#204660] to-[#5E3C8B] min-h-screen flex flex-col items-center justify-center text-white">
        <header className="absolute top-6 left-6 flex items-center space-x-2">
          <Image
            src={header}
            alt="Header Logo"
            width={180}
            height={90}
            className="h-30 w-60"
          />
        </header>

        <button className="flex items-center justify-center bg-black bg-opacity-40 font-semibold backdrop-blur-md px-4 text-[20px] rounded-full my-10">
          <Image
            src={image1}
            alt="Voice Sign"
            width={80}
            height={80}
            className="h-20 w-20"
          />
          Join the Conversation
        </button>

        <main className="text-center font-zenDots flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#9F62ED] via-[#FFFFFF] to-[#3AAEF8]">
            Speak. Share. Earn.
          </h1>
          <p className="text-xl mb-8">Redefining Conversations with Voice.</p>

          <VoiceEffect />

          <Navbar />
        </main>

        <section className="mt-16 flex items-center justify-center space-x-10">
          <div className="flex flex-col items-center justify-center">
            <p className="text-5xl font-zenDots font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#9F62ED] via-[#FFFFFF] to-[#3AAEF8]">
              Why Choose Us?
            </p>
            <Image
              src={audio}
              alt="Audio Design"
              width={160}
              height={160}
              className="h-40 w-40"
            />
          </div>
          <ShufflingCards />
        </section>
      </div>
    </div>
  );
};

export default App;
