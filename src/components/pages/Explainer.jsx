import React, { useState, useRef, useEffect, useCallback } from 'react';


const Explainer = () => {
    // State variables
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [imageDescription, setImageDescription] = useState('');
    const [isExtractingText, setIsExtractingText] = useState(false); 
    const [isDescribingImage, setIsDescribingImage] = useState(false); 
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [message, setMessage] = useState('');
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [initialGreetingPlayed, setInitialGreetingPlayed] = useState(false);

    
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [speechRate, setSpeechRate] = useState(1); 
    const [speechPitch, setSpeechPitch] = useState(1); 

    // Readability controls
    const [textSize, setTextSize] = useState('base'); 
    const [highContrast, setHighContrast] = useState(false);

    
    const fileInputRef = useRef(null);
    
    const speechUtteranceRef = useRef(null);

    
    const showMessage = useCallback((msg, type = 'info') => {
        setMessage(msg);
        setShowMessageBox(true);
        setTimeout(() => {
            setShowMessageBox(false);
            setMessage('');
        }, 5000);
    }, []);

    useEffect(() => {
        const populateVoiceList = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            
            const femaleVoice = availableVoices.find(voice =>
                voice.name.includes('female') || voice.name.includes('Female') ||
                (voice.lang.startsWith('en') && !voice.name.includes('male'))
            );
            if (femaleVoice) {
                setSelectedVoice(femaleVoice);
            } else if (availableVoices.length > 0) {
                setSelectedVoice(availableVoices[0]); 
            }
        };

        
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = populateVoiceList;
        }
        populateVoiceList(); 

        const handleSpeechEnd = () => {
            setIsSpeaking(false);
        };

        return () => {
            if (speechUtteranceRef.current) {
                speechUtteranceRef.current.onend = null;
                speechUtteranceRef.current.onerror = null;
            }
            window.speechSynthesis.cancel(); 
            window.speechSynthesis.onvoiceschanged = null; 
        };
    }, []);

    
    useEffect(() => {
        if (selectedImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(selectedImage);
        } else {
            setImagePreviewUrl(null);
        }
    }, [selectedImage]);

    
    const handleImageFile = useCallback((file) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            setExtractedText('');
            setImageDescription(''); 
            if (isSpeaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
            }
        } else {
            setSelectedImage(null);
            setImagePreviewUrl(null);
            setExtractedText('');
            setImageDescription('');
            showMessage('Please select a valid image file (e.g., JPG, PNG).', 'error');
        }
    }, [isSpeaking, showMessage]);

    const handleFileInputChange = useCallback((event) => {
        handleImageFile(event.target.files[0]);
    }, [handleImageFile]);

    
    const handleChooseImageClick = useCallback(() => {
        if (!initialGreetingPlayed && window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance('Hello! I am your image-to-speech assistant. Please upload an image.');
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            utterance.onerror = (event) => {
                console.error('Initial greeting speech error:', event.error);
                setInitialGreetingPlayed(true);
            };
            utterance.onend = () => {
                setInitialGreetingPlayed(true);
            };
            window.speechSynthesis.speak(utterance);
        }
        fileInputRef.current.click();
    }, [initialGreetingPlayed, selectedVoice]);

    
    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy';
    }, []);

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            handleImageFile(event.dataTransfer.files[0]);
            event.dataTransfer.clearData();
        }
    }, [handleImageFile]);

    
    const getBase64 = useCallback((file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    }, []);


    const extractTextFromImage = useCallback(async () => {
        if (!selectedImage) {
            showMessage('Please select an image first.', 'info');
            return;
        }

        setIsExtractingText(true); 
        setExtractedText('');
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }

        try {
            const base64ImageData = await getBase64(selectedImage);
            const prompt = "Extract all readable text from this image.";

            const chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = {
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: prompt },
                            {
                                inlineData: {
                                    mimeType: selectedImage.type,
                                    data: base64ImageData
                                }
                            }
                        ]
                    }
                ],
            };

            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;


            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setExtractedText(text);
                showMessage('Text extracted successfully!', 'success');
            } else {
                setExtractedText('No text found or unable to extract text.');
                showMessage('No text found or unable to extract text.', 'info');
            }

        } catch (error) {
            console.error('Error extracting text:', error);
            setExtractedText('Error extracting text. Please try again.');
            showMessage(`Error: ${error.message}`, 'error');
        } finally {
            setIsExtractingText(false); 
        }
    }, [selectedImage, isSpeaking, getBase64, showMessage]);

    
    const describeImage = useCallback(async () => {
        if (!selectedImage) {
            showMessage('Please select an image to describe.', 'info');
            return;
        }

        setIsDescribingImage(true); 
        setImageDescription(''); 
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }

        try {
            const base64ImageData = await getBase64(selectedImage);
            const prompt = "Describe the visual content of this image in detail, focusing on key objects, actions, and context relevant for educational purposes. Be concise but informative.";

            const chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = {
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: prompt },
                            {
                                inlineData: {
                                    mimeType: selectedImage.type,
                                    data: base64ImageData
                                }
                            }
                        ]
                    }
                ],
            };

            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;


            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const description = result.candidates[0].content.parts[0].text;
                setImageDescription(description);
                showMessage('Image described successfully!', 'success');
            } else {
                setImageDescription('Unable to generate a description for this image.');
                showMessage('Unable to generate a description for this image.', 'info');
            }

        } catch (error) {
            console.error('Error describing image:', error);
            setImageDescription('Error describing image. Please try again.');
            showMessage(`Error: ${error.message}`, 'error');
        } finally {
            setIsDescribingImage(false); 
        }
    }, [selectedImage, isSpeaking, getBase64, showMessage]);


    const readTextAloud = useCallback((contentType) => {
        let textToSpeak = '';
        if (contentType === 'text') {
            textToSpeak = extractedText;
        } else if (contentType === 'description') {
            textToSpeak = imageDescription;
        }

        if (!textToSpeak) {
            showMessage(`No ${contentType} to read. Please extract or describe first.`, 'info');
            return;
        }

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        speechUtteranceRef.current = utterance;

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        utterance.rate = speechRate;
        utterance.pitch = speechPitch;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            setIsSpeaking(false);
            showMessage('Error during speech synthesis. Please try again.', 'error');
        };

        window.speechSynthesis.speak(utterance);
    }, [extractedText, imageDescription, isSpeaking, selectedVoice, speechRate, speechPitch, showMessage]);

    
    const clearAll = useCallback(() => {
        setSelectedImage(null);
        setImagePreviewUrl(null);
        setExtractedText('');
        setImageDescription('');
        setIsExtractingText(false);
        setIsDescribingImage(false);
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
        showMessage('All content cleared!', 'info');
    }, [isSpeaking, showMessage]);

    // Function to copy text to clipboard
    const copyToClipboard = useCallback((contentType) => {
        let textToCopy = '';
        if (contentType === 'text') {
            textToCopy = extractedText;
        } else if (contentType === 'description') {
            textToCopy = imageDescription;
        }

        if (!textToCopy) {
            showMessage(`No ${contentType} to copy.`, 'info');
            return;
        }
        
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showMessage(`${contentType === 'text' ? 'Extracted text' : 'Image description'} copied to clipboard!`, 'success');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            showMessage('Failed to copy text. Please try again manually.', 'error');
        } finally {
            document.body.removeChild(textarea);
        }
    }, [extractedText, imageDescription, showMessage]);

    const downloadText = useCallback((contentType) => {
        let textToDownload = '';
        let filename = '';

        if (contentType === 'text') {
            textToDownload = extractedText;
            filename = 'extracted_text.txt';
        } else if (contentType === 'description') {
            textToDownload = imageDescription;
            filename = 'image_description.txt';
        }

        if (!textToDownload) {
            showMessage(`No ${contentType} to download.`, 'info');
            return;
        }
        const blob = new Blob([textToDownload], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showMessage(`${contentType === 'text' ? 'Extracted text' : 'Image description'} downloaded successfully!`, 'success');
    }, [extractedText, imageDescription, showMessage]);

    const textSizeClass = {
        'sm': 'text-sm',
        'base': 'text-base',
        'lg': 'text-lg',
        'xl': 'text-xl',
        '2xl': 'text-2xl',
    }[textSize];

    // Determine contrast classes
    const contrastBgClass = highContrast ? 'bg-black text-white' : 'bg-gray-100 text-gray-800';
    const contrastBorderClass = highContrast ? 'border-white' : 'border-gray-300';



    const CustomButton = ({ onClick, disabled, children, primary = false, className = '' }) => {
        const baseClasses = `py-3 px-6 rounded-full font-bold text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center justify-center gap-2 border-2`;
        const primaryClasses = `bg-black text-white border-black hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-opacity-50`;
        const secondaryClasses = `bg-white text-gray-800 border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50`;
        const disabledClasses = `bg-gray-200 text-gray-500 cursor-not-allowed border-gray-200`;

        let buttonClasses = baseClasses;
        if (disabled) {
            buttonClasses += ` ${disabledClasses}`;
        } else {
            buttonClasses += ` ${primary ? primaryClasses : secondaryClasses}`;
        }

        return (
            <button
                onClick={onClick}
                disabled={disabled}
                className={`${buttonClasses} ${className}`}
            >
                {children}
            </button>
        );
    };

    return (
        <div
            className={`flex flex-col items-center min-h-screen font-inter transition-colors duration-300 ${highContrast ? 'bg-gray-900' : 'bg-white'}`}
            style={!highContrast ? {
                backgroundImage: 'radial-gradient(rgba(12, 12, 12, 0.171) 2px, transparent 0)',
                backgroundSize: '30px 30px',
                backgroundPosition: '-5px -5px',
            } : {}}
        >
            
            <header className={`w-full max-w-6xl flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8 ${highContrast ? 'text-white' : 'text-gray-800'}`}>
                
                <img
                    src="./logos/logooo.png" 
                    alt="Your App Logo"
                    className="md:h-24 h-9 w-auto object-contain" 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/36x36/aabbcc/ffffff?text=Logo'; }}
                />

            
                <div className="flex items-center gap-2 sm:gap-4"> 
                    <span className={`text-sm sm:text-lg font-semibold ${highContrast ? 'text-white' : 'text-gray-800'}`}>Light Mode</span>
                    <div className="relative w-[50px] h-[28px] sm:w-[60px] sm:h-[34px]"> 
                        <input
                            className="absolute left-[-99em]"
                            id="high-contrast-toggle"
                            type="checkbox"
                            checked={highContrast}
                            onChange={(e) => setHighContrast(e.target.checked)}
                            aria-label="Toggle high contrast mode"
                        />
                        <label
                            htmlFor="high-contrast-toggle"
                            className={`cursor-pointer inline-block relative w-full h-full rounded-full transition-colors duration-200 ease-in-out
                                ${highContrast ? 'bg-[#749dd6]' : 'bg-[#83d8ff]'}`}
                        >
                            <span
                                className={`inline-block relative z-10 top-[2px] left-[2px] w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow-md transition-all duration-400 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]
                                    ${highContrast ? 'bg-[#ffe5b5] translate-x-[20px] sm:translate-x-[26px] rotate-0' : 'bg-[#ffcf96] -rotate-45'}`} 
                            >
                                {/* Craters */}
                                <span className={`absolute bg-[#e8cda5] rounded-full transition-opacity duration-200 ease-in-out ${highContrast ? 'opacity-100' : 'opacity-0'}`} style={{ top: '10px', left: '5px', width: '2px', height: '2px' }}></span>
                                <span className={`absolute bg-[#e8cda5] rounded-full transition-opacity duration-200 ease-in-out ${highContrast ? 'opacity-100' : 'opacity-0'}`} style={{ top: '16px', left: '12px', width: '3px', height: '3px' }}></span>
                                <span className={`absolute bg-[#e8cda5] rounded-full transition-opacity duration-200 ease-in-out ${highContrast ? 'opacity-100' : 'opacity-0'}`} style={{ top: '6px', left: '15px', width: '4px', height: '4px' }}></span>
                            </span>
                            {/* Stars */}
                            <span className={`absolute bg-white rounded-full transition-all duration-300 ease-in-out ${highContrast ? 'opacity-0' : 'opacity-100'}`} style={{ top: '6px', left: '22px', width: '18px', height: '1.5px', zIndex: 0 }}></span>
                            <span className={`absolute bg-white rounded-full transition-all duration-300 ease-in-out ${highContrast ? 'opacity-0' : 'opacity-100'}`} style={{ top: '10px', left: '18px', width: '18px', height: '1.5px', zIndex: 1 }}></span>
                            <span className={`absolute bg-white rounded-full transition-all duration-300 ease-in-out ${highContrast ? 'opacity-0' : 'opacity-100'}`} style={{ top: '16px', left: '25px', width: '18px', height: '1.5px', zIndex: 0 }}></span>
                            <span className={`absolute bg-white rounded-full transition-all duration-300 ease-in-out ${highContrast ? 'opacity-100 translate-x-0 delay-200' : 'opacity-0 translate-x-[3px]'}`} style={{ top: '9px', left: '6px', width: '1px', height: '1px', zIndex: 0 }}></span>
                            <span className={`absolute bg-white rounded-full transition-all duration-300 ease-in-out ${highContrast ? 'opacity-100 translate-x-0 delay-300' : 'opacity-0 translate-x-[3px]'}`} style={{ top: '20px', left: '8px', width: '1.5px', height: '1.5px', zIndex: 0 }}></span>
                            <span className={`absolute bg-white rounded-full transition-all duration-300 ease-in-out ${highContrast ? 'opacity-100 translate-x-0 delay-400' : 'opacity-0 translate-x-[3px]'}`} style={{ top: '22px', left: '18px', width: '1px', height: '1px', zIndex: 0 }}></span>
                        </label>
                    </div>
                    <span className={`text-sm sm:text-lg font-semibold ${highContrast ? 'text-white' : 'text-gray-800'}`}>Dark Mode</span>
                </div>
            </header>

            <main className={`flex flex-col items-center w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20 space-y-10 ${highContrast ? 'text-white' : 'text-gray-800'}`}>
                <h1 className="text-lg bowl md:text-2xl lg:text-5xl font-extrabold text-center leading-tight">
                    Accessibility Tool for Visually Impaired Students
                </h1>

                
                <div
                    className={`w-full max-w-md mx-auto aspect-square rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 md:p-12 text-center cursor-pointer relative group transition-all duration-300
                    ${highContrast ? 'bg-gray-800 border-2 border-dashed border-white hover:bg-gray-700' : 'bg-white border-2 border-dashed border-gray-300 hover:border-gray-50 hover:bg-gray-50'}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleChooseImageClick}
                    role="button"
                    aria-label="Drag and drop an image or click to upload"
                    tabIndex="0"
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        ref={fileInputRef}
                        className="hidden"
                        aria-hidden="true"
                    />
                    {!imagePreviewUrl ? (
                        <>
                           
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-24 h-24 mb-4 transition-colors duration-300 ${highContrast ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                <g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier">
                                    <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                            </svg>
                            <p className={`text-lg font-medium transition-colors duration-300 ${highContrast ? 'text-white' : 'text-gray-700'}`}>Browse File to upload!</p>
                            <p className={`text-sm text-gray-500 mt-2 ${highContrast ? 'text-gray-300' : ''}`}>Drag & Drop an image here, or click to upload</p>
                        </>
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img
                                src={imagePreviewUrl}
                                alt="Image Preview"
                                className="max-w-full max-h-full object-contain rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105"
                            />
                            <button
                                onClick={(e) => { e.stopPropagation(); clearAll(); }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-md"
                                title="Remove Image"
                                aria-label="Remove selected image"
                            >
                                
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="w-4 h-4">
                                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L247.3 256 342.6 150.6z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <CustomButton
                        onClick={extractTextFromImage}
                        disabled={!selectedImage || isExtractingText || isDescribingImage}
                        primary={true}
                        aria-label={isExtractingText ? "Extracting text" : "Extract text from image"}
                    >
                        {isExtractingText ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Extracting Text...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="w-5 h-5">
                                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                                </svg>
                                Extract Text
                            </>
                        )}
                    </CustomButton>

                    <CustomButton
                        onClick={describeImage}
                        disabled={!selectedImage || isExtractingText || isDescribingImage}
                        primary={true}
                        aria-label={isDescribingImage ? "Describing image" : "Describe image content"}
                    >
                        {isDescribingImage ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Describing Image...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-5 h-5">
                                    <path d="M448 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM224 256c0 35.3-28.7 64-64 64s-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64zm96-96c0-17.7-14.3-32-32-32s-32 14.3-32 32V288c0 17.7 14.3 32 32 32s32-14.3 32-32V160zM400 160c0-17.7-14.3-32-32-32s-32 14.3-32 32V352c0 17.7 14.3 32 32 32s32-14.3 32-32V160z" />
                                </svg>
                                Describe Image
                            </>
                        )}
                    </CustomButton>

                    <CustomButton
                        onClick={() => readTextAloud('text')}
                        disabled={!extractedText || isSpeaking || isExtractingText || isDescribingImage}
                        aria-label={isSpeaking ? "Stop reading extracted text" : "Read extracted text aloud"}
                    >
                        {isSpeaking && extractedText ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="w-5 h-5">
                                    <path d="M0 96C0 60.7 28.7 32 64 32H320c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z" />
                                </svg>
                                Stop Text
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" className="w-5 h-5">
                                    <path d="M301.1 124.5c-24.6 5.2-46.1 16.2-64.3 31.8c-12.7 11.1-23.7 24.5-33.1 39.8L160 256H96c-17.7 0-32 14.3-32 32V416c0 17.7 14.3 32 32 32h64l41.2 41.2c19.3 19.3 45.1 29.8 72.3 29.8c66.4 0 120-53.6 120-120V256c0-66.4-53.6-120-120-120zM576 256c0-36.8-20.1-69.8-50.3-87.3c-13.4-7.8-29.1-11.7-45.2-11.7c-26.9 0-52.9 11.6-70.9 33.3c-2.3 2.8-4.6 5.6-6.8 8.5c-4.4 5.7-11.4 8.7-18.4 6.8s-12.8-8.6-12.8-16.3V128c0-17.7-14.3-32-32-32s-32 14.3-32 32v128c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V256z" />
                                </svg>
                                Read Text
                            </>
                        )}
                    </CustomButton>

                    <CustomButton
                        onClick={() => readTextAloud('description')}
                        disabled={!imageDescription || isSpeaking || isExtractingText || isDescribingImage}
                        aria-label={isSpeaking ? "Stop reading image description" : "Read image description aloud"}
                    >
                        {isSpeaking && imageDescription ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="w-5 h-5">
                                    <path d="M0 96C0 60.7 28.7 32 64 32H320c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z" />
                                </svg>
                                Stop Desc.
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" className="w-5 h-5">
                                    <path d="M301.1 124.5c-24.6 5.2-46.1 16.2-64.3 31.8c-12.7 11.1-23.7 24.5-33.1 39.8L160 256H96c-17.7 0-32 14.3-32 32V416c0 17.7 14.3 32 32 32h64l41.2 41.2c19.3 19.3 45.1 29.8 72.3 29.8c66.4 0 120-53.6 120-120V256c0-66.4-53.6-120-120-120zM576 256c0-36.8-20.1-69.8-50.3-87.3c-13.4-7.8-29.1-11.7-45.2-11.7c-26.9 0-52.9 11.6-70.9 33.3c-2.3 2.8-4.6 5.6-6.8 8.5c-4.4 5.7-11.4 8.7-18.4 6.8s-12.8-8.6-12.8-16.3V128c0-17.7-14.3-32-32-32s-32 14.3-32 32v128c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V256z" />
                                </svg>
                                Read Desc.
                            </>
                        )}
                    </CustomButton>

                    <CustomButton
                        onClick={() => copyToClipboard('text')}
                        disabled={!extractedText}
                        aria-label="Copy extracted text to clipboard"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-5 h-5">
                            <path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64c0-35.3 28.7-64 64-64h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H64c-3.5 0-6.7 1.4-9.1 3.9c-2.5 2.5-3.9 5.7-3.9 9.1V448c0 3.5 1.4 6.7 3.9 9.1c2.5 2.5 5.7 3.9 9.1 3.9H384c3.5 0 6.7-1.4 9.1-3.9c2.5-2.5 3.9-5.7 3.9-9.1V128h-48c-17.7 0-32-14.3-32-32V0zM240 96V32H128c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H384c17.7 0 32-14.3 32-32V128H288c-17.7 0-32-14.3-32-32z" />
                        </svg>
                        Copy Text
                    </CustomButton>

                    <CustomButton
                        onClick={() => copyToClipboard('description')}
                        disabled={!imageDescription}
                        aria-label="Copy image description to clipboard"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-5 h-5">
                            <path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64c0-35.3 28.7-64 64-64h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H64c-3.5 0-6.7 1.4-9.1 3.9c-2.5 2.5-3.9 5.7-3.9 9.1V448c0 3.5 1.4 6.7 3.9 9.1c2.5 2.5 5.7 3.9 9.1 3.9H384c3.5 0 6.7-1.4 9.1-3.9c2.5-2.5 3.9-5.7 3.9-9.1V128h-48c-17.7 0-32-14.3-32-32V0zM240 96V32H128c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H384c17.7 0 32-14.3 32-32V128H288c-17.7 0-32-14.3-32-32z" />
                        </svg>
                        Copy Desc.
                    </CustomButton>

                    <CustomButton
                        onClick={() => downloadText('text')}
                        disabled={!extractedText}
                        aria-label="Download extracted text as a file"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-5 h-5">
                            <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V384c0-35.3 28.7-64 64-64z" />
                        </svg>
                        Download Text
                    </CustomButton>

                    <CustomButton
                        onClick={() => downloadText('description')}
                        disabled={!imageDescription}
                        aria-label="Download image description as a file"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-5 h-5">
                            <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V384c0-35.3 28.7-64 64-64z" />
                        </svg>
                        Download Desc.
                    </CustomButton>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="voice-select" className="font-semibold">Voice:</label>
                        <select
                            id="voice-select"
                            value={selectedVoice ? selectedVoice.name : ''}
                            onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value))}
                            className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-300
                            ${highContrast ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-800'}`}
                            aria-label="Select speech voice"
                        >
                            {voices.map(voice => (
                                <option key={voice.name} value={voice.name}>
                                    {`${voice.name} (${voice.lang})`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="rate-slider" className="font-semibold">Speed: {speechRate.toFixed(1)}x</label>
                        <input
                            type="range"
                            id="rate-slider"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={speechRate}
                            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            aria-label={`Speech rate: ${speechRate.toFixed(1)}x`}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="pitch-slider" className="font-semibold">Pitch: {speechPitch.toFixed(1)}</label>
                        <input
                            type="range"
                            id="pitch-slider"
                            min="0"
                            max="2"
                            step="0.1"
                            value={speechPitch}
                            onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            aria-label={`Speech pitch: ${speechPitch.toFixed(1)}`}
                        />
                    </div>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="text-size-select" className="font-semibold">Text Size:</label>
                        <select
                            id="text-size-select"
                            value={textSize}
                            onChange={(e) => setTextSize(e.target.value)}
                            className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-300
                            ${highContrast ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-800'}`}
                            aria-label="Select text size"
                        >
                            <option value="sm">Small</option>
                            <option value="base">Medium</option>
                            <option value="lg">Large</option>
                            <option value="xl">Extra Large</option>
                            <option value="2xl">Huge</option>
                        </select>
                    </div>
            
                </div>

                <div className="w-full mt-6">
                    <h2 id="extracted-text-heading" className={`text-xl font-semibold mb-2 ${highContrast ? 'text-white' : 'text-gray-700'}`}>Extracted Text:</h2>
                    <div
                        className={`${contrastBgClass} ${contrastBorderClass} border rounded-xl p-4 min-h-[150px] max-h-[300px] overflow-y-auto whitespace-pre-wrap break-words ${textSizeClass} transition-colors duration-300`}
                        aria-labelledby="extracted-text-heading"
                        role="textbox"
                        tabIndex="0"
                    >
                        {extractedText || 'Text extracted from the image will appear here.'}
                    </div>
                </div>

                <div className="w-full mt-6">
                    <h2 id="image-description-heading" className={`text-xl font-semibold mb-2 ${highContrast ? 'text-white' : 'text-gray-700'}`}>Image Description:</h2>
                    <div
                        className={`${contrastBgClass} ${contrastBorderClass} border rounded-xl p-4 min-h-[150px] max-h-[300px] overflow-y-auto whitespace-pre-wrap break-words ${textSizeClass} transition-colors duration-300`}
                        aria-labelledby="image-description-heading"
                        role="textbox"
                        tabIndex="0"
                    >
                        {imageDescription || 'AI-generated description of the image will appear here.'}
                    </div>
                </div>

    
                <CustomButton
                    onClick={clearAll}
                    primary={true} 
                    aria-label="Clear all content and reset application"
                    className="bg-red-500 text-white border-red-500 hover:bg-red-600 focus:ring-red-500" 
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-5 h-5">
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.7C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                    </svg>
                    Clear All
                </CustomButton>
            </main>

            
            {showMessageBox && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="message-box-title">
                    <div className={`rounded-xl shadow-2xl p-8 max-w-sm w-full text-center space-y-4 transition-colors duration-300 ${highContrast ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}>
                        <p id="message-box-title" className="text-lg font-medium">{message}</p>
                        <button
                            onClick={() => setShowMessageBox(false)}
                            className="py-2 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                            aria-label="Close message"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Explainer;
