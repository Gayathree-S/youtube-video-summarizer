# 🎥 YouTube Video Summarizer

An AI-powered full-stack application that downloads YouTube videos, transcribes audio using **OpenAI Whisper**, and generates clean summaries and timestamp-based breakdowns using **HuggingFace DistilBART**.

---

## ✨ Features

- 🔗 Paste any YouTube URL
- 🎙️ Automatic speech-to-text via OpenAI Whisper
- 📝 Full transcript viewer with word count & copy button
- ✅ Clean paragraph summary via DistilBART NLP model
- 🕐 Timestamp-based summary every 60 seconds (`[MM:SS] text`)
- ⚡ Fast, modern Next.js 14 frontend
- 🌑 Dark-mode UI with responsive design
- 🔄 Graceful error handling & loading states

---

## 🏗️ Tech Stack

| Layer     | Technology                                |
|-----------|-------------------------------------------|
| Frontend  | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend   | Python 3.10+, FastAPI, Uvicorn            |
| Audio     | yt-dlp, ffmpeg                            |
| Transcription | OpenAI Whisper (`tiny` model by default) |
| Summarization | HuggingFace `sshleifer/distilbart-cnn-12-6` |

---

## 📁 Project Structure

```
youtube-summarizer/
│
├── backend/
│   ├── main.py                 # FastAPI app & /summarize endpoint
│   ├── downloader.py           # yt-dlp audio download logic
│   ├── transcriber.py          # OpenAI Whisper transcription
│   ├── summarizer.py           # HuggingFace text summarization
│   ├── timestamp_summarizer.py # Per-minute timestamp summaries
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Main page (full app UI)
│   │   ├── layout.tsx          # Root layout with fonts & metadata
│   │   ├── globals.css         # Tailwind + custom animations
│   │   └── api/
│   │       └── summarize/
│   │           └── route.ts    # Next.js API proxy → FastAPI
│   ├── components/
│   │   ├── UrlInput.tsx        # YouTube URL input + submit button
│   │   ├── SummaryBox.tsx      # Summary display panel
│   │   ├── TranscriptBox.tsx   # Full transcript panel
│   │   └── TimestampSummary.tsx # Timestamp list with [MM:SS] badges
│   ├── tailwind.config.js
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.local.example
│
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and npm/yarn
- **ffmpeg** installed on your system

#### Install ffmpeg

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html and add to PATH
```

---

### 🐍 Backend Setup

```bash
# 1. Navigate to backend
cd youtube-summarizer/backend

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be running at: **http://localhost:8000**

You can verify it with:
```bash
curl http://localhost:8000/health
# → {"status":"healthy"}
```

#### Optional: Change Whisper Model Size

Set the `WHISPER_MODEL` environment variable before starting:

```bash
# Available: tiny, base, small, medium, large
# tiny  = fastest, least accurate (~1GB RAM)
# base  = good balance (~1.5GB RAM)
# small = better accuracy (~3GB RAM)
WHISPER_MODEL=base uvicorn main:app --reload
```

---

### 🌐 Frontend Setup

```bash
# 1. Navigate to frontend
cd youtube-summarizer/frontend

# 2. Install Node dependencies
npm install

# 3. Set up environment
cp .env.local.example .env.local
# Edit .env.local if your backend runs on a different port/URL

# 4. Start the Next.js dev server
npm run dev
```

The frontend will be running at: **http://localhost:3000**

---

## 🚀 Usage

1. Open **http://localhost:3000**
2. Paste a YouTube video URL (e.g. `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
3. Click **Summarize Video**
4. Wait for processing (1–3 min depending on video length):
   - ⬇️ Downloading audio
   - 🎙️ Transcribing with Whisper
   - ✨ Generating summary
5. View results across three tabs:
   - **Summary** — clean paragraph summary
   - **Timestamps** — per-minute breakdown
   - **Transcript** — full raw transcript

---

## 🔌 API Reference

### `POST /summarize`

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "transcript": "Full transcribed text...",
  "summary": "Clean AI-generated summary paragraph...",
  "timestamps": [
    "[00:00] Introduction to the topic",
    "[01:00] Explanation of core concepts",
    "[02:00] Summary and conclusions"
  ]
}
```

**Error Response:**
```json
{
  "detail": "Failed to download audio: Video unavailable."
}
```

---

## 🧪 Error Handling

| Scenario | Behaviour |
|----------|-----------|
| Empty URL | Frontend validation error |
| Invalid URL | Frontend + backend 400 error |
| Video unavailable | Backend returns 500 with message |
| Whisper failure | Backend returns 500 with message |
| Timeout (>5min) | Next.js proxy returns 504 |
| Network failure | Frontend shows error message |

---

## 🚢 Deployment

### Backend — Railway / Render / EC2

```bash
# On your server:
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

For Railway/Render, add a `Procfile`:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend — Vercel

```bash
cd frontend
vercel deploy
```

Set environment variable in Vercel dashboard:
```
BACKEND_URL = https://your-backend.railway.app
```

---

## 🔮 Future Improvements

- [ ] Support for multiple languages (Whisper is multilingual)
- [ ] Chapter-aware summaries using YouTube chapters API
- [ ] PDF/Markdown export of transcript & summary
- [ ] User history with localStorage or database
- [ ] Streaming responses for real-time transcript display
- [ ] Support for audio-only URLs (podcasts, Spotify via yt-dlp)
- [ ] Docker Compose for one-command setup
- [ ] Authentication & rate limiting
- [ ] GPU acceleration for faster Whisper inference

---

## 📸 Screenshots

> _Add screenshots of the running app here._

---

## 📄 License

MIT License — free to use and modify.
Frontend UI for YouTube Summarizer
