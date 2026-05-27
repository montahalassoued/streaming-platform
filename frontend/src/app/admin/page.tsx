"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import api, { getErrorMessage } from "@/lib/api";
import { User } from "@/types";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user?.isAdmin) return;
    api
      .get<User[]>("/admin/users")
      .then((r) => setUsers(r.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setDataLoading(false));
  }, [user]);

  async function promote(id: string) {
    setActionLoading(id);
    try {
      await api.post(`/admin/users/${id}/promote`);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isAdmin: true } : u)));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }

  async function demote(id: string) {
    setActionLoading(id);
    try {
      await api.post(`/admin/users/${id}/demote`);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isAdmin: false } : u)));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }

  if (loading || !user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Admin Panel</h1>

      {error && <Alert type="error">{error}</Alert>}

      {dataLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-zinc-900 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Roles</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20">
                  <td className="px-4 py-3">
                    <span className="font-medium text-white">{u.username}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {u.isAdmin && (
                        <span className="rounded-full bg-yellow-900/40 text-yellow-300 px-2 py-0.5 text-xs">Admin</span>
                      )}
                      {u.isStreamer && (
                        <span className="rounded-full bg-purple-900/40 text-purple-300 px-2 py-0.5 text-xs">Streamer</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {u.id !== user.id && (
                      u.isAdmin ? (
                        <Button
                          size="sm"
                          variant="danger"
                          loading={actionLoading === u.id}
                          onClick={() => demote(u.id)}
                        >
                          Demote
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          loading={actionLoading === u.id}
                          onClick={() => promote(u.id)}
                        >
                          Promote
                        </Button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
