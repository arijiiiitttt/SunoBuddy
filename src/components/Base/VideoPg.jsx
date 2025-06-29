"use client"
import React, { useState, useRef, useEffect } from "react";
import { PiPlayCircleFill } from "react-icons/pi";

const VideoPg = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="bg-gray-100/50 py-10">
    <div className="relative w-full max-w-4xl  mx-auto bg-gray-100/50">
    
      {/* Thumbnail */}
      <div
        onClick={() => setIsOpen(true)}
        className="relative cursor-pointer group"
      >
        <img
          src="https://startup-template-sage.vercel.app/hero-light.png"
          alt="Hero Video"
          className="rounded-lg w-full bg-gray-100/50 shadow-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition">
          <PiPlayCircleFill className="text-white text-7xl md:text-8xl" />
        </div>
      </div>

      {/* Video Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div
            ref={modalRef}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-3 text-black text-2xl font-bold z-10"
            >
              &times;
            </button>

            {/* Responsive Video */}
            <div className="relative w-full pt-[56.25%]">
              {isOpen && (
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-b-lg"
                  src="https://www.youtube.com/embed/qh3NGpYRG3I?autoplay=1"
                  title="YouTube Video"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default VideoPg;
