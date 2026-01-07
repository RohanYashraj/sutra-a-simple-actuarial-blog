import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen font-outfit bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-zinc-100">
        <div className="mx-auto w-11/12 lg:w-3/4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-zinc-950">
            sutra<span className="text-zinc-400">.</span>
          </Link>
          <div className="flex gap-8 text-sm font-medium">
            <Link href="/about" className="nav-link text-zinc-500 hover:text-zinc-950 transition-colors">About</Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto w-11/12 lg:w-3/4 pt-32 flex flex-col items-center text-center">
        <h1 className="font-cormorantGaramond text-[10rem] md:text-[15rem] leading-none text-zinc-100 font-bold select-none">
          404
        </h1>
        <div className="-mt-12 md:-mt-20 flex flex-col items-center gap-6">
          <h2 className="font-cormorantGaramond text-4xl md:text-5xl text-zinc-950">
            Lost in words?
          </h2>
          <p className="text-zinc-500 max-w-md text-lg leading-relaxed">
            The article or page you are looking for has either been archived or moved to a different chapter.
          </p>
          <Link 
            href="/" 
            className="mt-8 px-10 py-4 bg-zinc-950 text-white text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all duration-300"
          >
            Return to Homepage
          </Link>
        </div>
      </section>
    </main>
  )
}
