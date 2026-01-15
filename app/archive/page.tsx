import Link from "next/link";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { 
  Zap, 
  LineChart, 
  Code2, 
  Lightbulb, 
  FileText 
} from "lucide-react";

const BROADCAST_TYPES = [
  {
    id: "trivia",
    name: "Daily Trivia",
    description: "Daily insights into actuarial history, probability, and math milestones.",
    icon: Zap,
    count: "Daily",
  },
  {
    id: "market-pulse",
    name: "Market Pulse",
    description: "Macroeconomic trends and their specific impact on insurance and risk.",
    icon: LineChart,
    count: "Daily",
  },
  {
    id: "code-sutra",
    name: "Code Sutra",
    description: "Elegant code snippets and technical solutions for actuarial modeling.",
    icon: Code2,
    count: "Daily",
  },
  {
    id: "genai-frontiers",
    name: "GenAI Frontiers",
    description: "Forward-looking deep dives into AI agents and the future of actuarial work.",
    icon: Lightbulb,
    count: "Daily",
  },
];

export default function ArchivePage() {
  return (
    <main className="min-h-screen font-outfit">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-zinc-100">
        <div className="mx-auto w-11/12 lg:w-3/4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-zinc-950">
            sutra<span className="text-zinc-400">.</span> archive
          </Link>
          <div className="flex gap-8 text-sm font-medium">
            <Link href="/about" className="nav-link text-zinc-500 hover:text-zinc-950 transition-colors">About</Link>
            <Link href="https://www.rohanyashraj.com/contact" className="nav-link text-zinc-500 hover:text-zinc-950 transition-colors">Contact</Link>
          </div>
        </div>
      </nav>

      <header className="mx-auto w-11/12 lg:w-3/4 pt-24 pb-16">
        <h1 className="font-cormorantGaramond text-5xl md:text-6xl text-zinc-950 max-w-2xl leading-tight">
          The Sutra Archives
        </h1>
        <p className="mt-6 text-zinc-500 text-lg max-w-xl">
          Explore our collection of daily insights, market analysis, and technical snippets.
        </p>
        <div className="mt-8 h-1 w-20 bg-zinc-900"></div>
      </header>

      <section className="mx-auto w-11/12 lg:w-3/4 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BROADCAST_TYPES.map((type) => (
            <Link 
              key={type.id}
              href={`/archive/${type.id}`}
              className="group p-8 border border-zinc-100 hover:border-zinc-900 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="mb-6 inline-flex p-3 bg-zinc-50 group-hover:bg-zinc-900 transition-colors duration-300">
                  <type.icon className="w-6 h-6 text-zinc-900 group-hover:text-white" />
                </div>
                <h2 className="text-xl font-bold text-zinc-950 mb-3">{type.name}</h2>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                  {type.description}
                </p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-50">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400">
                  {type.count} Updates
                </span>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-950 group-hover:gap-2 transition-all">
                  Browse <ArrowLongRightIcon className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
