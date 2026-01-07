import Link from "next/link"
import ArticleItemList from "@/components/ArticleListItem"
import { getCategorisedArticles } from "@/lib/articles"

const HomePage = () => {
  const articles = getCategorisedArticles()

  return (
    <main className="min-h-screen font-outfit">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-zinc-100">
        <div className="mx-auto w-11/12 lg:w-3/4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-zinc-950">
            sutra<span className="text-zinc-400">.</span>
          </Link>
          <div className="flex gap-8 text-sm font-medium">
            <Link href="/about" className="nav-link">About</Link>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <header className="mx-auto w-11/12 lg:w-3/4 pt-24 pb-16">
        <h1 className="font-cormorantGaramond text-5xl md:text-6xl text-zinc-950 max-w-2xl leading-tight">
          A simple actuarial blog, exploring numbers, AI, and the human side of tech.
        </h1>
        <div className="mt-8 h-1 w-20 bg-zinc-900"></div>
      </header>

      {/* Articles Section */}
      <section className="mx-auto w-11/12 lg:w-3/4 pb-32">
        <div className="flex flex-col gap-24">
          {articles !== null &&
            Object.keys(articles).map((category) => (
              <ArticleItemList
                category={category}
                articles={articles[category]}
                key={category}
              />
            ))}
        </div>
      </section>
    </main>
  )
}

export default HomePage
