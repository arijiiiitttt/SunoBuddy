import React from "react";
import {
  FaReact,
  FaCss3Alt,
  FaCode, // Added a generic code icon
} from "react-icons/fa";
import {
  SiJavascript, // Added Javascript Icon
  SiHtml5, // Added HTML5 Icon
  SiTailwindcss,
} from "react-icons/si";

export default function Frameworks() {
  return (
    <section
      id="tech"
      className=" text-center py-16 px-6"
    >
      <h3 className="text-3xl bowl mb-4">Technologies Used 👇🏻</h3>
      <p className="text-gray-800 max-w-2xl mx-auto mb-8">
        This Accessibility Tool for Visually Impaired Students is built using
        modern web technologies to provide a user-friendly and accessible
        experience.
      </p>
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-xl md:text-2xl text-gray-600"> 
        <div className="flex items-center gap-2 text-cyan-500">
          <FaReact className="text-3xl md:text-4xl" /> 
          React
        </div>
        <div className="flex items-center gap-2 text-yellow-500">
          <SiJavascript className="text-3xl md:text-4xl" /> 
          JavaScript
        </div>
        <div className="flex items-center gap-2 text-sky-500">
          <SiTailwindcss className="text-3xl md:text-4xl" /> 
          Tailwind CSS
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <FaCode className="text-3xl md:text-4xl" /> 
          AI Integration (Gemini API)
        </div>
      </div>
    </section>
  );
}
