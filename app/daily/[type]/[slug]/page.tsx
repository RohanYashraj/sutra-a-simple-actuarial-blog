import Link from "next/link";
import { notFound } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export default async function BroadcastDetailPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const broadcast = await convex.query(api.broadcasts.getBroadcastBySlug, { slug });

  if (!broadcast || broadcast.type !== type) {
    notFound();
  }

  const data = broadcast.data;

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
            <Link href="/" className="nav-link text-zinc-500 hover:text-zinc-950 transition-colors">Home</Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <article className="mx-auto w-11/12 lg:w-1/2 pt-24 pb-32">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">
            {broadcast.type.replace('-', ' ')} • {new Date(broadcast.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <h1 className="font-cormorantGaramond text-4xl md:text-5xl lg:text-6xl text-zinc-950 leading-tight">
            {broadcast.title}
          </h1>
          <div className="mt-8 h-1 w-20 bg-zinc-900 mx-auto"></div>
        </div>

        <div className="prose prose-zinc prose-lg max-w-none">
          {type === 'trivia' && (
            <div className="space-y-12">
               <div className="p-8 bg-zinc-50 rounded-xl border border-zinc-100">
                 <h2 className="text-xl font-bold text-zinc-950 mb-4">{data.breakingThread.heading}</h2>
                 <p className="text-zinc-600 leading-relaxed">{data.breakingThread.content}</p>
               </div>
               <div>
                 <h2 className="text-xl font-bold text-zinc-950 mb-4">{data.sutraFact.heading}</h2>
                 <p className="text-zinc-600 leading-relaxed">{data.sutraFact.content}</p>
               </div>
               <div className="border-l-4 border-zinc-950 pl-6 py-2">
                 <h2 className="text-xl font-bold text-zinc-950 mb-4">{data.actuarysEdge.heading}</h2>
                 <p className="text-zinc-600 italic leading-relaxed">{data.actuarysEdge.content}</p>
               </div>
            </div>
          )}

          {type === 'market-pulse' && (
            <div className="space-y-12">
               <div className="p-8 bg-zinc-50 rounded-xl border border-zinc-100">
                 <h2 className="text-xl font-bold text-zinc-950 mb-4">{data.macroView.heading}</h2>
                 <p className="text-zinc-600 leading-relaxed">{data.macroView.content}</p>
               </div>
               <div>
                 <h2 className="text-xl font-bold text-zinc-950 mb-4">{data.actuarialAngle.heading}</h2>
                 <p className="text-zinc-600 leading-relaxed">{data.actuarialAngle.content}</p>
               </div>
               <div className="border-l-4 border-zinc-950 pl-6 py-2">
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
               <div className="p-8 bg-zinc-950 rounded-xl text-zinc-100 font-mono text-sm overflow-x-auto">
                 <h3 className="text-zinc-500 uppercase tracking-widest text-xs mb-4 border-b border-zinc-800 pb-2">
                   {data.sutraSnippet.heading} ({data.sutraSnippet.language})
                 </h3>
                 <pre className="text-white whitespace-pre-wrap">{data.sutraSnippet.content.replace(/```[a-z]*\n|```/g, '')}</pre>
               </div>
               <div className="p-6 border border-dashed border-zinc-300 rounded-xl">
                 <h2 className="text-xl font-bold text-zinc-950 mb-4">{data.efficiencyGain.heading}</h2>
                 <p className="text-zinc-600 italic leading-relaxed">{data.efficiencyGain.content}</p>
               </div>
            </div>
          )}

          {type === 'genai-frontiers' && (
            <div className="space-y-12">
               <div className="p-8 bg-zinc-950 text-white rounded-xl">
                 <h2 className="text-xl font-bold text-zinc-400 mb-4 uppercase tracking-widest">{data.executiveSummary.heading}</h2>
                 <p className="text-lg leading-relaxed">{data.executiveSummary.content}</p>
               </div>
               <div>
                 <h2 className="text-xl font-bold text-zinc-950 mb-4">{data.deepDive.heading}</h2>
                 <p className="text-zinc-600 leading-relaxed">{data.deepDive.content}</p>
               </div>
               <div className="p-8 bg-zinc-50 rounded-xl border border-zinc-100">
                 <h2 className="text-xl font-bold text-zinc-950 mb-4">{data.marketPulse.heading}</h2>
                 <p className="text-zinc-600 leading-relaxed">{data.marketPulse.content}</p>
               </div>
               <div className="text-center py-12 border-y border-zinc-100 italic">
                 <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">{data.theVerdict.heading}</h2>
                 <p className="text-2xl font-bold text-zinc-950">"{data.theVerdict.content}"</p>
               </div>
            </div>
          )}

          {type === 'digest' && (
            <div className="space-y-12">
               <p className="text-zinc-600 text-center text-lg font-light mb-12">
                 The latest stories from the Sutra blog.
               </p>
               <div className="space-y-8">
                 {data.articles.map((article: any) => (
                   <div key={article.id} className="group">
                     <Link href={`/actuarial/${article.id}`} className="block">
                       <h3 className="text-2xl font-bold text-zinc-950 group-hover:text-zinc-600 transition-colors mb-2">
                         {article.title}
                       </h3>
                       <p className="text-zinc-500 line-clamp-2">{article.description}</p>
                       <div className="mt-4 flex items-center gap-2">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{article.date}</span>
                         <span className="text-zinc-900 text-[10px] font-bold uppercase tracking-widest">Read More &rarr;</span>
                       </div>
                     </Link>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>

        <div className="mt-24 pt-12 border-t border-zinc-100 text-center">
          <Link href={`/archive/${type}`} className="text-sm font-bold uppercase tracking-widest text-zinc-900 hover:underline">
            &larr; Back to {type.replace('-', ' ')} Archive
          </Link>
        </div>
      </article>
    </main>
  );
}
