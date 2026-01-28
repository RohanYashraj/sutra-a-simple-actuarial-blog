import Link from "next/link";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const TYPE_LABELS: Record<string, string> = {
  trivia: "Sutra Trivia",
  "market-pulse": "Market Pulse",
  "code-sutra": "Code Sutra",
  "genai-frontiers": "GenAI Frontiers",
  "actuarial-simplified": "Actuarial Simplified",
};

type Props = {
  params: Promise<{ type: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  
  if (!TYPE_LABELS[type]) {
    return {
      title: "Archive Not Found",
    };
  }

  return {
    title: `${TYPE_LABELS[type]} Archive`,
    description: `Browse all past issues of ${TYPE_LABELS[type]} on Sutra - Actuarial Blog.`,
    alternates: {
      canonical: `/archive/${type}`,
    },
  };
}

export default async function TypeArchivePage({
  params,
}: Props) {
  const { type } = await params;
  
  if (!TYPE_LABELS[type]) {
    notFound();
  }

  const broadcasts = await convex.query(api.broadcasts.getBroadcastsByType, { type });

  return (
    <main className="min-h-screen font-outfit">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-zinc-100">
        <div className="mx-auto w-11/12 lg:w-3/4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-zinc-950">
            sutra<span className="text-zinc-400">.</span> {type.replace(/-/g, ' ')}
          </Link>
          <div className="flex gap-8 text-sm font-medium">
            <Link href="/about" className="nav-link text-zinc-500 hover:text-zinc-950 transition-colors">About</Link>
            <Link href="https://www.rohanyashraj.com/contact" className="nav-link text-zinc-500 hover:text-zinc-950 transition-colors">Contact</Link>
          </div>
        </div>
      </nav>

      <header className="mx-auto w-11/12 lg:w-3/4 pt-16 pb-12">
        <Link 
          href="/archive" 
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-950 transition-colors group w-fit mb-8"
        >
          <ArrowLeftIcon width={16} />
          <p className="text-xs font-bold uppercase tracking-widest">Back to Archives</p>
        </Link>
        <h1 className="font-cormorantGaramond text-5xl md:text-6xl text-zinc-950 max-w-2xl leading-tight">
          {TYPE_LABELS[type]} Archive
        </h1>
        <div className="mt-8 h-1 w-20 bg-zinc-900"></div>
      </header>

      <section className="mx-auto w-11/12 lg:w-3/4 pb-20">
        {broadcasts.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-zinc-200">
            <p className="text-zinc-500 text-sm">No broadcasts found in this category yet.</p>
          </div>
        ) : (
          <div className="flex flex-col border-t border-zinc-100">
            {broadcasts.map((broadcast) => (
              <Link 
                key={broadcast._id}
                href={`/archive/${type}/${broadcast.slug}`}
                className="group py-8 border-b border-zinc-100 hover:bg-zinc-50/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 -mx-4"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400 mb-2 block">
                    {new Date(broadcast.publishedAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-cormorantGaramond text-zinc-950 group-hover:text-zinc-600 transition-colors">
                    {broadcast.title}
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-950">
                  Read Archive <ArrowLongRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
