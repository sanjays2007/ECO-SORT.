import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY);
  const serviceUrl = process.env.YOLO_SERVICE_URL ?? "http://127.0.0.1:8000";
  const url = `${serviceUrl.replace(/\/$/, "")}/health`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2_000);

    const res = await fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timeout));
    const data = await res.json().catch(() => null);

    if (res.ok) {
      return NextResponse.json({ ok: true, engine: "yolo", details: data });
    }
  } catch {
    // Local YOLO service offline
  }

  if (hasGeminiKey) {
    return NextResponse.json({ ok: true, engine: "gemini", details: { status: "online", model: "gemini-2.0-flash" } });
  }

  return NextResponse.json(
    { ok: false, details: "No local YOLO service running and no GEMINI_API_KEY configured." },
    { status: 502 }
  );
}

