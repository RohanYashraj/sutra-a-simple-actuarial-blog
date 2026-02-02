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
      
      <div ref={containerRef} className="group relative overflow-hidden bg-zinc-950 text-white rounded-sm p-8 md:p-16 isolate">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-125 pointer-events-none mix-blend-overlay"></div>
        
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 p-[1px] rounded-sm bg-gradient-to-br from-zinc-800 via-zinc-950 to-zinc-800 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10">
           <div className="w-full h-full bg-zinc-950 rounded-sm"></div>
        </div>

        <div className="relative z-10 flex flex-col gap-8 max-w-3xl transform group-hover:translate-x-2 transition-transform duration-500 ease-out">
           <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400 transition-colors">
             <span className="bg-zinc-900 px-2 py-1 rounded-sm border border-zinc-800">{article.category}</span>
             <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
             <span>{formatDate(article.date)}</span>
           </div>
           
           <h2 className="font-cormorantGaramond text-5xl md:text-7xl font-medium leading-[0.9] tracking-tight text-zinc-100 group-hover:text-white transition-colors">
             <Link href={`/${sanitizeSlug(article.category)}/${article.id}`}>
               <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent group-hover:to-white transition-all duration-500">
                 {article.title}
               </span>
             </Link>
           </h2>
           
           <div className="h-px w-24 bg-gradient-to-r from-zinc-700 to-transparent group-hover:w-48 transition-all duration-700 delay-100" />

           <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
             {article.description}
           </p>
           
           <Link 
             href={`/${sanitizeSlug(article.category)}/${article.id}`} 
             className="inline-flex items-center gap-3 mt-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-300 hover:text-white transition-colors group/link"
           >
             Read Article
             <ArrowLongRightIcon className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
           </Link>
        </div>
        
        {/* Decorative background circle - Enhanced */}
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-br from-zinc-800/20 to-transparent rounded-full blur-3xl group-hover:scale-105 transition-transform duration-1000 ease-in-out -z-10"></div>
      </div>
    </section>
  )
}

export default FeaturedArticle
