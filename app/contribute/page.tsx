"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const CONTRIBUTION_TYPES = [
  "Guest post idea",
  "Topic suggestion",
  "Collaboration",
  "Other",
] as const;

export default function ContributePage() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const contributionType = formData.get("contributionType") as string;
    const message = formData.get("message") as string;

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name?.trim(),
          email: email?.trim(),
          contributionType: contributionType || undefined,
          message: message?.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(
          data.error || "Something went wrong. Please try again.",
        );
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage(
        "Network error. Please check your connection and try again.",
      );
    }
  }

  return (
    <main className="min-h-screen font-outfit bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-zinc-100">
        <div className="mx-auto max-w-6xl w-11/12 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tighter text-zinc-950"
          >
            sutra<span className="text-zinc-400">.</span>
          </Link>
          <div className="flex gap-8 text-sm font-medium">
            <Link
              href="/archive"
              className="nav-link text-zinc-500 hover:text-zinc-950 transition-colors"
            >
              Archive
            </Link>
            <Link
              href="/about"
              className="nav-link text-zinc-500 hover:text-zinc-950 transition-colors"
            >
              About
            </Link>
            <Link href="/contribute" className="text-zinc-950">
              Contribute
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto w-11/12 md:w-3/4 lg:w-2/5 py-24 flex flex-col gap-16">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-950 transition-colors group w-fit"
          >
            <ArrowLeftIcon width={12} />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Back to Homepage
            </p>
          </Link>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-950 leading-none">
            Contribute<span className="text-zinc-200">.</span>
          </h1>
          <p className="text-zinc-600 text-lg max-w-xl">
            Have an idea for a post, a topic you’d like to see, or want to
            collaborate? Reach out below and I’ll get back to you.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
          aria-label="Contribution form"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-zinc-700">
              Name <span className="text-zinc-400">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your name"
              className="w-full px-4 py-3 border border-zinc-200 rounded-sm bg-white text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              disabled={status === "sending"}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-700"
            >
              Email <span className="text-zinc-400">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-zinc-200 rounded-sm bg-white text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              disabled={status === "sending"}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="contributionType"
              className="text-sm font-medium text-zinc-700"
            >
              How do you want to contribute?
            </label>
            <select
              id="contributionType"
              name="contributionType"
              className="w-full px-4 py-3 border border-zinc-200 rounded-sm bg-white text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              disabled={status === "sending"}
            >
              {CONTRIBUTION_TYPES.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="message"
              className="text-sm font-medium text-zinc-700"
            >
              Message <span className="text-zinc-400">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Your idea, topic suggestion, or how you’d like to collaborate…"
              className="w-full px-4 py-3 border border-zinc-200 rounded-sm bg-white text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-y min-h-[120px]"
              disabled={status === "sending"}
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}

          {status === "success" && (
            <p className="text-sm text-emerald-600" role="status">
              Thanks! Your message was sent. I’ll get back to you soon.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full md:w-auto px-8 py-4 bg-zinc-950 text-white font-semibold text-sm uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
        </form>
      </section>
    </main>
  );
}
