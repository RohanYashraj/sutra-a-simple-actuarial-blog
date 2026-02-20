import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleItemList from "@/components/ArticleListItem";
import { getCategorisedArticles } from "@/lib/articles";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { sanitizeSlug } from "@/lib/slug";
import type { Metadata } from "next";

interface Props {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const category = resolvedParams.category;
  // Capitalize first letter for title
  const displayCategory =
    category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ");

  return {
    title: `${displayCategory} Articles`,
    description: `Explore all articles in the ${displayCategory} category on Sutra - Actuarial Blog.`,
    alternates: {
      canonical: `/${category}`,
    },
  };
}

const CategoryPage = async (props: Props) => {
  const params = await props.params;
  const articles = getCategorisedArticles();

  if (!articles) return notFound();

  // Find the category that matches the slug
  const categoryName = Object.keys(articles).find(
    (cat) => sanitizeSlug(cat) === params.category,
  );

  if (!categoryName) return notFound();

  const categoryArticles = articles[categoryName];

  return (
    <main className="min-h-screen font-outfit bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-zinc-100">
        <div className="mx-auto w-11/12 lg:w-3/4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tighter text-zinc-950"
          >
            sutra<span className="text-zinc-400">.</span>
          </Link>
          <div className="flex gap-8 text-sm font-medium">
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

      <section className="mx-auto w-11/12 lg:w-3/4 py-12 flex flex-col gap-12">
        <Link
          href={"/"}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-950 transition-colors group w-fit"
        >
          <ArrowLeftIcon width={16} />
          <p className="text-xs font-bold uppercase tracking-widest">
            Back to Homepage
          </p>
        </Link>

        <ArticleItemList
          category={categoryName}
          articles={categoryArticles}
          hideViewAllLink={true}
        />
      </section>
    </main>
  );
};

export default CategoryPage;
