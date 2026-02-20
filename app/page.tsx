import Link from "next/link";
import { getCategorisedArticles, getSortedArticles } from "@/lib/articles";
import Hero from "@/components/Hero";
import FeaturedArticle from "@/components/FeaturedArticle";
import ArticleGrid from "@/components/ArticleGrid";
import CategorySection from "@/components/CategorySection";

const HomePage = () => {
  const articles = getCategorisedArticles();
  const allArticles = getSortedArticles();

  // Logic:
  // 1. Featured: The very latest article
  // 2. Recent: The next 3 articles
  // 3. Categories: All remaining functionality

  const featuredArticle = allArticles[0];
  const recentArticles = allArticles.slice(1, 4);

  return (
    <main className="min-h-screen font-outfit bg-zinc-50">
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
            <Link
              href="https://www.rohanyashraj.com/contact"
              className="nav-link text-zinc-500 hover:text-zinc-950 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

      <Hero />

      {/* Featured Section */}
      {featuredArticle && <FeaturedArticle article={featuredArticle} />}

      {/* Recent Grid */}
      {recentArticles.length > 0 && <ArticleGrid articles={recentArticles} />}

      {/* Archive CTA */}
      <section className="mx-auto max-w-6xl w-11/12 mb-20">
        <div className="bg-zinc-950 text-white p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 group rounded-sm">
          <div className="max-w-xl">
            <h2 className="font-cormorantGaramond text-4xl mb-4 text-zinc-100 italic">
              The Sutra Insight Archive
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Explore our full history of high-impact actuarial insights, AI
              deep dives, and market pulse updates.
            </p>
          </div>
          <Link
            href="/archive"
            className="px-8 py-4 bg-white text-zinc-950 font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-colors"
          >
            Browse The Archives
          </Link>
        </div>
      </section>

      {/* Categorised Sections */}
      <div className="bg-white py-20">
        {articles !== null &&
          Object.keys(articles).map((category) => (
            <CategorySection
              key={category}
              category={category}
              articles={articles[category].slice(0, 4)}
            />
          ))}
      </div>
    </main>
  );
};

export default HomePage;
