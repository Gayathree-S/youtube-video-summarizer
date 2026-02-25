import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.url?.trim()) {
      return NextResponse.json(
        { error: "YouTube URL is required." },
        { status: 400 }
      );
    }

    const backendRes = await fetch(`${BACKEND_URL}/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: body.url.trim() }),
      // Long timeout — transcription can take a while
      signal: AbortSignal.timeout(5 * 60 * 1000), // 5 minutes
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data?.detail || "Backend processing failed." },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("[/api/summarize] Error:", err);

    if (err instanceof Error && err.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Request timed out. The video may be too long or the server is busy." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}