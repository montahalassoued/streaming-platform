"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api, { getErrorMessage } from "@/lib/api";
import { Stream } from "@/types";
import StreamPlayer from "@/components/stream/StreamPlayer";
import ChatSidebar from "@/components/chat/ChatSidebar";
import DonateModal from "@/components/stream/DonateModal";

export default function StreamPage() {
  const { id } = useParams<{ id: string }>();
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donateOpen, setDonateOpen] = useState(false);

  useEffect(() => {
    api
      .get<Stream>(`/streams/${id}`)
      .then((r) => setStream(r.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        <div className="aspect-video bg-zinc-900 animate-pulse rounded-lg" />
        <div className="h-96 bg-zinc-900 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (error || !stream) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-zinc-400 text-lg">{error || "Stream not found"}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
      <div className="space-y-4">
        <StreamPlayer hlsUrl={stream.hlsUrl} />
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{stream.title}</h1>
            <p className="text-zinc-400 text-sm mt-1">
              {stream.streamer?.displayName ?? "Unknown streamer"}
              {stream.category && (
                <span className="ml-2 rounded bg-zinc-800 px-2 py-0.5 text-xs">
                  {stream.category.name}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => setDonateOpen(true)}
            className="rounded-md bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 text-sm transition-colors"
          >
            Donate
          </button>
        </div>
      </div>

      <div className="h-[600px]">
        <ChatSidebar streamId={id} />
      </div>

      {donateOpen && (
        <DonateModal streamId={id} onClose={() => setDonateOpen(false)} />
      )}
    </div>
  );
}
