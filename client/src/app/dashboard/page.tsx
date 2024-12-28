// "use client";
// import React, { useState } from "react";
// import Navbar from "../components/Navbar";
// import Image from "next/image";
// import avatar from "../images/avatar.png";
// import { FaMicrophone } from "react-icons/fa";
// import { IoMdArrowDropdown, IoMdImages } from "react-icons/io";
// import { LuMessageSquareText } from "react-icons/lu";

// const Dashboard: React.FC = () => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [isAnonymous, setIsAnonymous] = useState(false);

//   return (
//     <div className="bg-gradient-to-br from-[#204660] to-[#5E3C8B] min-h-screen text-white font-rajdhani">
//       <header className="p-4 flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Home</h1>
//         <Navbar />
//         <div className=" flex items-center justify-center space-x-3 ">
//           <Image src={avatar} alt="avatar" className="h-10 w-10" />
//           <p className="border border-white rounded-full text-[18px] p-2">
//             0x1D...57k2
//           </p>
//         </div>
//       </header>

//       <main className="p-4 max-w-3xl mx-auto">
//         {/* Create a new Post */}
//         <section className="mb-6 bg-gray-800 p-4 rounded-lg">
//           {/* <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#9F62ED] via-[#FFFFFF] to-[#3AAEF8] mb-3">
//             Create a new Post
//           </h2> */}
//           <h2 className="text-2xl font-zenDots mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#9F62ED] via-[#FFFFFF] to-[#3AAEF8]">
//             Create a new Post
//           </h2>

//           <textarea
//             className="w-full bg-gray-700 text-white p-2 rounded-md mb-3 focus:outline-none focus:ring focus:ring-purple-500"
//             placeholder="What's on your mind?"
//             rows={3}
//           />
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="relative p-3 border-2 rounded-xl w-auto border-[#7482F1]">
//                 <div className="absolute -top-4 left-3 bg-gray-800 px-2 text-white font-semibold text-[18px]">
//                   Attach Bounty
//                 </div>
//                 <input
//                   type="text"
//                   className="bg-transparent text-white w-full focus:outline-none"
//                   placeholder="Enter bounty in ETH"
//                   defaultValue="0.005 ETH"
//                 />
//               </div>
//               {/* <button className="text-sm bg-purple-600 hover:bg-purple-700 py-1 px-3 rounded">
//                 Post as Audio
//               </button> */}
//               <div className="relative">
//                 <button
//                   onClick={() => setShowDropdown(!showDropdown)}
//                   className="text-sm bg-gray-800 p-3 rounded flex items-center gap-2 hover:bg-gray-700 transition-colors border border-white"
//                 >
//                   Post as Audio<IoMdArrowDropdown className="text-white" />
//                 </button>

//                 {/* Dropdown Options */}
//                 {showDropdown &&
//                   <div className="absolute top-full mt-2 bg-gray-800 rounded shadow-lg w-40 z-10">
//                     {/* Post as Audio Option */}
//                     <div
//                       className="flex items-center gap-2 py-2 px-3 hover:bg-gray-700 cursor-pointer transition-colors"
//                       onClick={() => {
//                         console.log("Post as Audio selected");
//                         setShowDropdown(false);
//                       }}
//                     >
//                       <FaMicrophone className="text-purple-400" />
//                       <span>Post as Audio</span>
//                     </div>

//                     {/* Post as Text Option */}
//                     <div
//                       className="flex items-center gap-2 py-2 px-3 hover:bg-gray-700 cursor-pointer transition-colors"
//                       onClick={() => {
//                         console.log("Post as Text selected");
//                         setShowDropdown(false);
//                       }}
//                     >
//                       <LuMessageSquareText className="text-green-400" />
//                       <span>Post as Text</span>
//                     </div>
//                   </div>}
//               </div>
//               <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
//                 <FaMicrophone className="h-11 w-11 text-white p-2" />
//               </div>
//               <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
//                 <IoMdImages className="h-11 w-11 text-white p-2" />
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <label
//                 className={`relative inline-block w-12 h-6 cursor-pointer ${isAnonymous
//                   ? "bg-blue-600"
//                   : "bg-gray-700"} rounded-full transition-colors`}
//               >
//                 <input
//                   type="checkbox"
//                   className="sr-only peer"
//                   checked={isAnonymous}
//                   onChange={() => setIsAnonymous(!isAnonymous)}
//                 />
//                 <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform transform peer-checked:translate-x-6" />
//               </label>
//               <span className="text-sm text-white">
//                 {isAnonymous ? "Post Anonymously" : "Post Publicly"}
//               </span>
//             </div>
//             <button className="text-sm border border-[#7482F1] group-hover:bg-gradient-to-r from-purple-500 to-blue-500 py-1 px-3 rounded">
//               Post
//             </button>
//           </div>
//         </section>

//         {/* Post */}
//         <section className="bg-gray-800 p-4 rounded-lg mb-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gray-700 rounded-full" />
//               <div>
//                 <h3 className="text-sm font-semibold">Madhu Varsha</h3>
//                 <p className="text-xs text-gray-400">
//                   Posted on Monday, 28 December 2024
//                 </p>
//               </div>
//             </div>
//             <button className="text-gray-400">×</button>
//           </div>
//           <div className="my-3">
//             <div className="bg-gray-700 p-3 rounded-md text-center text-sm">
//               🎙️ Audio Content
//             </div>
//           </div>
//           <div className="flex items-center justify-between text-gray-400">
//             <div className="flex items-center gap-4">
//               <button>👍</button>
//               <button>👎</button>
//               <button>💬</button>
//               <button>🔗</button>
//             </div>
//             <button className="text-sm underline">Know More</button>
//           </div>
//         </section>

//         <section className="bg-gray-800 p-4 rounded-lg mb-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gray-700 rounded-full" />
//               <div>
//                 <h3 className="text-sm font-semibold">Madhu Varsha</h3>
//                 <p className="text-xs text-gray-400">
//                   Posted on Monday, 28 December 2024
//                 </p>
//               </div>
//             </div>
//             <button className="text-gray-400">×</button>
//           </div>
//           <div className="my-3">
//             <p className="text-sm">
//               Lorem ipsum is simply dummy text of the printing and typesetting
//               industry. Lorem ipsum has been the industry&apos;s standard dummy
//               text ever since the 1500s.
//             </p>
//             <img
//               src="/example-image.jpg"
//               alt="Example"
//               className="mt-3 w-full rounded-md"
//             />
//           </div>
//           <div className="flex items-center justify-between text-gray-400">
//             <div className="flex items-center gap-4">
//               <button>👍</button>
//               <button>👎</button>
//               <button>💬</button>
//               <button>🔗</button>
//             </div>
//             <button className="text-sm underline">Know More</button>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;

"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Image from "next/image";
import avatar from "../images/avatar.png";
import { FaMicrophone } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdImages } from "react-icons/io";
import { LuMessageSquareText } from "react-icons/lu";

const Dashboard: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  return (
    <div className="bg-gradient-to-br from-[#204660] to-[#5E3C8B] min-h-screen text-white font-rajdhani">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Home</h1>
        <Navbar />
        <div className="flex items-center justify-center space-x-3">
          <Image src={avatar} alt="avatar" className="h-10 w-10" />
          <p className="border border-white rounded-full text-[18px] p-2">
            0x1D...57k2
          </p>
        </div>
      </header>

      <main className="p-4 max-w-3xl mx-auto">
        {/* Create a new Post */}
        <section className="mb-6 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-2xl font-zenDots mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#9F62ED] via-[#FFFFFF] to-[#3AAEF8]">
            Create a new Post
          </h2>

          <textarea
            className="w-full bg-gray-700 text-white p-2 rounded-md mb-3 focus:outline-none focus:ring focus:ring-purple-500"
            placeholder="What's on your mind?"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative p-3 border-2 rounded-xl w-auto border-[#7482F1]">
                <div className="absolute -top-4 left-3 bg-gray-800 px-2 text-white font-semibold text-[18px]">
                  Attach Bounty
                </div>
                <input
                  type="text"
                  className="bg-transparent text-white w-full focus:outline-none"
                  placeholder="Enter bounty in ETH"
                  defaultValue="0.005 ETH"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="text-sm bg-gray-800 p-3 rounded flex items-center gap-2 hover:bg-gray-700 transition-colors border border-white"
                >
                  Post as Audio
                  <IoMdArrowDropdown className="text-white" />
                </button>

                {/* Dropdown Options */}
                {showDropdown &&
                  <div className="absolute top-full mt-2 bg-gray-800 rounded shadow-lg w-40 z-10">
                    {/* Post as Audio Option */}
                    <div
                      className="flex items-center gap-2 py-2 px-3 hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => {
                        console.log("Post as Audio selected");
                        setShowDropdown(false);
                      }}
                    >
                      <FaMicrophone className="text-purple-400" />
                      <span>Post as Audio</span>
                    </div>

                    {/* Post as Text Option */}
                    <div
                      className="flex items-center gap-2 py-2 px-3 hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => {
                        console.log("Post as Text selected");
                        setShowDropdown(false);
                      }}
                    >
                      <LuMessageSquareText className="text-green-400" />
                      <span>Post as Text</span>
                    </div>
                  </div>}
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                <FaMicrophone className="h-11 w-11 text-white p-2" />
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                <IoMdImages className="h-11 w-11 text-white p-2" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label
                className={`relative inline-block w-12 h-6 cursor-pointer ${isAnonymous
                  ? "bg-blue-600"
                  : "bg-gray-700"} rounded-full transition-colors`}
              >
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                />
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform transform peer-checked:translate-x-6" />
              </label>
              <span className="text-sm text-white">
                {isAnonymous ? "Post Anonymously" : "Post Publicly"}
              </span>
            </div>
            <button className="text-sm border border-[#7482F1] group-hover:bg-gradient-to-r from-purple-500 to-blue-500 py-1 px-3 rounded">
              Post
            </button>
          </div>
        </section>

        {/* Post */}
        <section className="bg-gray-800 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full" />
              <div>
                <h3 className="text-sm font-semibold">Madhu Varsha</h3>
                <p className="text-xs text-gray-400">
                  Posted on Monday, 28 December 2024
                </p>
              </div>
            </div>
            <button className="text-gray-400">×</button>
          </div>
          <div className="my-3">
            <div className="bg-gray-700 p-3 rounded-md text-center text-sm">
              🎙️ Audio Content
            </div>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <div className="flex items-center gap-4">
              <button>👍</button>
              <button>👎</button>
              <button>💬</button>
              <button>🔗</button>
            </div>
            <button className="text-sm underline">Know More</button>
          </div>
        </section>

        <section className="bg-gray-800 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full" />
              <div>
                <h3 className="text-sm font-semibold">Madhu Varsha</h3>
                <p className="text-xs text-gray-400">
                  Posted on Monday, 28 December 2024
                </p>
              </div>
            </div>
            <button className="text-gray-400">×</button>
          </div>
          <div className="my-3">
            <p className="text-sm">
              Lorem ipsum is simply dummy text of the printing and typesetting
              industry. Lorem ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s.
            </p>
            <img
              src="/example-image.jpg"
              alt="Example"
              className="mt-3 w-full rounded-md"
            />
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <div className="flex items-center gap-4">
              <button>👍</button>
              <button>👎</button>
              <button>💬</button>
              <button>🔗</button>
            </div>
            <button className="text-sm underline">Know More</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
