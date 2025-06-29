import React from "react";

const features = [
    [
        {
            title: "AI-Powered Image Descriptions",
            desc: "Generates detailed descriptions of images using AI, making visual content accessible to visually impaired users.",
            icon: "🤖" 
        },
        {
            title: "Text Extraction (OCR)",
            desc: "Extracts text from images, allowing users to read and interact with text embedded in visual materials.",
            icon: "📄" 
        },
        {
            title: "Customizable Speech Settings",
            desc: "Adjust speech rate, pitch, language, and voice to personalize the audio output for optimal comprehension.",
            icon: "🔊" 
        },
    ],
    [
        {
            title: "Text Size Adjustment",
            desc: "Choose from a range of text sizes (Small to Huge) to improve readability based on individual visual needs.",
            icon: "📏" 
        },
        {
            title: "High Contrast Mode",
            desc: "Enable a high-contrast theme (dark background, light text) for enhanced visibility and reduced eye strain.",
            icon: "🌓" 
        },
        {
            title: "Copy and Download Content",
            desc: "Easily copy extracted text or image descriptions to the clipboard or download them as .txt files.",
            icon: "⬇️" 
        },
    ],
    [
        {
            title: "Screen Reader Compatibility",
            desc: "Designed with ARIA attributes for seamless navigation and interaction with screen readers.",
            icon: "🧑‍🦯" 
        },
        {
            title: "Clear All Functionality",
            desc: "Quickly reset the app by removing the image, extracted text, and description with a single click.",
            icon: "🗑️" 
        },
        {
            title: "Drag and Drop Image Upload",
            desc: "Intuitively upload images by dragging and dropping them onto the designated area.",
            icon: "📤"
        }
    ]
];

export default function Features() {
    return (
        <section id="features" className="min-h-screen py-4 px-6 pb-10 text-center flex items-center justify-center">
            <div className="container">
                <h3 className="text-3xl bowl mb-4">Key Features 😍</h3>
                <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
                    Empowering visually impaired students with accessible learning! Our app's features are designed to make educational materials more understandable. From AI-powered image descriptions to customizable speech settings, we've got you covered.
                </p>
                <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto px-9">
                    {features.flat().map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-left">
                            <div className="text-2xl w-12 h-12 flex items-center justify-center rounded-full bg-purple-200 shrink-0">
                                {f.icon}
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg">{f.title}</h4>
                                <p className="text-gray-500">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
