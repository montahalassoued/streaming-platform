"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-purple-400 hover:text-purple-300">
          StreamHub
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/categories" className="text-sm text-zinc-400 hover:text-white">
            Categories
          </Link>
          <Link href="/vods" className="text-sm text-zinc-400 hover:text-white">
            VODs
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} className="h-7 w-7 rounded-full object-cover" alt="" />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-xs font-bold">
                    {user.username[0].toUpperCase()}
                  </span>
                )}
                {user.username}
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-1 w-48 rounded-md border border-zinc-700 bg-zinc-900 py-1 shadow-xl"
                  onBlur={() => setMenuOpen(false)}
                >
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  {user.isStreamer && (
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  {user.isAdmin && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <hr className="my-1 border-zinc-700" />
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-zinc-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-purple-600 px-3 py-1.5 text-sm text-white hover:bg-purple-700"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
