"use client";

import { usePathname } from "next/navigation";
import Subscribe from "./Subscribe";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on unsubscribe success page
  if (pathname === "/unsubscribe/success") return null;

  return (
    <footer className="border-t border-zinc-100 py-12 mt-20">
      <div className="mx-auto w-11/12 lg:w-3/4 flex flex-col gap-12">
        <Subscribe />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-zinc-100 pt-8">
          <div className="flex items-center gap-4">
            <p className="text-zinc-400 text-xs font-medium tracking-wider">
              © 2026, Sutra by{" "}
              <span className="text-zinc-700">Rohan Yashraj Gupta</span>
            </p>
            <a
              href="/feed.xml"
              className="text-zinc-400 hover:text-zinc-600 transition-colors"
              aria-label="RSS Feed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M5.562 19c-.009 0-.019 0-.028.001A2.22 2.22 0 003.32 21.22c0 1.227.994 2.22 2.22 2.22.01 0 .02 0 .028-.001A2.22 2.22 0 007.782 21.22c0-1.227-.994-2.22-2.22-2.22zM3.403 11a.75.75 0 00-.75.75v1.2a.75.75 0 00.75.75 7.425 7.425 0 017.397 7.397.75.75 0 00.75.75h1.2a.75.75 0 00.75-.75A10.125 10.125 0 003.403 11zM3.403 4a.75.75 0 00-.75.75v1.2a.75.75 0 00.75.75 14.425 14.425 0 0114.397 14.397.75.75 0 00.75.75h1.2a.75.75 0 00.75-.75A17.125 17.125 0 003.403 4z" />
              </svg>
            </a>
          </div>

          <a
            href="https://rohanyashraj.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-950 text-xs font-bold uppercase tracking-[0.2em] transition-colors"
          >
            rohanyashraj.com
          </a>
        </div>
      </div>
    </footer>
  );
}
