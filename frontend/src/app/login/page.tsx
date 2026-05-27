"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getErrorMessage } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      const msg = getErrorMessage(err);
      if (msg.toLowerCase().includes("verified")) {
        setError("Email not verified. Check your inbox or resend below.");
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-sm text-zinc-400 mb-6">Log in to your account</p>

        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" loading={loading} className="w-full">
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-purple-400 hover:text-purple-300">
            Sign up
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-zinc-500">
          Need to verify your email?{" "}
          <Link href="/verify-email" className="text-purple-400 hover:text-purple-300">
            Resend
          </Link>
        </p>
      </div>
    </div>
  );
}
