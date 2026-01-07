import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "@heroicons/react/24/solid"
import moment from "moment"
import { getArticleData } from "@/lib/articles"

const Article = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  
  let articleData;
  try {
    articleData = await getArticleData(params.slug)
  } catch (e) {
    notFound()
  }

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

      <section className="mx-auto w-11/12 md:w-3/4 lg:w-2/5 py-24 flex flex-col gap-12">
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
  )
}

export default Article
