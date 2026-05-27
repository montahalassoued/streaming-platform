"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import api, { getErrorMessage } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

export default function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <Alert type="success">Password reset! Redirecting to login…</Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="text-2xl font-bold text-white mb-1">Reset password</h1>
        <p className="text-sm text-zinc-400 mb-6">Enter your new password below.</p>

        {!token && (
          <Alert type="error">
            Invalid or missing reset token.{" "}
            <Link href="/forgot-password" className="underline">Request a new link.</Link>
          </Alert>
        )}
        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Input
            label="New password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            disabled={!token}
          />
          <Button type="submit" loading={loading} disabled={!token} className="w-full">
            Reset password
          </Button>
        </form>
      </div>
    </div>
  );
}
