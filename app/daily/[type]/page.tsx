import Link from "next/link";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ type: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  
  const getTypeName = (t: string) => {
    switch (t) {
      case 'trivia': return 'Sutra Insight';
      case 'market-pulse': return 'Market Pulse';
      case 'code-sutra': return 'Code Sutra';
      case 'genai-frontiers': return 'GenAI Frontiers';
      case 'digest': return 'Daily Digest';
      default: return 'Archive';
    }
  };

  return {
    title: `${getTypeName(type)} History`,
    description: `Browse the daily history of ${getTypeName(type)} on Sutra - Actuarial Blog.`,
    alternates: {
      canonical: `/archive/${type}`,
    },
  };
}

export default async function ArchiveTypePage({
  params,
}: Props) {
  const { type } = await params;
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const broadcasts = await convex.query(api.broadcasts.getBroadcastsByType, { type });

  const getTypeName = (t: string) => {
    switch (t) {
      case 'trivia': return 'Sutra Insight';
      case 'market-pulse': return 'Market Pulse';
      case 'code-sutra': return 'Code Sutra';
      case 'genai-frontiers': return 'GenAI Frontiers';
      case 'digest': return 'Daily Digest';
      default: return 'Archive';
    }
  };

  return (
    <main className="min-h-screen font-outfit">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-zinc-100">
        <div className="mx-auto w-11/12 lg:w-3/4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-zinc-950">
            sutra<span className="text-zinc-400">.</span>
          </Link>
          <div className="flex gap-8 text-sm font-medium">
            <Link href="/archive" className="nav-link text-zinc-500 hover:text-zinc-950 transition-colors">Archive</Link>
            <Link href="/about" className="nav-link text-zinc-500 hover:text-zinc-950 transition-colors">About</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="mx-auto w-11/12 lg:w-3/4 pt-24 pb-16">
        <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4">
          <Link href="/archive" className="hover:text-zinc-900">Archive</Link>
          <span>/</span>
          <span className="text-zinc-900">{getTypeName(type)}</span>
        </div>
        <h1 className="font-cormorantGaramond text-5xl md:text-6xl text-zinc-950 max-w-2xl leading-tight">
          {getTypeName(type)} History
        </h1>
        <div className="mt-8 h-1 w-20 bg-zinc-900"></div>
      </header>

      {/* List */}
      <section className="mx-auto w-11/12 lg:w-3/4 pb-32">
        {broadcasts.length === 0 ? (
          <div className="py-20 text-center border border-zinc-100 rounded-xl">
            <p className="text-zinc-500">No archived updates yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {broadcasts.map((broadcast) => (
              <Link 
                key={broadcast._id}
                href={`/archive/${type}/${broadcast.slug}`}
                className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-zinc-100 hover:border-zinc-300 transition-all rounded-xl"
              >
                <div>
                  <h2 className="text-lg font-bold text-zinc-950 group-hover:text-zinc-600 transition-colors">
                    {broadcast.title}
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mt-1">
                    {new Date(broadcast.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <span className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 transition-colors">
                  Read Update &rarr;
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
