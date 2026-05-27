"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import api, { getErrorMessage } from "@/lib/api";
import { Stream } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

export default function ManageStreamsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  // Create form
  const [title, setTitle] = useState("");
  const [rtmpUrl, setRtmpUrl] = useState("");
  const [hlsUrl, setHlsUrl] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  function loadStreams() {
    setDataLoading(true);
    api
      .get<Stream[]>("/streams")
      .then((r) => setStreams(Array.isArray(r.data) ? r.data : (r.data as any).data ?? []))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setDataLoading(false));
  }

  useEffect(() => {
    if (user) loadStreams();
  }, [user]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setCreating(true);
    setError("");
    try {
      const streamerRes = await api.get("/streamer/me");
      await api.post("/streams", {
        streamerId: streamerRes.data.id,
        title,
        rtmpUrl,
        hlsUrl,
        isLive: false,
      });
      setShowCreate(false);
      setTitle("");
      setRtmpUrl("");
      setHlsUrl("");
      loadStreams();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this stream?")) return;
    try {
      await api.delete(`/streams/${id}`);
      setStreams((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  if (loading || !user) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Streams</h1>
        <Button size="sm" onClick={() => setShowCreate(true)}>New stream</Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {showCreate && (
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 mb-6">
          <h2 className="font-semibold text-white mb-4">Create stream</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Input label="RTMP URL" value={rtmpUrl} onChange={(e) => setRtmpUrl(e.target.value)} placeholder="rtmp://..." required />
            <Input label="HLS URL" value={hlsUrl} onChange={(e) => setHlsUrl(e.target.value)} placeholder="https://..." required />
            <div className="flex gap-2">
              <Button type="submit" loading={creating} size="sm">Create</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {dataLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 bg-zinc-900 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : streams.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">No streams yet. Create your first one!</div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
          <div className="divide-y divide-zinc-800">
            {streams.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium text-white">{s.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${s.isLive ? "bg-red-900/40 text-red-300" : "bg-zinc-800 text-zinc-500"}`}>
                      {s.isLive ? "LIVE" : "Offline"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => router.push(`/streams/${s.id}`)}>
                    View
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(s.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
