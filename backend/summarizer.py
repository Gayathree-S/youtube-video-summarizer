import logging
from transformers import pipeline  # type: ignore

logger = logging.getLogger(__name__)

# --- Configuration ---
MODEL_NAME = "sshleifer/distilbart-cnn-12-6"
MAX_CHUNK_WORDS = 400       # Words per chunk (safe for 1024-token models)
MAX_SUMMARY_LENGTH = 180    # Max tokens per chunk summary
MIN_SUMMARY_LENGTH = 40     # Min tokens per chunk summary

# Cache the pipeline globally
_summarizer = None


def _load_summarizer():
    global _summarizer
    if _summarizer is None:
        logger.info(f"Loading summarization model: '{MODEL_NAME}'...")
        _summarizer = pipeline(
            "summarization",
            model=MODEL_NAME,
            tokenizer=MODEL_NAME,
            framework="pt",
            device=-1,   # CPU (-1), use 0 for GPU
        )
        logger.info("Summarization model loaded.")
    return _summarizer


def _chunk_text(text: str, max_words: int = MAX_CHUNK_WORDS) -> list[str]:
    """Split text into word-based chunks to avoid token overflow."""
    words = text.split()
    chunks = []
    for i in range(0, len(words), max_words):
        chunk = " ".join(words[i: i + max_words])
        if chunk.strip():
            chunks.append(chunk)
    return chunks


def summarize_text(transcript: str) -> str:
    """
    Generates a clean paragraph summary of the full transcript.
    Handles long texts by chunking and merging summaries.
    """
    if not transcript or not transcript.strip():
        return "No transcript available to summarize."

    summarizer = _load_summarizer()
    chunks = _chunk_text(transcript)
    logger.info(f"Summarizing {len(chunks)} chunk(s)...")

    chunk_summaries = []
    for i, chunk in enumerate(chunks):
        logger.info(f"  Summarizing chunk {i + 1}/{len(chunks)}...")
        try:
            result = summarizer(
                chunk,
                max_length=MAX_SUMMARY_LENGTH,
                min_length=MIN_SUMMARY_LENGTH,
                do_sample=False,
                truncation=True,
            )
            summary_text = result[0]["summary_text"].strip()
            chunk_summaries.append(summary_text)
        except Exception as e:
            logger.warning(f"Chunk {i + 1} summarization failed: {e}")
            # Fallback: use first 300 chars of chunk
            chunk_summaries.append(chunk[:300] + "...")

    # If multiple chunks, do a final merge summarization
    if len(chunk_summaries) > 1:
        merged = " ".join(chunk_summaries)
        if len(merged.split()) > MAX_CHUNK_WORDS:
            logger.info("Running final merge summarization...")
            try:
                result = summarizer(
                    merged,
                    max_length=250,
                    min_length=80,
                    do_sample=False,
                    truncation=True,
                )
                return result[0]["summary_text"].strip()
            except Exception as e:
                logger.warning(f"Final merge summarization failed: {e}")
                return merged

    return " ".join(chunk_summaries)