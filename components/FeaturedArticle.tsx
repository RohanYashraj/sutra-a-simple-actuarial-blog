"use client"

import Link from "next/link"
import { ArrowLongRightIcon } from "@heroicons/react/24/outline"
import { sanitizeSlug } from "@/lib/slug"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { ArticleItem } from "@/types"

gsap.registerPlugin(ScrollTrigger)

interface Props {
  article: ArticleItem
}

const FeaturedArticle = ({ article }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%"
          }
        }
      )
    }, containerRef)
    
    return () => ctx.revert()
  }, [])

  return (
    <section className="mx-auto max-w-6xl w-11/12 mb-20">
      <div className="flex items-center gap-4 mb-8">
        <span className="h-px bg-zinc-200 flex-grow"></span>
        <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Featured Insight</span>
        <span className="h-px bg-zinc-200 flex-grow"></span>
      </div>
      
      <div ref={containerRef} className="group relative overflow-hidden bg-zinc-950 text-white rounded-sm p-8 md:p-16">
        <div className="relative z-10 flex flex-col gap-6 max-w-3xl">
           <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-400">
             <span>{article.category}</span>
             <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
             <span>{article.date}</span>
           </div>
           
           <h2 className="font-cormorantGaramond text-4xl md:text-6xl font-medium leading-none tracking-tight group-hover:text-zinc-300 transition-colors">
             <Link href={`/${sanitizeSlug(article.category)}/${article.id}`}>
               {article.title}
             </Link>
           </h2>
           
           <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl">
             {article.description}
           </p>
           
           <Link 
             href={`/${sanitizeSlug(article.category)}/${article.id}`} 
             className="inline-flex items-center gap-2 mt-4 text-sm font-bold uppercase tracking-widest text-white hover:text-zinc-300 transition-colors"
           >
             Read Article
             <ArrowLongRightIcon className="w-4 h-4" />
           </Link>
        </div>
        
        {/* Decorative background circle */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-zinc-800/30 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
      </div>
    </section>
  )
}

export default FeaturedArticle
