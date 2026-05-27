"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api, { getErrorMessage } from "@/lib/api";
import { User } from "@/types";
import { useAuth } from "@/lib/auth-context";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function UserProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    api
      .get<User>(`/users/${username}`)
      .then((r) => setProfile(r.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [username]);

  useEffect(() => {
    if (!me || !profile) return;
    api
      .get("/follows/me")
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : [];
        setFollowing(list.some((f: any) => f.streamerId === profile.id));
      })
      .catch(() => {});

    api
      .get("/subscriptions")
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : [];
        setSubscribed(list.some((s: any) => s.streamerId === profile.id));
      })
      .catch(() => {});
  }, [me, profile]);

  async function toggleFollow() {
    if (!profile) return;
    setFollowLoading(true);
    try {
      if (following) {
        await api.delete(`/follows/${profile.id}`);
        setFollowing(false);
      } else {
        await api.post("/follows", { streamerId: profile.id });
        setFollowing(true);
      }
    } catch {
    } finally {
      setFollowLoading(false);
    }
  }

  async function subscribe() {
    if (!profile) return;
    setSubLoading(true);
    try {
      await api.post("/subscriptions", { streamerId: profile.id });
      setSubscribed(true);
    } catch {
    } finally {
      setSubLoading(false);
    }
  }

  if (loading) return <div className="animate-pulse h-40 bg-zinc-900 rounded-lg" />;
  if (error || !profile)
    return <p className="text-zinc-400 py-24 text-center">{error || "User not found"}</p>;

  const isOwnProfile = me?.username === profile.username;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-start gap-4">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} className="h-20 w-20 rounded-full object-cover" alt="" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-700 text-3xl font-bold">
              {profile.username[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-white">
                {profile.displayName ?? profile.username}
              </h1>
              {profile.isStreamer && (
                <span className="rounded-full bg-purple-600/30 text-purple-300 px-2 py-0.5 text-xs font-medium">
                  Streamer
                </span>
              )}
            </div>
            <p className="text-zinc-400 text-sm">@{profile.username}</p>
            {profile.bio && <p className="text-zinc-300 text-sm mt-2">{profile.bio}</p>}
            <div className="flex gap-4 mt-3 text-sm text-zinc-500">
              <span><strong className="text-white">{profile.followersCount ?? 0}</strong> followers</span>
              <span><strong className="text-white">{profile.followingCount ?? 0}</strong> following</span>
            </div>
          </div>
        </div>

        {me && !isOwnProfile && (
          <div className="flex gap-2 mt-4">
            <Button
              variant={following ? "secondary" : "primary"}
              loading={followLoading}
              onClick={toggleFollow}
              size="sm"
            >
              {following ? "Unfollow" : "Follow"}
            </Button>
            {profile.isStreamer && !subscribed && (
              <Button variant="secondary" loading={subLoading} onClick={subscribe} size="sm">
                Subscribe
              </Button>
            )}
            {subscribed && (
              <span className="flex items-center text-xs text-green-400 gap-1">
                ✓ Subscribed
              </span>
            )}
          </div>
        )}

        {isOwnProfile && (
          <div className="mt-4">
            <Link href="/settings">
              <Button variant="secondary" size="sm">Edit profile</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
