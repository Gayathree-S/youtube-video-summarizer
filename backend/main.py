 # type: ignore
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

from downloader import download_audio
from transcriber import transcribe_audio
from summarizer import summarize_text
from timestamp_summarizer import generate_timestamp_summary

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="YouTube Video Summarizer API",
    description="AI-powered YouTube video summarizer using Whisper + HuggingFace",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SummarizeRequest(BaseModel):
    url: str


class SummarizeResponse(BaseModel):
    transcript: str
    summary: str
    timestamps: list[str]


@app.get("/")
def root():
    return {"status": "ok", "message": "YouTube Summarizer API is running 🎥"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/summarize", response_model=SummarizeResponse)
async def summarize(request: SummarizeRequest):
    url = request.url.strip()

    if not url:
        raise HTTPException(status_code=400, detail="YouTube URL is required.")

    if "youtube.com" not in url and "youtu.be" not in url:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL. Please provide a valid YouTube link.")

    logger.info(f"Processing URL: {url}")

    # Step 1: Download audio
    logger.info("Step 1: Downloading audio...")
    try:
        audio_path = download_audio(url)
    except Exception as e:
        logger.error(f"Download failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to download audio: {str(e)}")

    # Step 2: Transcribe audio
    logger.info("Step 2: Transcribing audio with Whisper...")
    try:
        transcription_result = transcribe_audio(audio_path)
        transcript_text = transcription_result["text"]
        segments = transcription_result["segments"]
    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

    # Step 3: Generate summary
    logger.info("Step 3: Generating summary...")
    try:
        summary = summarize_text(transcript_text)
    except Exception as e:
        logger.error(f"Summarization failed: {e}")
        raise HTTPException(status_code=500, detail=f"Summary generation failed: {str(e)}")

    # Step 4: Generate timestamp summaries
    logger.info("Step 4: Generating timestamp summaries...")
    try:
        timestamps = generate_timestamp_summary(segments)
    except Exception as e:
        logger.warning(f"Timestamp generation failed (non-critical): {e}")
        timestamps = ["[00:00] Full transcript available above"]

    logger.info("✅ Processing complete!")
    return SummarizeResponse(
        transcript=transcript_text,
        summary=summary,
        timestamps=timestamps
    )