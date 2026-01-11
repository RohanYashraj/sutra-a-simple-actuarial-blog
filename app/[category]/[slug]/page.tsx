import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "@heroicons/react/24/solid"
import moment from "moment"
import { getArticleData, getSortedArticles } from "@/lib/articles"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ category: string; slug: string }>
}

// Helper to convert category to URL-friendly slug
const categoryToSlug = (category: string) => category.toLowerCase().replace(/\s+/g, '-')

// Generate static paths for all articles with category
export async function generateStaticParams() {
  const articles = getSortedArticles()
  return articles.map((article) => ({
    category: categoryToSlug(article.category),
    slug: article.id,
  }))
}

// Generate dynamic metadata for each article
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  
  try {
    const articleData = await getArticleData(resolvedParams.slug)
    const publishDate = moment(articleData.date, "DD-MM-YYYY").toISOString()
    const categorySlug = categoryToSlug(articleData.category)
    const description = articleData.description || 
      `Read "${articleData.title}" - an actuarial blog post on Sutra exploring insights about ${articleData.category.toLowerCase()}.`
    
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
            url: articleData.authorImage || "/logo.png",
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
        images: [articleData.authorImage || "/logo.png"],
      },
      alternates: {
        canonical: `https://sutra.rohanyashraj.com/${categorySlug}/${resolvedParams.slug}`,
      },
    }
  } catch {
    return {
      title: "Article Not Found",
    }
  }
}

const Article = async (props: Props) => {
  const params = await props.params;
  
  let articleData;
  try {
    articleData = await getArticleData(params.slug)
    // Verify category matches
    const expectedCategorySlug = categoryToSlug(articleData.category)
    if (params.category !== expectedCategorySlug) {
      notFound()
    }
  } catch {
    notFound()
  }

  const publishDate = moment(articleData.date, "DD-MM-YYYY").toISOString()
  const categorySlug = categoryToSlug(articleData.category)
  const description = articleData.description || 
    `Read "${articleData.title}" - an actuarial blog post on Sutra exploring insights about ${articleData.category.toLowerCase()}.`

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
    keywords: ["actuarial", "actuarial blog", articleData.category.toLowerCase()],
  }

  // JSON-LD BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://sutra.rohanyashraj.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": articleData.category,
        "item": `https://sutra.rohanyashraj.com/${categorySlug}` /* Note: Category pages need to exist or redirect */
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": articleData.title,
        "item": `https://sutra.rohanyashraj.com/${categorySlug}/${params.slug}`
      }
    ]
  }

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
      <main className="min-h-screen font-outfit bg-white">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-zinc-100">
          <div className="mx-auto w-11/12 lg:w-3/4 h-16 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-zinc-950">
              sutra<span className="text-zinc-400">.</span>
            </Link>
            <div className="flex gap-8 text-sm font-medium">
              <Link href="/about" className="nav-link text-zinc-500 hover:text-zinc-950 transition-colors">About</Link>
              <Link href="https://www.rohanyashraj.com/contact" className="nav-link text-zinc-500 hover:text-zinc-950 transition-colors">Contact</Link>
            </div>
          </div>
        </nav>

        <section className="mx-auto w-11/12 md:w-3/4 lg:w-7/12 py-24 flex flex-col gap-12">
          <div className="flex flex-col gap-16">
            <Link 
              href={"/"} 
              className="flex items-center gap-2 text-zinc-400 hover:text-zinc-950 transition-colors group w-fit"
            >
              <ArrowLeftIcon width={16} />
              <p className="text-xs font-bold uppercase tracking-widest">Back to Homepage</p>
            </Link>
            
            <div className="flex flex-col gap-8">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-950 leading-[1.05]">
                {articleData.title}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden">
                  <img 
                    src={articleData.authorImage || "/authors/profile-placeholder.svg"}  
                    alt={articleData.author || "Author"}
                    className="object-cover w-full h-full transition-all duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-bold text-sm text-zinc-950 tracking-tight">{articleData.author || "Sutra Contributor"}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mt-1">
                    {moment(articleData.date, "DD-MM-YYYY").format('MMMM D, YYYY')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <article
            className="article border-t border-zinc-100 pt-16"
            dangerouslySetInnerHTML={{ __html: articleData.contentHtml }}
          />
        </section>
      </main>
    </>
  )
}

export default Article
