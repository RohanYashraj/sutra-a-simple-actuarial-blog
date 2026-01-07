import Link from "next/link"
import moment from "moment"

import type { ArticleItem } from "@/types"

interface Props {
  category: string
  articles: ArticleItem[]
}

const ArticleItemList = ({ category, articles }: Props) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-16">
      {/* Category Sidebar */}
      <div className="md:w-1/4">
        <div className="sticky top-24">
          <h2 className="font-cormorantGaramond text-4xl text-zinc-900 capitalize tracking-tight leading-none">
            {category}
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-px w-8 bg-zinc-200"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {articles.length} {articles.length === 1 ? 'Blog' : 'Blogs'}
            </span>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="md:w-3/4 flex flex-col gap-12 font-outfit">
        {articles.map((article, id) => (
          <Link
            href={`/${article.id}`}
            key={id}
            className="group flex flex-col gap-2"
          >
            <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-950 group-hover:text-zinc-600 transition-colors">
              {article.title}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400">
                {moment(article.date, "DD-MM-YYYY").format('MMMM D, YYYY')}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400 group-hover:text-zinc-600 transition-colors">Read Blog Post →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ArticleItemList
