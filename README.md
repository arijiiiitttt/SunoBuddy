<p align="center">
  <img src="public/logos/logooo.png" alt="Accessibility Tool Logo" width="120" />
</p>

<h1 align="center"><strong>Accessibility Tool for Visually Impaired Students</strong></h1>

<p align="center"><em>Empowering learning through AI-powered image descriptions and text-to-speech tools.</em></p>

<p align="center">
  🏆 <strong><em>Built for the Built.IT Hackathon</em></strong>
</p>

---

## ✨ **Overview**

The **Accessibility Tool** is designed to assist *visually impaired students* in understanding visual educational materials. It uses **AI to describe images**, extracts embedded text, and **reads it aloud** using *customizable speech synthesis*. Built with accessibility, clarity, and user control in mind.

---

## 🚀 **Features**

### 🔍 **Core Functionality**

- 🧠 **AI-Powered Image Description**  
  *Uses the Gemini API to generate detailed descriptions of uploaded images, diagrams, or charts.*

- 📝 **OCR Text Extraction**  
  *Extracts text from images using Google Cloud Vision OCR for accurate reading support.*

### 🎧 **Audio & Interaction Control**

- 🔊 **Read Text / Description Separately**  
  *Selectively listen to either the extracted text or the AI-generated image description.*

- 📋 **Copy & 💾 Download Options**  
  *Copy or download each type of content separately as `.txt` files.*

- 🌐 **Voice & Language Selection**  
  *Choose from various speech synthesis voices and languages.*

- 🎚 **Speech Rate & Pitch Control**  
  *Adjust the speed and pitch of the spoken text using intuitive sliders.*

### ♿ **Accessibility-Focused Features**

- 🖼️ **Text Size Selector**  
  *Supports Small to Huge font sizes for enhanced readability.*

- 🌗 **High Contrast Mode**  
  *Dark theme for users with light sensitivity or impaired vision.*

- 🔁 **Clear All Function**  
  *Resets the app—clears image, stops audio, and resets text.*

- 🗃 **Drag & Drop Upload**  
  *Intuitive image upload via drag-and-drop functionality.*

- 📣 **Initial Voice Greeting**  
  *A friendly assistant voice greets the user when the app is first loaded.*

- ♿ **ARIA Support & Keyboard Navigation**  
  *All interactive elements are screen reader-friendly and keyboard-navigable.*

---

## 🛠️ **Tech Stack**

| **Technology**              | **Purpose**                             |
|-----------------------------|------------------------------------------|
| 🧩 **React + Vite**          | Frontend Framework                       |
| 🎨 **Tailwind CSS**          | Styling and Responsive UI                |
| 🧠 **Gemini API**            | AI-Powered Image Description             |
| 👁️ **Google Cloud Vision**   | Text Extraction from Images (OCR)        |
| 🔊 **Web Speech API**        | Text-to-Speech Audio Output              |
| ♿ **ARIA / HTML5**           | Accessibility and Semantic Support       |

---

## 📦 **Installation**

```bash
git clone https://github.com/yourusername/accessibility-tool.git
cd accessibility-tool
npm install
