"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import api, { getErrorMessage } from "@/lib/api";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Input from "@/components/ui/Input";

export default function VerifyEmailContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    if (!token) return;
    setStatus("verifying");
    api
      .post("/auth/verify-email", { token })
      .then(() => {
        setStatus("success");
        setTimeout(() => router.push("/login"), 2500);
      })
      .catch((err) => {
        setStatus("error");
        setErrorMsg(getErrorMessage(err));
      });
  }, [token, router]);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    setResendStatus("sending");
    try {
      await api.post("/auth/resend-verification", { email });
      setResendStatus("sent");
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
      setResendStatus("error");
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        {status === "verifying" && (
          <>
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
            <p className="text-zinc-300">Verifying your email…</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-900/40">
              <svg className="h-7 w-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Email verified!</h2>
            <p className="text-zinc-400 text-sm">Redirecting to login…</p>
          </>
        )}

        {(status === "error" || status === "idle") && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800">
              <svg className="h-7 w-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
            <p className="text-zinc-400 text-sm mb-4">
              {status === "error"
                ? errorMsg || "The link has expired or is invalid."
                : "We sent you a verification link. Click it to verify your account."}
            </p>

            {resendStatus === "sent" ? (
              <Alert type="success">Verification email sent — check your inbox.</Alert>
            ) : (
              <form onSubmit={handleResend} className="mt-4 space-y-3 text-left">
                <Input
                  label="Resend to email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="secondary"
                  loading={resendStatus === "sending"}
                  className="w-full"
                >
                  Resend verification email
                </Button>
              </form>
            )}

            <p className="mt-4 text-sm text-zinc-500">
              <Link href="/login" className="text-purple-400 hover:text-purple-300">
                Back to login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
