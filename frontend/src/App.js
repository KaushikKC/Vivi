import React from 'react';
import header from "./images/header.png"
import voice from "./images/voice-img.png"
import image1 from "./images/voice-sign.png"
import audio from "./images/audio-design.png"
import { Navbar } from './components/Navbar';
import ShufflingCards from './components/ShufflingCards';

const App = () => {
  return (
    <div className="bg-gradient-to-br from-[#204660] to-[#5E3C8B] min-h-screen flex flex-col items-center justify-center text-white font-rajdhani ">
    
      <header className="absolute top-6 left-6 flex items-center space-x-2">
        <img src={header} alt='' className='h-30 w-60' />
      </header>

      {/* Join Button */}
     
      <button className=" flex items-center justify-center bg-black bg-opacity-40 font-semibold backdrop-blur-md px-4 text-[20px] rounded-full my-10">
        <img src={image1} alt='' className='h-20 w-20' />
        Join the Conversation
      </button>
      {/* Main Content */}
      <main className="text-center font-zenDots flex flex-col items-center justify-center ">
      <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#9F62ED] via-[#FFFFFF] to-[#3AAEF8]">
          Speak. Share. Earn.
        </h1>
        <p className="text-xl mb-8">
          Redefining Conversations with Voice.
        </p>
     <div>
      <img src={voice} alt='' className='h-60 w-60' />
     </div>

        {/* Navigation */}
        <Navbar />
      </main>

      {/* Why Choose Us Section */}
      <section className="mt-16 flex items-center justify-center space-x-10">
      <div className='flex flex-col items-center justify-center'>
      <p className="text-5xl font-zenDots font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#9F62ED] via-[#FFFFFF] to-[#3AAEF8]">
      Why Choose Us?
      </p>
      <img src={audio} alt='' className='h-40 w-40' />
      </div>
        {/* <div className="mt-8 grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-black bg-opacity-40 h-[300px] w-[300px] rounded-lg p-4 flex flex-col items-center text-center"
            >
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.5 12.5L12 15.5l3.5-3"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mt-4">WiFi Router</h3>
              <p className="text-sm text-gray-300">TP Link Router</p>
              <p className="text-sm text-gray-400 mt-1">OFF</p>
            </div>
          ))}
        </div> */}
        <ShufflingCards />
      </section>
    </div>
  );
};

export default App;
