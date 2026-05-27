import Link from "next/link";
import { Stream } from "@/types";

interface StreamCardProps {
  stream: Stream;
}

export default function StreamCard({ stream }: StreamCardProps) {
  return (
    <Link href={`/streams/${stream.id}`} className="group block rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-purple-600 transition-colors">
      <div className="relative aspect-video bg-zinc-800">
        {stream.hlsUrl ? (
          <div className="flex h-full items-center justify-center text-zinc-500 text-sm">
            Live Preview
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-600">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <span className="absolute top-2 left-2 rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
          LIVE
        </span>
        {stream.viewerCount !== undefined && (
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
            {stream.viewerCount.toLocaleString()} viewers
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="font-medium text-white truncate group-hover:text-purple-300 transition-colors">
          {stream.title}
        </p>
        <p className="text-sm text-zinc-400 mt-0.5">
          {stream.streamer?.displayName ?? "Unknown streamer"}
        </p>
        {stream.category && (
          <span className="mt-1.5 inline-block rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
            {stream.category.name}
          </span>
        )}
      </div>
    </Link>
  );
}
