"use client"

import Link from "next/link"
import { ArrowLongRightIcon } from "@heroicons/react/24/outline"
import { sanitizeSlug } from "@/lib/slug"
import { formatDate } from "@/lib/utils"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { ArticleItem } from "@/types"

gsap.registerPlugin(ScrollTrigger)

interface Props {
  articles: ArticleItem[]
  title?: string
}

const ArticleGrid = ({ articles, title = "Recent Insights" }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".grid-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%"
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="mx-auto max-w-6xl w-11/12 mb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-zinc-100 pb-8 gap-4">
        <h2 className="font-cormorantGaramond text-4xl text-zinc-950 italic">
          {title}
        </h2>
        {/* Optional decorative line or link could go here */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {articles.map((article) => (
          <article key={article.id} className="grid-item group flex flex-col h-full justify-between">
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                 <span className="text-zinc-950">{article.category}</span>
                 <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                 <span>{formatDate(article.date)}</span>
               </div>
               
               <Link href={`/${sanitizeSlug(article.category)}/${article.id}`}>
                 <h3 className="text-2xl font-semibold leading-tight text-zinc-950 group-hover:text-zinc-600 transition-colors">
                   {article.title}
                 </h3>
               </Link>
               
               <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                 {article.description}
               </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-zinc-100">
              <Link 
                href={`/${sanitizeSlug(article.category)}/${article.id}`}
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-950 group-hover:text-zinc-600 transition-colors"
              >
                Read 
                <ArrowLongRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ArticleGrid
