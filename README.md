# 🏎️ PITWALL AI: Lead Race Engineer Chatbot

A high-stakes, tactical F1 strategy chatbot. You aren't talking to a generic AI—you're talking to the **Lead Race Engineer** orchestrating your race from the Pit Wall.

Built with **Next.js 15**, **Tailwind CSS**, and the **Vercel AI SDK** powered by **Google Gemini**.

## 🎨 The "Stitch" Design Matrix
This application implements the cyberpunk-professional **"Stitch"** UI/UX. It merges F1 strategy rooms with Bloomberg-style terminal telemetry.

### Key Features:
- **Telemetry Widget Dock**: A live, auto-updating F1 dashboard simulating Tire Integrity (radial gauges), G-Force Vectors, and Sector Timings.
- **Engineer Intercom UI**: Every message utilizes mono-spacing, system clock timestamps, and "Channel Onboard" signatures.
- **Cyberpunk Palette**: `Carbon Black (#0D0405)`, `Ferrari Red (#AE2C23)`, and `Telemetry Green (#B9D164)`.
- **Motion & Micro-interactions**: Smooth Framer Motion spring animations on message feeds and live data interpolation.

## 🛠️ Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 (+ Custom Keyframes)
- **AI Engine**: Vercel AI SDK wrapping `gemini-2.0-flash`.
- **UI Components**: Lucide-React & Framer Motion.
- **Custom React Hooks**: `useTelemetry` for live F1 data spoofing.

## 🚀 Getting Started

### 1. Requirements
- Node.js 20+
- Google Gemini API Key

### 2. Setup
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

### 4. Run Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to begin the formation lap.

## 🏁 How to test
Type commands as the driver:
- *"What's the gap to P1?"*
- *"Tires are graining on the front left."*
- *"Box, box. Changing to softs."*

---
*PitWall AI - Strategy in milliseconds.*
