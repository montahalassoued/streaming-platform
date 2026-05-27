"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Category, Stream } from "@/types";
import StreamCard from "@/components/stream/StreamCard";

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Category>(`/categories/${id}`),
      api.get(`/streams`, { params: { categoryId: id } }),
    ])
      .then(([catRes, streamsRes]) => {
        setCategory(catRes.data);
        const d = streamsRes.data;
        setStreams(Array.isArray(d) ? d : d.data ?? []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="animate-pulse h-8 w-48 bg-zinc-800 rounded" />;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{category?.name ?? "Category"}</h1>
        <p className="text-zinc-400 text-sm mt-1">Live streams in this category</p>
      </div>

      {streams.length === 0 ? (
        <p className="text-zinc-500">No live streams in this category right now.</p>
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
