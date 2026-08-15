import { NextResponse } from "next/server";
import { validateWasteImageSafety } from "@/ai/flows/validate-waste-image-safety-flow";
import { identifyWasteFromImage } from "@/ai/flows/identify-waste-flow";

export const runtime = "nodejs";

type PredictRequest = {
  image: string;
  conf?: number;
  skipSafetyCheck?: boolean;
  source?: "upload" | "camera";
  vote?: boolean;
  streamId?: string;
  voteWindow?: number;
  voteMin?: number;
};

type StableVote = {
  label: string;
  votes: number;
  window: number;
  frames: number;
  ready: boolean;
  isStable: boolean;
};

const GEMINI_VOTE_WINDOW = 8;
const GEMINI_VOTE_MIN = 5;
const GEMINI_NO_DETECTION = "__none__";
const geminiVoteBuffers = new Map<string, string[]>();
const geminiLastStable = new Map<string, string>();

function buildStableVote(
  key: string,
  newLabel: string | null,
  requestedWindow?: number,
  requestedMin?: number
): StableVote {
  const window = Math.max(1, Number(requestedWindow ?? GEMINI_VOTE_WINDOW));
  const minVotes = Math.max(1, Number(requestedMin ?? GEMINI_VOTE_MIN));

  const current = geminiVoteBuffers.get(key) ?? [];
  const withNew = [...current, newLabel ?? GEMINI_NO_DETECTION].slice(-window);
  geminiVoteBuffers.set(key, withNew);

  const counts = withNew.reduce<Record<string, number>>((acc, label) => {
    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});

  const [winner, votes] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] ?? [GEMINI_NO_DETECTION, 0];
  const frames = withNew.length;
  const ready = frames >= window;

  if (ready && votes >= minVotes && winner !== GEMINI_NO_DETECTION) {
    geminiLastStable.set(key, winner);
    return { label: winner, votes, window, frames, ready: true, isStable: true };
  }

  const lastStable = geminiLastStable.get(key);
  if (lastStable) {
    return { label: lastStable, votes, window, frames, ready, isStable: false };
  }

  if (ready) {
    return { label: "Unknown", votes, window, frames, ready: true, isStable: false };
  }

  return { label: "Thinking...", votes, window, frames, ready: false, isStable: false };
}

export async function POST(req: Request) {
  const body = (await req.json()) as PredictRequest;
  if (!body?.image || typeof body.image !== "string") {
    return NextResponse.json({ error: "Missing 'image'" }, { status: 400 });
  }

  if (!body.skipSafetyCheck) {
    try {
      const safetyResult = await validateWasteImageSafety(body.image);

      if (!safetyResult.safeForWasteClassification || safetyResult.hasHuman) {
        return NextResponse.json(
          {
            error: "Image blocked by safety check",
            details: safetyResult.reason || "Only the waste object should be visible. Remove people from the frame and try again.",
          },
          { status: 422 }
        );
      }
    } catch (error) {
      // If Gemini API key is missing or safety check failed, proceed to try classification or surface error
      console.warn("Safety check note:", error);
    }
  }

  // Gemini API Direct Object Detection & Classification
  try {
    const geminiResult = await identifyWasteFromImage(body.image);
    const detections = (geminiResult.detectedObjects ?? []).map((det) => ({
      label: det.label,
      confidence: det.confidence,
    }));

    const topDetection = detections[0] ?? {
      label: geminiResult.itemName,
      confidence: geminiResult.confidence,
    };

    const voteEnabled = body.vote ?? body.source === "camera";
    const stable = voteEnabled
      ? buildStableVote(
          body.streamId ?? body.source ?? "gemini-default",
          topDetection.label || null,
          body.voteWindow,
          body.voteMin
        )
      : null;

    return NextResponse.json({
      engine: "gemini",
      top: {
        label: topDetection.label,
        confidence: topDetection.confidence,
        category: geminiResult.category,
        material: geminiResult.material,
        binSuggestion: geminiResult.binSuggestion,
        disposalTips: geminiResult.disposalTips,
      },
      detections,
      stable,
    });
  } catch (geminiErr: any) {
    return NextResponse.json(
      {
        error: "Failed to detect object with Gemini API",
        details: geminiErr?.message || String(geminiErr),
      },
      { status: 502 }
    );
  }
}

