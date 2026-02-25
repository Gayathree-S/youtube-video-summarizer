import logging
from transformers import pipeline  # type: ignore

logger = logging.getLogger(__name__)

WINDOW_SECONDS = 60          # Group segments into 60-second windows
MAX_SUMMARY_TOKENS = 60      # Keep timestamp summaries short
MIN_SUMMARY_TOKENS = 15
MAX_INPUT_WORDS = 200        # Max words per timestamp window

# Reuse the same summarizer pipeline (lazy-loaded)
_ts_summarizer = None


def _load_summarizer():
    global _ts_summarizer
    if _ts_summarizer is None:
        from summarizer import MODEL_NAME
        logger.info("Loading timestamp summarizer (reusing model)...")
        _ts_summarizer = pipeline(
            "summarization",
            model=MODEL_NAME,
            tokenizer=MODEL_NAME,
            framework="pt",
            device=-1,
        )
    return _ts_summarizer


def _format_timestamp(seconds: float) -> str:
    """Convert float seconds to [MM:SS] format."""
    total_sec = int(seconds)
    minutes = total_sec // 60
    secs = total_sec % 60
    return f"[{minutes:02d}:{secs:02d}]"


def _group_segments_by_window(
    segments: list[dict], window: int = WINDOW_SECONDS
) -> list[dict]:
    """
    Groups transcript segments into fixed time windows.
    Returns list of {start, text} dicts.
    """
    if not segments:
        return []

    windows = []
    current_start = segments[0]["start"]
    current_texts = []
    current_end_limit = current_start + window

    for seg in segments:
        if seg["start"] <= current_end_limit:
            current_texts.append(seg["text"])
        else:
            if current_texts:
                windows.append({
                    "start": current_start,
                    "text": " ".join(current_texts).strip(),
                })
            # Move to next window
            current_start = seg["start"]
            current_end_limit = current_start + window
            current_texts = [seg["text"]]

    # Flush last window
    if current_texts:
        windows.append({
            "start": current_start,
            "text": " ".join(current_texts).strip(),
        })

    return windows


def _summarize_window(text: str, summarizer) -> str:
    """Summarize a single time window's text."""
    words = text.split()
    # Truncate to max input words
    if len(words) > MAX_INPUT_WORDS:
        text = " ".join(words[:MAX_INPUT_WORDS])

    if len(words) < 10:
        # Too short to summarize — return as-is
        return text

    try:
        result = summarizer(
            text,
            max_length=MAX_SUMMARY_TOKENS,
            min_length=MIN_SUMMARY_TOKENS,
            do_sample=False,
            truncation=True,
        )
        return result[0]["summary_text"].strip()
    except Exception as e:
        logger.warning(f"Timestamp window summarization failed: {e}")
        # Fallback: first sentence
        sentences = text.split(".")
        return sentences[0].strip() + "." if sentences else text[:100]


def generate_timestamp_summary(segments: list[dict]) -> list[str]:
    """
    Generates a list of timestamp-based summaries.

    Args:
        segments: list of Whisper segments with 'start', 'end', 'text'

    Returns:
        list of strings formatted as "[MM:SS] summary text"
    """
    if not segments:
        return ["[00:00] No segments available for timestamp summary."]

    summarizer = _load_summarizer()
    windows = _group_segments_by_window(segments, WINDOW_SECONDS)

    logger.info(f"Generating timestamp summaries for {len(windows)} window(s)...")

    timestamp_lines = []
    for i, window in enumerate(windows):
        ts_label = _format_timestamp(window["start"])
        summary = _summarize_window(window["text"], summarizer)
        line = f"{ts_label} {summary}"
        timestamp_lines.append(line)
        logger.info(f"  {line[:80]}...")

    return timestamp_lines