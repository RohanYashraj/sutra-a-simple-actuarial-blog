import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/24/solid"
import moment from "moment"
import { getArticleData } from "@/lib/articles"

const Article = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const articleData = await getArticleData(params.slug)

  return (
    <section className="mx-auto w-10/12 md:w-1/2 mt-20 flex flex-col gap-5">
      <div className="flex flex-col gap-8 font-poppins">
        <Link href={"/"} className="flex flex-row gap-1 place-items-center text-zinc-500 hover:text-zinc-800 transition-colors">
          <ArrowLeftIcon width={20} />
          <p>back to home</p>
        </Link>
        
        <div className="border-b pb-8">
          <h1 className="text-5xl md:text-6xl mb-6 tracking-tight text-zinc-900">
            {articleData.title}
          </h1>
          
          <div className="flex flex-row items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-full ring-2 ring-zinc-100">
              <img 
                src={articleData.authorImage || "/authors/profile-placeholder.svg"}  
                alt={articleData.author || "Author"}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col">
              <p className="font-bold text-sm text-zinc-900">{articleData.author || "Unknown Author"}</p>
              <p className="text-xs text-zinc-500">{moment(articleData.date).format('MMM D, YYYY')}</p>
            </div>
          </div>
        </div>
      </div>
      <article
        className="article"
        dangerouslySetInnerHTML={{ __html: articleData.contentHtml }}
      />
    </section>
  )
}

export default Article
