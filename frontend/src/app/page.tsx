"use client";

import { useEffect, useState } from "react";
import api, { getErrorMessage } from "@/lib/api";
import { Stream, Category, PaginatedResponse } from "@/types";
import StreamCard from "@/components/stream/StreamCard";
import Link from "next/link";

export default function HomePage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Category[]>("/categories")
      .then((r) => {
        const data = r.data;
        setCategories(Array.isArray(data) ? data : (data as any).data ?? []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (selectedCategory) params.categoryId = selectedCategory;
    api
      .get<PaginatedResponse<Stream> | Stream[]>("/streams", { params })
      .then((r) => {
        const data = r.data;
        setStreams(Array.isArray(data) ? data : (data as PaginatedResponse<Stream>).data ?? []);
        setError("");
      })
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Live Now</h1>
        <p className="text-zinc-400 text-sm">Watch live streams from creators around the world</p>
      </div>

      {categories.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory("")}
            className={`rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition-colors ${
              !selectedCategory
                ? "bg-purple-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            All
          </button>
          {categories.slice(0, 12).map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? "bg-purple-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden animate-pulse">
              <div className="aspect-video bg-zinc-800" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : streams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <svg className="h-16 w-16 text-zinc-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-zinc-400 text-lg font-medium">No streams live right now</p>
          <p className="text-zinc-600 text-sm mt-1">Check back later or browse VODs</p>
          <Link href="/vods" className="mt-4 text-purple-400 hover:text-purple-300 text-sm">
            Browse VODs →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {streams.map((s) => (
            <StreamCard key={s.id} stream={s} />
          ))}
        </div>
      )}
    </div>
  );
}
