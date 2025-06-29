"use client";
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Fooder from '../Base/Fooder';
import FirstPg from '../Base/FirstPg';
import VideoPg from '../Base/VideoPg';
import FAQSection from '../Base/FAQSection';
import Features from '../Base/Features';
import Frameworks from '../Base/Frameworks';
import PatternWrapper from '../Base/PatternWrapper';


const LandingPg = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="bg-white w-full h-[7rem] flex items-center justify-center fixed top-0 z-50">
        <div className="flex items-center space-x-6">
          <img src="./logos/logooo.png" alt="Logo" className="w-18 h-18" />
          <ul className="hidden md:flex space-x-6 text-[1rem] font-medium">
            <li><a href="/underprocess" className="popblack underline-offset-4 font-semibold underline decoration-2 decoration-underline decoration-blue-500 hover:text-red-600 transition">Docs</a></li>
            <li><a href="/underprocess" className="text-gray-800 hover:text-red-600 transition">Features</a></li>
            <li><a href="/notfound" className="line-through underline-offset-8 decoration-red-500 font-bold hover:text-red-600 transition">Pricing</a></li>
            <li><a href="#" className="text-gray-800 hover:text-red-600 transition">About</a></li>
            <li><a href="#" className='popblack underline-offset-4 font-semibold underline decoration-2 decoration-wavy decoration-red-500'>Contact Me</a></li>
          </ul>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-2xl text-gray-800">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {isOpen && (
          <div className="absolute top-[7rem] left-0 w-full bg-white border-t border-gray-200 md:hidden z-40">
            <ul className="flex flex-col items-center py-6 space-y-4 text-[1rem] font-medium">
              <li><a href="/underprocess" className="popblack underline-offset-4 font-semibold underline decoration-2 decoration-blue-500 hover:text-red-600 transition">Docs</a></li>
              <li><a href="/underprocess" className="text-gray-800 hover:text-red-600 transition">Features</a></li>
              <li><a href="/notfound" className="line-through underline-offset-8 decoration-red-500 font-bold hover:text-red-600 transition">Pricing</a></li>
              <li><a href="#" className="text-gray-800 hover:text-red-600 transition">About</a></li>
              <li><a href="#cont" className="popblack underline-offset-4 font-semibold underline decoration-2 decoration-wavy decoration-red-500">Contact Me</a></li>
            </ul>
          </div>
        )}
      </header>

      {/* Apply Pattern ONLY to these sections */}
      <PatternWrapper>
        <FirstPg />
        <VideoPg />
        <Features />
        <FAQSection />
        <Frameworks />
      </PatternWrapper>

      {/* Footer WITHOUT pattern */}
      <div id='cont'>
<Fooder />
      </div>
      
    </>
  );
};

export default LandingPg;
