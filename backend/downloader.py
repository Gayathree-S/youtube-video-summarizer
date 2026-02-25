import os
import uuid
import logging
import yt_dlp  # type: ignore

logger = logging.getLogger(__name__)

DOWNLOAD_DIR = "/tmp/yt_audio"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)


def download_audio(url: str) -> str:
    """
    Downloads audio from a YouTube URL using yt-dlp and converts to MP3.
    Returns the path to the downloaded MP3 file.
    """
    file_id = str(uuid.uuid4())
    output_template = os.path.join(DOWNLOAD_DIR, f"{file_id}.%(ext)s")
    output_mp3 = os.path.join(DOWNLOAD_DIR, f"{file_id}.mp3")

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": output_template,
        "quiet": True,
        "no_warnings": True,
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "128",
            }
        ],
        # Prevent age-restricted / geo-blocked errors where possible
        "cookiesfrombrowser": None,
        "nocheckcertificate": True,
        "ignoreerrors": False,
        "socket_timeout": 30,
    }

    logger.info(f"Downloading audio from: {url}")
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            title = info.get("title", "Unknown")
            duration = info.get("duration", 0)
            logger.info(f"Downloaded: '{title}' ({duration}s)")
    except yt_dlp.utils.DownloadError as e:
        raise RuntimeError(f"yt-dlp download error: {str(e)}")

    if not os.path.exists(output_mp3):
        # Try to find the file with any extension if ffmpeg conversion failed
        for f in os.listdir(DOWNLOAD_DIR):
            if f.startswith(file_id):
                return os.path.join(DOWNLOAD_DIR, f)
        raise FileNotFoundError(f"Downloaded audio file not found at: {output_mp3}")

    logger.info(f"Audio saved to: {output_mp3}")
    return output_mp3


def cleanup_audio(file_path: str):
    """Remove a downloaded audio file after processing."""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Cleaned up: {file_path}")
    except Exception as e:
        logger.warning(f"Failed to clean up {file_path}: {e}")