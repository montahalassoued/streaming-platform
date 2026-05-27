"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import api, { getErrorMessage } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

export default function SettingsPage() {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [becomingStreamer, setBecomingStreamer] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (user) {
      setDisplayName(user.displayName ?? "");
      setBio(user.bio ?? "");
      setAvatarUrl(user.avatarUrl ?? "");
    }
  }, [user, loading, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await api.patch("/users/me", { displayName, bio, avatarUrl });
      await refresh();
      setSaved(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleBecomeStreamer() {
    setBecomingStreamer(true);
    try {
      await api.post("/users/me/become-streamer");
      await refresh();
      router.push("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBecomingStreamer(false);
    }
  }

  if (loading || !user) return null;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      {saved && <Alert type="success">Profile updated.</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <form onSubmit={handleSave} className="mt-4 space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} className="h-16 w-16 rounded-full object-cover" alt="" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-700 text-2xl font-bold">
              {user.username[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white">{user.username}</p>
            <p className="text-sm text-zinc-400">{user.email}</p>
          </div>
        </div>

        <Input
          label="Display name"
          placeholder="Your display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-300">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell the world about yourself…"
            rows={3}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500 resize-none"
          />
        </div>
        <Input
          label="Avatar URL"
          placeholder="https://example.com/avatar.jpg"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />
        <Button type="submit" loading={saving} className="w-full">
          Save changes
        </Button>
      </form>

      {!user.isStreamer && (
        <div className="mt-6 rounded-xl border border-purple-800/50 bg-purple-900/20 p-6">
          <h2 className="text-lg font-semibold text-white mb-1">Become a Streamer</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Enable streaming features and get your personal RTMP key.
          </p>
          <Button
            onClick={handleBecomeStreamer}
            loading={becomingStreamer}
            variant="primary"
          >
            Become a streamer
          </Button>
        </div>
      )}
    </div>
  );
}
