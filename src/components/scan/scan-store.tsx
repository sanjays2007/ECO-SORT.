"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type WasteBin = "plastic" | "glass" | "compost" | "landfill";

export type ScanDetection = {
  label: string;
  confidence: number;
};

export type ScanRecord = {
  id: string;
  timestamp: number;
  source: "upload" | "camera";
  wasteType: string;
  wasteTypeConfidence: number;
  binSuggestion: WasteBin;
  binConfidence: number;
  imageUrl: string;
  detections?: ScanDetection[];
};

type ScanStore = {
  scans: ScanRecord[];
  addScan: (scan: Omit<ScanRecord, "id" | "timestamp"> & Partial<Pick<ScanRecord, "id" | "timestamp">>) => void;
  clearScans: () => void;
};

const STORAGE_KEY = "ecosort.scans.v1";
const MAX_SCANS = 200;

function normalizeConfidence(val: any): number {
  const num = Number(val ?? 0);
  if (isNaN(num)) return 0;
  if (num > 1) return Math.min(1, Math.max(0, num / 100));
  return Math.min(1, Math.max(0, num));
}

function safeParseScans(raw: string | null): ScanRecord[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(Boolean)
      .map((s: any) => {
        let binSuggestion = s.binSuggestion ?? "landfill";
        if (binSuggestion === "recycling") {
          binSuggestion = "plastic";
        }
        
        return {
          id: String(s.id ?? crypto.randomUUID()),
          timestamp: Number(s.timestamp ?? Date.now()),
          source: (s.source === "camera" ? "camera" : "upload") as "camera" | "upload",
          wasteType: String(s.wasteType ?? "unknown"),
          wasteTypeConfidence: normalizeConfidence(s.wasteTypeConfidence),
          binSuggestion: binSuggestion as WasteBin,
          binConfidence: normalizeConfidence(s.binConfidence),
          imageUrl: String(s.imageUrl ?? ""),
          detections: Array.isArray(s.detections)
            ? s.detections.map((d: any) => ({ label: String(d.label), confidence: normalizeConfidence(d.confidence) }))
            : undefined,
        };
      })
      .slice(0, MAX_SCANS);
  } catch {
    return [];
  }
}

function loadInitialScans(): ScanRecord[] {
  if (typeof window === "undefined") return [];
  return safeParseScans(window.localStorage.getItem(STORAGE_KEY));
}

const ScanContext = createContext<ScanStore | null>(null);

export function ScanProvider({ children }: { children: React.ReactNode }) {
  // Hydration-safe: start empty so server/client first render match.
  const [scans, setScans] = useState<ScanRecord[]>([]);

  useEffect(() => {
    setScans(loadInitialScans());
  }, []);

  useEffect(() => {
    // Keep store in sync across tabs.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setScans(safeParseScans(e.newValue));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addScan: ScanStore["addScan"] = useCallback((scan) => {
    const record: ScanRecord = {
      id: scan.id ?? crypto.randomUUID(),
      timestamp: scan.timestamp ?? Date.now(),
      source: scan.source ?? "upload",
      wasteType: scan.wasteType,
      wasteTypeConfidence: normalizeConfidence(scan.wasteTypeConfidence),
      binSuggestion: scan.binSuggestion,
      binConfidence: normalizeConfidence(scan.binConfidence),
      imageUrl: scan.imageUrl,
      detections: scan.detections?.map((d) => ({
        label: d.label,
        confidence: normalizeConfidence(d.confidence),
      })),
    };

    setScans((prev) => {
      const next = [record, ...prev].slice(0, MAX_SCANS);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const clearScans = useCallback(() => {
    setScans([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(() => ({ scans, addScan, clearScans }), [scans, addScan, clearScans]);

  return <ScanContext.Provider value={value}>{children}</ScanContext.Provider>;
}

export function useScanStore(): ScanStore {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error("useScanStore must be used within ScanProvider");
  return ctx;
}
