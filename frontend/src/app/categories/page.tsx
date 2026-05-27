"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Category } from "@/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/categories")
      .then((r) => {
        const d = r.data;
        setCategories(Array.isArray(d) ? d : d.data ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Browse Categories</h1>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-lg bg-zinc-900 animate-pulse aspect-[3/4]" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-zinc-400">No categories yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.id}`}
              className="group rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-purple-600 transition-colors"
            >
              <div className="aspect-[3/4] bg-zinc-800 relative">
                {c.thumbnailUrl && (
                  <img src={c.thumbnailUrl} alt={c.name} className="absolute inset-0 w-full h-full object-cover" />
                )}
              </div>
              <div className="p-2">
                <p className="text-sm font-medium text-white truncate group-hover:text-purple-300">
                  {c.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
