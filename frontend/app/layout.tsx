import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouTube Summarizer",
  description:
    "Paste a YouTube link and get an instant AI-generated summary, timestamped breakdown, and full transcript — powered by Whisper and NLP.",
  openGraph: {
    title: "YouTube Summarizer",
    description: "AI-powered YouTube video summarizer using Whisper + NLP.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect for fast font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          Fonts:
          - Instrument Serif  → display headings (elegant editorial)
          - Geist             → UI body copy (clean, modern)
          - IBM Plex Mono     → transcript / code / timestamps
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Geist via Vercel CDN (official distribution) */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}