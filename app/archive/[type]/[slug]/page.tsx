import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function BroadcastViewPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  
  const broadcast = await convex.query(api.broadcasts.getBroadcastBySlug, { slug });

  if (!broadcast || broadcast.type !== type) {
    notFound();
  }

  const { data, publishedAt, title } = broadcast;

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

      <article className="mx-auto w-11/12 lg:w-1/2 pt-16 pb-20">
        <Link 
          href={`/archive/${type}`} 
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-950 transition-colors group w-fit mb-8"
        >
          <ArrowLeftIcon width={16} />
          <p className="text-xs font-bold uppercase tracking-widest">Back to {type.replace(/-/g, ' ')} Archive</p>
        </Link>
        <header className="mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4 block">
            {new Date(publishedAt).toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>
          <h1 className="font-cormorantGaramond text-5xl md:text-6xl text-zinc-950 leading-tight mb-8">
            {title}
          </h1>
          <div className="h-1 w-20 bg-zinc-900"></div>
        </header>

        <div className="prose prose-zinc prose-lg max-w-none">
          {/* Type-Specific Rendering */}
          
          {type === 'trivia' && (
            <div className="space-y-12">
              <div className="bg-zinc-50 p-8 border border-zinc-100 italic font-medium text-zinc-800">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4 not-italic">{data.breakingThread.heading}</h2>
                {data.breakingThread.content}
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-zinc-950 mb-4">{data.sutraFact.heading}</h2>
                <p className="text-zinc-600 leading-relaxed">{data.sutraFact.content}</p>
              </div>

              <div className="border-l-4 border-zinc-900 pl-8 py-2">
                <h2 className="text-xl font-bold text-zinc-950 mb-4">{data.actuarysEdge.heading}</h2>
                <p className="text-zinc-600 italic leading-relaxed">{data.actuarysEdge.content}</p>
              </div>
            </div>
          )}

          {type === 'market-pulse' && (
            <div className="space-y-12">
              <div className="bg-zinc-900 text-white p-10">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">{data.macroView.heading}</h2>
                <p className="text-2xl font-cormorantGaramond leading-relaxed text-zinc-100">{data.macroView.content}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-zinc-950 mb-4">{data.actuarialAngle.heading}</h2>
                <p className="text-zinc-600 leading-relaxed">{data.actuarialAngle.content}</p>
              </div>

              <div className="p-8 border-2 border-dashed border-zinc-100">
                <h2 className="text-xl font-bold text-zinc-950 mb-4">{data.riskRadar.heading}</h2>
                <p className="text-zinc-600 italic leading-relaxed">{data.riskRadar.content}</p>
              </div>
            </div>
          )}

          {type === 'code-sutra' && (
            <div className="space-y-12">
              <div>
                <h2 className="text-xl font-bold text-zinc-950 mb-4">{data.theChallenge.heading}</h2>
                <p className="text-zinc-600 leading-relaxed">{data.theChallenge.content}</p>
              </div>

              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">{data.sutraSnippet.heading}</h2>
                <div className="bg-zinc-950 rounded-lg p-6 overflow-x-auto shadow-2xl">
                  <pre className="text-zinc-300 font-mono text-sm leading-relaxed">
                    <code>{data.sutraSnippet.content.replace(/```[a-z]*\n|```/g, '')}</code>
                  </pre>
                </div>
              </div>

              <div className="bg-zinc-50 p-8 border border-zinc-100 flex items-start gap-4">
                <div className="p-2 bg-zinc-900 text-white rounded">
                  <span className="text-xs font-bold">PRO</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-2">{data.efficiencyGain.heading}</h2>
                  <p className="text-zinc-600 text-sm italic">{data.efficiencyGain.content}</p>
                </div>
              </div>
            </div>
          )}

          {type === 'genai-frontiers' && (
            <div className="space-y-12">
              <div className="border-y border-zinc-100 py-12">
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">{data.executiveSummary.heading}</h2>
                <p className="text-3xl font-cormorantGaramond leading-tight text-zinc-900">{data.executiveSummary.content}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-zinc-950 mb-6">{data.deepDive.heading}</h2>
                <div className="text-zinc-600 leading-relaxed space-y-4">
                   {data.deepDive.content.split('\n').map((para: string, i: number) => (
                     <p key={i}>{para}</p>
                   ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-zinc-50 p-8">
                   <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">{data.marketPulse.heading}</h2>
                   <p className="text-zinc-700 text-sm leading-relaxed mb-0">{data.marketPulse.content}</p>
                 </div>
                 <div className="bg-zinc-900 text-white p-8">
                   <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">{data.theVerdict.heading}</h2>
                   <p className="text-zinc-100 text-xl font-cormorantGaramond italic leading-relaxed mb-0">"{data.theVerdict.content}"</p>
                 </div>
              </div>
            </div>
          )}

        </div>

        <div className="mt-16 pt-10 border-t border-zinc-100 text-center">
           <Link href="/archive" className="text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors">
             Explore all Archives
           </Link>
        </div>
      </article>
    </main>
  );
}
