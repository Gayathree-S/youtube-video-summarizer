import os
import logging
import whisper  # type: ignore

logger = logging.getLogger(__name__)

# Cache the model globally so it's only loaded once per server start
_model = None
MODEL_SIZE = os.getenv("WHISPER_MODEL", "tiny")  # Options: tiny, base, small, medium, large


def _load_model():
    global _model
    if _model is None:
        logger.info(f"Loading Whisper model: '{MODEL_SIZE}'...")
        _model = whisper.load_model(MODEL_SIZE)
        logger.info(f"Whisper model '{MODEL_SIZE}' loaded successfully.")
    return _model


def transcribe_audio(audio_path: str) -> dict:
    """
    Transcribes an audio file using OpenAI Whisper.

    Returns a dict with:
      - text: full transcript string
      - segments: list of {start, end, text} dicts for timestamps
    """
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    model = _load_model()
    logger.info(f"Transcribing: {audio_path}")

    result = model.transcribe(
        audio_path,
        verbose=False,
        word_timestamps=False,
        fp16=False,           # Safe for CPU environments
        language=None,        # Auto-detect language
        condition_on_previous_text=True,
    )

    transcript_text = result.get("text", "").strip()
    raw_segments = result.get("segments", [])

    # Normalize segments to simple dicts
    segments = [
        {
            "start": seg["start"],
            "end": seg["end"],
            "text": seg["text"].strip(),
        }
        for seg in raw_segments
    ]

    logger.info(f"Transcription complete. Length: {len(transcript_text)} chars, Segments: {len(segments)}")

    return {
        "text": transcript_text,
        "segments": segments,
    }