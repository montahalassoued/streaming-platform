"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api, { getErrorMessage } from "@/lib/api";
import { Vod } from "@/types";
import StreamPlayer from "@/components/stream/StreamPlayer";

export default function VodPage() {
  const { id } = useParams<{ id: string }>();
  const [vod, setVod] = useState<Vod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Vod>(`/vods/${id}`)
      .then((r) => setVod(r.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="aspect-video bg-zinc-900 animate-pulse rounded-lg" />;
  if (error || !vod)
    return <p className="text-zinc-400 py-24 text-center">{error || "VOD not found"}</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {vod.videoUrl ? (
        <StreamPlayer hlsUrl={vod.videoUrl} />
      ) : (
        <div className="aspect-video bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-500">
          Video not available
        </div>
      )}
      <div>
        <h1 className="text-xl font-bold text-white">{vod.title ?? "Untitled VOD"}</h1>
        <p className="text-sm text-zinc-500 mt-1">{new Date(vod.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
