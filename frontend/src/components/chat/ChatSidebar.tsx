"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import { useAuth } from "@/lib/auth-context";
import { ChatMessage } from "@/types";

interface ChatSidebarProps {
  streamId: string;
}

interface MessageWithUser {
  message: ChatMessage;
  user: { id: string | null; username: string | null };
}

export default function ChatSidebar({ streamId }: ChatSidebarProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [input, setInput] = useState("");
  const [viewerCount, setViewerCount] = useState<number>(0);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const socket = getSocket(token);

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("joinStream", { streamId });
    });

    socket.on("connect_error", () => setConnected(false));

    socket.on("joinedStream", ({ messages: history }: { messages: ChatMessage[] }) => {
      setMessages(
        history.map((m) => ({ message: m, user: { id: m.userId, username: null } })),
      );
    });

    socket.on("newMessage", (data: MessageWithUser) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("messageDeleted", ({ messageId }: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.message.id === messageId
            ? { ...m, message: { ...m.message, isDeleted: true } }
            : m,
        ),
      );
    });

    socket.on("viewerCount", ({ count }: { count: number }) => {
      setViewerCount(count);
    });

    return () => {
      socket.emit("leaveStream", { streamId });
      socket.off("connect");
      socket.off("connect_error");
      socket.off("joinedStream");
      socket.off("newMessage");
      socket.off("messageDeleted");
      socket.off("viewerCount");
    };
  }, [streamId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    const socket = getSocket(token);
    socket.emit("sendMessage", { streamId, content: input.trim() });
    setInput("");
  }

  return (
    <div className="flex h-full flex-col bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <span className="font-semibold text-white">Live Chat</span>
        {viewerCount > 0 && (
          <span className="text-xs text-zinc-400">{viewerCount} watching</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && (
          <p className="text-center text-sm text-zinc-500 mt-8">No messages yet</p>
        )}
        {messages.map((m) =>
          m.message.isDeleted ? null : (
            <div key={m.message.id} className="text-sm">
              <span className="font-semibold text-purple-400">
                {m.user.username ?? "User"}
              </span>
              <span className="text-zinc-300 ml-1">{m.message.content}</span>
            </div>
          ),
        )}
        <div ref={bottomRef} />
      </div>

      {user ? (
        <form onSubmit={sendMessage} className="border-t border-zinc-800 p-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message…"
            maxLength={500}
            className="flex-1 rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || !connected}
            className="rounded-md bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      ) : (
        <div className="border-t border-zinc-800 p-4 text-center">
          <a href="/login" className="text-sm text-purple-400 hover:text-purple-300">
            Log in to chat
          </a>
        </div>
      )}
    </div>
  );
}
