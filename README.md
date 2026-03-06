# Lumina AI: Professional Web Summarizer

**Primary Language:** Python (FastAPI Backend)

## Description
Lumina AI is a high-performance Chrome extension and Python-based server that provides real-time, professional-grade executive summaries of web content. It uses advanced Natural Language Processing via the Groq Llama-3 API to transform long articles into structured intelligence.

![Lumina AI Demo](demo_video.webp)

## Tech Stack
- **Python (FastAPI)**: Robust backend for high-speed API processing and streaming.
- **JavaScript (Extension)**: Lightweight Manifest V3 extension for seamless browser integration.
- **Groq AI**: State-of-the-art inference engine for instant summaries.
- **Vanilla CSS**: Premium dark-mode editor aesthetic.

## Features
- **Real-Time Streaming**: Watch summaries appear live as they are generated.
- **Executive Formatting**: Professional headers (Executive Summary, Key Highlights, Strategic Insight).
- **Fast Execution**: Powered by Groq's low-latency hardware.

## Repository Structure
- `backend/`: Python FastAPI source code.
- `extension/`: Chrome Extension assets and logic.

## Setup Instructions

### 1. Backend (Python)
1. Navigate to the `backend/` directory.
2. Install dependencies: `pip install -r requirements.txt`.
3. Create a `.env` file with `GROQ_API_KEY=your_key_here`.
4. Start the server: `python main.py`.

### 2. Extension
1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click "Load unpacked" and select the `extension/` folder.
