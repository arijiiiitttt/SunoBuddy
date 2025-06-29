"use client";
import React, { useState } from 'react';

const faqs = [
  { question: "How does the app describe images?", answer: "The app uses AI (powered by the Gemini API) to generate detailed descriptions of the visual content in uploaded images, helping you understand diagrams, charts, and other non-textual materials." },
  { question: "Is my data private when using the AI image description?", answer: "We prioritize your privacy. While the image is processed by the AI, we do not store your images or the generated descriptions on our servers after the process is complete.  Data is used solely for generating the description and is not shared with third parties." },
  { question: "How do I adjust the speech settings?", answer: "You can customize the audio output by selecting your preferred language, voice, speech speed (rate), and pitch using the controls provided in the app." },
  { question: "How do I change the text size?", answer: "Use the text size dropdown menu to select from a range of sizes (Small, Medium, Large, Extra Large, Huge) to improve readability." },
  { question: "What is High Contrast Mode and how do I enable it?", answer: "High Contrast Mode provides a dark background with light text, which can improve readability for users with certain visual impairments.  You can toggle it on or off using the High Contrast Mode switch." },
  { question: "How do I navigate the app using a screen reader?", answer: "We've added ARIA labels, roles, and tabIndex attributes to ensure the app is compatible with screen readers. Use standard screen reader navigation commands to move between elements and access their descriptions." },
  { question: "How do I copy or download the extracted text or image description?", answer: "Use the 'Copy Text,' 'Copy Desc.,' 'Download Text,' and 'Download Desc.' buttons to copy the content to your clipboard or save it as a .txt file." },
  { question: "What if the AI image description isn't accurate?", answer: "While we strive for accuracy, AI-generated descriptions may not always be perfect.  If you encounter inaccuracies, please provide feedback so we can improve the app.  Consider using the 'Copy Desc.' button to copy the description and edit it as needed." },
  { question: "How do I clear the app and start over?", answer: "Click the 'Clear All' button to remove the selected image, extracted text, and description, and stop any ongoing speech." },
  { question: "What image formats are supported?", answer: "The app supports common image formats such as JPG, PNG, and GIF."}
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-10">
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 font-medium uppercase mb-2">Accessibility Tool FAQ</p>
        <h1 className="text-3xl sm:text-4xl bowl text-gray-900 mb-2">Your tool's Questions, Answered.</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Find answers to common questions about using our accessibility tool to understand images and text. We're here to help you learn!
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border">
            <button
              className="w-full text-left px-4 py-4 flex justify-between items-center text-gray-800 font-medium focus:outline-none"
              onClick={() => toggle(index)}
            >
              <span>{faq.question}</span>
              <span className="text-2xl font-light">{activeIndex === index ? '−' : '+'}</span>
            </button>
            {activeIndex === index && (
              <div className="px-4 pb-4 text-sm text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default FAQSection;
