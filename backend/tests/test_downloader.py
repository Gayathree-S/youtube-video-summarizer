import os
import tempfile
import unittest
from unittest.mock import patch

from downloader import download_audio


class FakeYDL:
    def __init__(self, opts):
        self.opts = opts

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

    def extract_info(self, url, download):
        output_path = self.opts["outtmpl"].replace("%(ext)s", "mp3")
        with open(output_path, "w", encoding="utf-8") as handle:
            handle.write("demo")
        return {"title": "demo", "duration": 10}


class DownloadAudioTests(unittest.TestCase):
    def test_download_audio_uses_youtube_player_client_fallback(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            with patch("downloader.DOWNLOAD_DIR", tmpdir):
                captured = {}

                class CapturingYDL(FakeYDL):
                    pass

                def fake_youtube_dl(opts):
                    captured["opts"] = opts
                    return CapturingYDL(opts)

                with patch("downloader.yt_dlp.YoutubeDL", side_effect=fake_youtube_dl):
                    output_path = download_audio("https://www.youtube.com/watch?v=demo")

                self.assertIn("extractor_args", captured["opts"])
                self.assertEqual(
                    captured["opts"]["extractor_args"]["youtube"]["player_client"],
                    ["web", "android"],
                )
                self.assertTrue(os.path.exists(output_path))


if __name__ == "__main__":
    unittest.main()
