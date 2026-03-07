import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleData, getSortedArticles } from "@/lib/articles";
import { sanitizeSlug } from "@/lib/slug";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

// Generate static paths for all articles with category
export async function generateStaticParams() {
  const articles = getSortedArticles();
  return articles.map((article) => ({
    category: sanitizeSlug(article.category),
    slug: article.id,
  }));
}

// Generate dynamic metadata for each article
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  try {
    const articleData = await getArticleData(resolvedParams.slug);
    const [day, month, year] = articleData.date.split("-");
    const publishDate = new Date(`${year}-${month}-${day}`).toISOString();
    const categorySlug = sanitizeSlug(articleData.category);
    const description =
      articleData.description ||
      `Read "${articleData.title}" - an actuarial blog post on Sutra exploring insights about ${articleData.category.toLowerCase()}.`;

    return {
      title: articleData.title,
      description,
      authors: articleData.author ? [{ name: articleData.author }] : undefined,
      openGraph: {
        type: "article",
        title: articleData.title,
        description,
        url: `https://sutra.rohanyashraj.com/${categorySlug}/${resolvedParams.slug}`,
        siteName: "Sutra - Actuarial Blog",
        publishedTime: publishDate,
        authors: articleData.author ? [articleData.author] : undefined,
        images: [
          {
            url: articleData.image || articleData.authorImage || "/logo.png",
            width: 1200,
            height: 630,
            alt: articleData.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: articleData.title,
        description,
        images: [articleData.image || articleData.authorImage || "/logo.png"],
      },
      alternates: {
        canonical: `/${categorySlug}/${resolvedParams.slug}`,
      },
    };
  } catch {
    return {
      title: "Article Not Found",
    };
  }
}

const Article = async (props: Props) => {
  const params = await props.params;

  let articleData;
  try {
    articleData = await getArticleData(params.slug);
    // Verify category matches
    const expectedCategorySlug = sanitizeSlug(articleData.category);
    if (params.category !== expectedCategorySlug) {
      notFound();
    }
  } catch {
    notFound();
  }

  const [day, month, year] = articleData.date.split("-");
  const publishDate = new Date(`${year}-${month}-${day}`).toISOString();
  const categorySlug = sanitizeSlug(articleData.category);
  const description =
    articleData.description ||
    `Read "${articleData.title}" - an actuarial blog post on Sutra exploring insights about ${articleData.category.toLowerCase()}.`;

  // JSON-LD BlogPosting Schema for rich snippets
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: articleData.title,
    description,
    url: `https://sutra.rohanyashraj.com/${categorySlug}/${params.slug}`,
    datePublished: publishDate,
    dateModified: publishDate,
    author: {
      "@type": "Person",
      name: articleData.author || "Sutra Contributor",
      url: "https://rohanyashraj.com",
    },
    publisher: {
      "@type": "Person",
      name: "Rohan Yashraj Gupta",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://sutra.rohanyashraj.com/${categorySlug}/${params.slug}`,
    },
    image: articleData.image
      ? `https://sutra.rohanyashraj.com${articleData.image}`
      : `https://sutra.rohanyashraj.com${articleData.authorImage || "/logo.png"}`,
    keywords: [
      "actuarial",
      "actuarial blog",
      "agenticai",
      "agentic AI",
      articleData.category.toLowerCase(),
    ],
  };

  // JSON-LD BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://sutra.rohanyashraj.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: articleData.category,
        item: `https://sutra.rohanyashraj.com/${categorySlug}` /* Note: Category pages need to exist or redirect */,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: articleData.title,
        item: `https://sutra.rohanyashraj.com/${categorySlug}/${params.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="min-h-screen font-outfit bg-zinc-50">
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
                href="/contribute"
                className="nav-link text-zinc-500 hover:text-zinc-950 transition-colors"
              >
                Contribute
              </Link>
            </div>
          </div>
        </nav>

        <section className="mx-auto w-11/12 max-w-[700px] pt-8 pb-0">
          <nav className="flex items-center gap-1.5 text-[13px] text-zinc-400 mb-6">
            <Link href="/" className="hover:text-zinc-600 transition-colors">
              Home
            </Link>
            <span className="text-zinc-300">/</span>
            <Link
              href={`/${categorySlug}`}
              className="hover:text-zinc-600 transition-colors"
            >
              {articleData.category}
            </Link>
          </nav>

          <h1 className="font-cormorantGaramond text-[28px] md:text-[40px] font-semibold text-zinc-950 leading-[1.2] mb-5">
            {articleData.title}
          </h1>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden flex-shrink-0">
              <img
                src={
                  articleData.authorImage || "/authors/profile-placeholder.svg"
                }
                alt={articleData.author || "Author"}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-zinc-500">
              <span className="font-medium text-zinc-700">
                {articleData.author || "Sutra Contributor"}
              </span>
              <span className="text-zinc-300">&middot;</span>
              <time>
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(`${year}-${month}-${day}`))}
              </time>
            </div>
          </div>
        </section>

        <section className="mx-auto w-11/12 max-w-[700px] pt-8 pb-20">
          <hr className="border-zinc-200 mb-8" />
          <article
            className="article"
            dangerouslySetInnerHTML={{ __html: articleData.contentHtml }}
          />
        </section>
      </main>
    </>
  );
};

export default Article;
