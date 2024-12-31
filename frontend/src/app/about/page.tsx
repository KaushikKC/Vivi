"use client";
import React from "react";
import Image from "next/image";
import logo from "../../images/vivi1.png";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import avatar from "../../images/avatar.png";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";

const AboutUs: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#204660] to-[#5E3C8B] min-h-screen text-white font-rajdhani relative overflow-hidden">
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
      {/* Header */}
      <header className="flex justify-center items-center py-16 px-4 relative z-10">
        <Image
          src={logo}
          alt="Vivi Logo"
          className="h-32 w-32 rounded-full border-4 border-gradient-to-r from-[#9F62ED] via-[#FFFFFF] to-[#3AAEF8] shadow-xl"
        />
        <h1 className="text-7xl font-zenDots ml-8 bg-clip-text text-transparent bg-gradient-to-r from-[#9F62ED] via-[#FFFFFF] to-[#3AAEF8]">
          About Vivi
        </h1>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-5xl mx-auto relative z-10">
        {/* Introduction */}
        <section className="mb-16">
          <h2 className="text-5xl font-semibold mb-5 text-gradient">
            Who We Are
          </h2>
          <p className="text-xl leading-relaxed text-gray-200 tracking-wide">
            Vivi is a cutting-edge platform designed to revolutionize the way
            you interact with digital content. Our mission is to provide an
            immersive and seamless experience that integrates advanced
            technology with user-friendly design.
          </p>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-5xl font-semibold mb-6 text-gradient">
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl hover:scale-105 hover:rotate-3 transition-all duration-300 ease-in-out">
              <div className="text-4xl text-gradient mb-4">🚀</div>
              <h3 className="text-2xl font-semibold mb-3">Feature One</h3>
              <p className="text-lg">
                Experience unparalleled performance with our state-of-the-art
                technology that ensures fast and reliable service.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl hover:scale-105 hover:rotate-3 transition-all duration-300 ease-in-out">
              <div className="text-4xl text-gradient mb-4">💻</div>
              <h3 className="text-2xl font-semibold mb-3">Feature Two</h3>
              <p className="text-lg">
                Enjoy a user-friendly interface that makes navigation intuitive
                and enjoyable for all users.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl hover:scale-105 hover:rotate-3 transition-all duration-300 ease-in-out">
              <div className="text-4xl text-gradient mb-4">🔧</div>
              <h3 className="text-2xl font-semibold mb-3">Feature Three</h3>
              <p className="text-lg">
                Access a wide range of tools and resources that cater to your
                diverse needs and preferences.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-16">
          <h2 className="text-5xl font-semibold mb-5 text-gradient">
            Our Mission
          </h2>
          <p className="text-xl leading-relaxed text-gray-200 tracking-wide">
            At Vivi, we strive to innovate and lead in the digital space,
            constantly enhancing our platform to meet the evolving needs of our
            users. Our goal is to empower individuals and businesses by
            providing tools that drive success and growth.
          </p>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-5xl font-semibold mb-6 text-gradient">
            Join Us on Our Journey
          </h2>
          <p className="text-xl mb-6 text-gray-200 tracking-wide">
            Become a part of the Vivi community and experience the future of
            digital interaction today.
          </p>
          <button className="bg-gradient-to-r from-[#9F62ED] to-[#3AAEF8] text-white py-4 px-10 rounded-full text-2xl font-semibold transform hover:scale-110 hover:shadow-xl transition-all duration-300 ease-in-out">
            Get Started
          </button>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
