"use client";

import { useState } from "react";
import api, { getErrorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

interface DonateModalProps {
  streamId: string;
  onClose: () => void;
}

export default function DonateModal({ streamId, onClose }: DonateModalProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState("5");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post<{ checkoutUrl: string }>("/donations", {
        streamId,
        userId: user.id,
        amountCents: Math.round(parseFloat(amount) * 100),
        currency: "USD",
        message: message || undefined,
      });
      window.open(data.checkoutUrl, "_blank");
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-xl border border-zinc-700 bg-zinc-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Send a donation</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">✕</button>
        </div>

        {!user ? (
          <Alert type="info">
            <a href="/login" className="underline">Log in</a> to donate.
          </Alert>
        ) : (
          <>
            {error && <Alert type="error">{error}</Alert>}
            <form onSubmit={handleDonate} className="mt-4 space-y-4">
              <Input
                label="Amount (USD)"
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-zinc-300">Message (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Great stream!"
                  maxLength={200}
                  rows={3}
                  className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500 resize-none"
                />
              </div>
              <Button type="submit" loading={loading} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold">
                Donate ${amount}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
