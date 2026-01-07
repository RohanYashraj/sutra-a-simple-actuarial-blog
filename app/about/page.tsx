import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/24/solid"

export default function AboutPage() {
  return (
    <main className="min-h-screen font-outfit bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-zinc-100">
        <div className="mx-auto w-11/12 lg:w-3/4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-zinc-950">
            sutra<span className="text-zinc-400">.</span>
          </Link>
          <div className="flex gap-8 text-sm font-medium">
            <Link href="/about" className="text-zinc-950">About</Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto w-11/12 md:w-3/4 lg:w-2/5 py-24 flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <Link 
            href={"/"} 
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-950 transition-colors group w-fit"
          >
            <ArrowLeftIcon width={16} />
            <p className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</p>
          </Link>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-950 leading-none">
            About Sutra<span className="text-zinc-200">.</span>
          </h1>
        </div>

        <div className="flex flex-col gap-12 text-zinc-800 text-lg leading-relaxed">
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">The Purpose</h2>
            <p>
              Sutra was created as a minimalist digital space to explore the intersection of 
              <strong> Actuarial Science</strong>, <strong>Artificial Intelligence</strong>, and <strong>Modern Technology</strong>. 
              The goal is to distill complex topics into clear, concise "sutras" or threads of thought that provoke curiosity and meaningful discussion.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">About Me</h2>
            <p className="text-2xl font-medium text-zinc-950 tracking-tight">
              I'm Rohan Yashraj Gupta.
            </p>
            <p>
              I am an enthusiast who is always looking to find something exciting at the edge of what's possible. Whether it's dissecting risk models or experimenting with the latest generative AI, my journey is driven by a constant search for innovation and a desire to understand how technology reshapes our world.
            </p>
          </div>

          <div className="pt-8 border-t border-zinc-100">
            <p className="text-sm text-zinc-400 italic">
              "distilling complexity into clarity."
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
