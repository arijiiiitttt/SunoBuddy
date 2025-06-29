import React from 'react';
import { FaFileAlt, FaSearch, FaHandshake, FaRocket, FaChartLine } from 'react-icons/fa'; // React Icons
import { MdLightbulbOutline } from 'react-icons/md'; // Material Design Icons

const SecondPg = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100/50 flex flex-col items-center justify-center px-8 py-16 text-center">
      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
        Your AI Career Journey Starts Here! 🚀
      </h1>

      <h2 className="text-lg font-medium text-gray-600 leading-relaxed max-w-3xl mb-8">
        As your AI Career Coach, I'm here to guide you through the exciting world of Artificial Intelligence.  Landing your dream AI role requires more than just technical skills; it's about <span className="font-semibold text-blue-600">strategic positioning</span> and <span className="font-semibold text-green-600">understanding the AI landscape</span>.  We'll work together to identify your <span className="font-semibold text-purple-600">unique strengths</span>, <span className="font-semibold text-orange-600">craft a compelling narrative</span> around your experience, and <span className="font-semibold text-red-600">navigate the job market with confidence</span>.  Whether you're a seasoned professional or just starting out, I'll help you <span className="font-semibold text-yellow-600">define your AI career goals</span>, <span className="font-semibold text-pink-600">develop a personalized roadmap</span>, and <span className="font-semibold text-teal-600">master the art of networking and interviewing</span>.  From <span className="font-semibold text-indigo-600">machine learning engineering</span> to <span className="font-semibold text-gray-600">data science leadership</span>, I'll provide the <span className="font-semibold text-lime-600">insights and support</span> you need to thrive.  Let's unlock your AI potential and build a <span className="font-semibold text-cyan-600">successful and fulfilling career</span> together!
      </h2>

      {/* Key Benefits - Icon List */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-8">
        <div className="flex flex-col items-center">
          <FaSearch className="text-4xl text-blue-500 mb-2" />
          <p className="text-sm text-gray-700 font-semibold">Discover AI Opportunities</p>
        </div>
        <div className="flex flex-col items-center">
          <FaHandshake className="text-4xl text-green-500 mb-2" />
          <p className="text-sm text-gray-700 font-semibold">Build Your AI Network</p>
        </div>
        <div className="flex flex-col items-center">
          <FaRocket className="text-4xl text-purple-500 mb-2" />
          <p className="text-sm text-gray-700 font-semibold">Accelerate Your AI Growth</p>
        </div>
        <div className="flex flex-col items-center">
          <FaChartLine className="text-4xl text-orange-500 mb-2" />
          <p className="text-sm text-gray-700 font-semibold">Track Your AI Progress</p>
        </div>
        <div className="flex flex-col items-center">
          <MdLightbulbOutline className="text-4xl text-yellow-500 mb-2" />
          <p className="text-sm text-gray-700 font-semibold">Gain AI Career Insights</p>
        </div>
      </div>

      {/* Call to Action (Optional) */}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mt-8 transition-colors duration-300">
        Schedule Your AI Career Consultation!
      </button>
    </div>
  );
};

export default SecondPg;
