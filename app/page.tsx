import Link from "next/link"
import ArticleItemList from "@/components/ArticleListItem"
import { getCategorisedArticles, getSortedArticles } from "@/lib/articles"
import Hero from "@/components/Hero"

const HomePage = () => {
  const articles = getCategorisedArticles()
  const recentArticles = getSortedArticles().slice(0, 3)

  return (
    <main className="min-h-screen font-outfit">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-zinc-100">
        <div className="mx-auto max-w-6xl w-11/12 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-zinc-950">
            sutra<span className="text-zinc-400">.</span>
          </Link>
          <div className="flex gap-8 text-sm font-medium">
            <Link href="/archive" className="nav-link text-zinc-500 hover:text-zinc-950 transition-colors">Archive</Link>
            <Link href="/about" className="nav-link text-zinc-500 hover:text-zinc-950 transition-colors">About</Link>
            <Link href="https://www.rohanyashraj.com/contact" className="nav-link text-zinc-500 hover:text-zinc-950 transition-colors">Contact</Link>
          </div>
        </div>
      </nav>

      <Hero />

      {/* Articles Section */}
      <section className="mx-auto max-w-6xl w-11/12 pb-20">
        <div className="flex flex-col gap-8">
          
          {/* Recent Articles */}
          <ArticleItemList 
            category="Recent" 
            articles={recentArticles} 
          />

          {/* Archive CTA */}
          <div className="bg-zinc-950 text-white p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 group">
            <div className="max-w-xl">
              <h2 className="font-cormorantGaramond text-4xl mb-4 text-zinc-100 italic">The Sutra Insight Archive</h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Explore our full history of high-impact actuarial insights, AI deep dives, and market pulse updates.
              </p>
            </div>
            <Link 
              href="/archive" 
              className="px-8 py-4 bg-white text-zinc-950 font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-colors"
            >
              Browse The Archives
            </Link>
          </div>

          {/* Categorised Articles */}
          {articles !== null &&
            Object.keys(articles).map((category) => (
              <ArticleItemList
                category={category}
                articles={articles[category].slice(0, 3)}
                key={category}
              />
            ))}
        </div>
      </section>
    </main>
  )
}

export default HomePage
