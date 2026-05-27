"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import api, { getErrorMessage } from "@/lib/api";
import { Streamer, Donation } from "@/types";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Input from "@/components/ui/Input";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<"overview" | "donations" | "subscribers">("overview");
  const [streamer, setStreamer] = useState<Streamer | null>(null);
  const [streamKey, setStreamKey] = useState("");
  const [keyVisible, setKeyVisible] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Settings form
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [chatSlowMode, setChatSlowMode] = useState("0");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user && !user.isStreamer) router.push("/settings");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user?.isStreamer) return;
    Promise.all([
      api.get<Streamer>("/streamer/me"),
      api.get<{ streamKey: string }>("/streams/my/key"),
      api.get("/streamer/me/donations"),
      api.get("/streamer/me/subscribers"),
    ])
      .then(([streamerRes, keyRes, donationsRes, subsRes]) => {
        setStreamer(streamerRes.data);
        setDisplayName(streamerRes.data.displayName ?? "");
        setBio(streamerRes.data.bio ?? "");
        setChatSlowMode(String(streamerRes.data.chatSlowMode ?? 0));
        setStreamKey(keyRes.data.streamKey ?? "");
        const dons = donationsRes.data;
        setDonations(Array.isArray(dons) ? dons : dons.data ?? []);
        setSubscribers(Array.isArray(subsRes.data) ? subsRes.data : []);
      })
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setDataLoading(false));
  }, [user]);

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await api.patch("/streamer/me/settings", {
        displayName,
        bio,
        chatSlowMode: Number(chatSlowMode),
      });
      setSaved(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Creator Dashboard</h1>
        <Link href="/dashboard/streams">
          <Button size="sm" variant="secondary">Manage Streams</Button>
        </Link>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div className="flex gap-1 mb-6 border-b border-zinc-800">
        {(["overview", "donations", "subscribers"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-purple-500 text-white"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stream key */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="font-semibold text-white mb-3">Stream Key</h2>
            <p className="text-xs text-zinc-500 mb-2">Keep this private. Use it in OBS or your streaming software.</p>
            <div className="flex gap-2">
              <input
                type={keyVisible ? "text" : "password"}
                readOnly
                value={streamKey}
                className="flex-1 rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white font-mono"
              />
              <button
                onClick={() => setKeyVisible((v) => !v)}
                className="rounded-md bg-zinc-700 hover:bg-zinc-600 px-3 py-2 text-xs text-zinc-300"
              >
                {keyVisible ? "Hide" : "Show"}
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(streamKey)}
                className="rounded-md bg-zinc-700 hover:bg-zinc-600 px-3 py-2 text-xs text-zinc-300"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Channel settings */}
          <form onSubmit={handleSaveSettings} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
            <h2 className="font-semibold text-white">Channel Settings</h2>
            {saved && <Alert type="success">Settings saved.</Alert>}
            <Input
              label="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your channel name"
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-300">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500 resize-none"
              />
            </div>
            <Input
              label="Chat slow mode (seconds, 0 = off)"
              type="number"
              min="0"
              value={chatSlowMode}
              onChange={(e) => setChatSlowMode(e.target.value)}
            />
            <Button type="submit" loading={saving} size="sm">
              Save settings
            </Button>
          </form>
        </div>
      )}

      {tab === "donations" && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
          {dataLoading ? (
            <div className="p-6 text-zinc-400">Loading…</div>
          ) : donations.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">No donations yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-800 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Message</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                    <td className="px-4 py-3 text-white font-medium">
                      ${(d.amountCents / 100).toFixed(2)} {d.currency}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{d.message ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${
                        d.status === "completed"
                          ? "bg-green-900/40 text-green-300"
                          : d.status === "failed"
                          ? "bg-red-900/40 text-red-300"
                          : "bg-zinc-800 text-zinc-400"
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "subscribers" && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900">
          {dataLoading ? (
            <div className="p-6 text-zinc-400">Loading…</div>
          ) : subscribers.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">No subscribers yet.</div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {subscribers.map((s, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <span className="text-zinc-300 text-sm">{s.userId ?? s.id}</span>
                  <span className="text-xs text-zinc-500">
                    Expires {new Date(s.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
