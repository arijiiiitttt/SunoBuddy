import React from "react";
import {
  FaGithub,
  FaLinkedin,
} from "react-icons/fa6";
import { IoMdGlobe } from "react-icons/io";


const Footer = () => {
  return (
    <footer className="relative bg-blue-100/50 text-gray-800">
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-10 lg:flex lg:justify-between">
        {/* Left Text */}
        <div className="lg:w-1/2  mb-12 lg:mb-0">
          <h1 className="text-4xl font-bold Brico leading-snug">
            Empowering <span className="text-[#808df4]">learning</span>
            <br />
            for visually <span className="text-[#f4ad62]">impaired</span> students
            <br />

          </h1>

          {/* Icons */}
          <div className="flex mt-6 space-x-5 text-[22px]">
      <a
        href="#" 
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#5865F2] cursor-pointer"
      >
        <IoMdGlobe />
      </a>
      <a
        href="https://github.com/arijiiiitttt/SunoBuddy"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-700 cursor-pointer"
      >
        <FaGithub />
      </a>
      <a
        href="*" 
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#0A66C2] cursor-pointer"
      >
        <FaLinkedin />
      </a>
    </div>
        </div>

        {/* Right Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-sm text-gray-800">
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">EXPLORE</h3>
            <ul className="space-y-2">
              <li>AI Image Descriptions</li>
              <li>Text Extraction (OCR)</li>
              <li>Customizable Speech</li>
              <li>High Contrast Mode</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">COMPANY</h3>
            <ul className="space-y-2">
              <li>About Us</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Accessibility Statement</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">SUPPORT</h3>
            <ul className="space-y-2">
              <li>Help Center</li>
              <li>FAQ</li>
              <li>Contact Us</li>
              <li>Report a Problem</li>
              <li>Suggest a Feature</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8">
        <hr className="border-t-2 border-gray-300 rounded-full opacity-70" />
      </div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row justify-between items-center text-sm text-gray-700">
        <span className="text-xl font-bold text-[#4044f4] mb-2 lg:mb-0"
          style={{ fontFamily: "Brico" }}>
          सुनोBuddy
        </span>
        <p className="text-center lg:text-right max-w-3xl">
          Made with
          <span className=" mx-1">💗 by</span>
          <a href="" target="_blank" className="text-blue-600 ">
            by Surbhi & Arijit
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
