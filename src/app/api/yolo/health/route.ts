import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY);

  if (hasGeminiKey) {
    return NextResponse.json({
      ok: true,
      engine: "gemini",
      details: { status: "online", model: "gemini-3.6-flash" },
    });
  }

  return NextResponse.json(
    { ok: false, details: "Missing GEMINI_API_KEY environment variable." },
    { status: 502 }
  );
}


