"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Vod } from "@/types";

function formatDuration(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function VodsPage() {
  const [vods, setVods] = useState<Vod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Vod[]>("/vods")
      .then((r) => setVods(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Videos on Demand</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden animate-pulse">
              <div className="aspect-video bg-zinc-800" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : vods.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-zinc-400 text-lg font-medium">No recordings yet</p>
          <p className="text-zinc-600 text-sm mt-1">VODs appear automatically when streams end</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vods.map((v) => (
            <Link
              key={v.id}
              href={`/vods/${v.id}`}
              className="group rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-purple-600 transition-colors"
            >
              <div className="relative aspect-video bg-zinc-800">
                {v.thumbnailUrl && (
                  <img src={v.thumbnailUrl} alt={v.title ?? "VOD"} className="absolute inset-0 w-full h-full object-cover" />
                )}
                {v.durationSeconds && (
                  <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                    {formatDuration(v.durationSeconds)}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                  {v.title ?? "Untitled VOD"}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {new Date(v.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
