"use client";

import Link from "next/link";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { sanitizeSlug } from "@/lib/slug";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { ArticleItem } from "@/types";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface Props {
  category: string;
  articles: ArticleItem[];
  hideViewAllLink?: boolean;
}

// Helper to convert category to URL-friendly slug
const categoryToSlug = (category: string) => sanitizeSlug(category);

const ArticleItemList = ({ category, articles, hideViewAllLink }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger animation for articles
      gsap.fromTo(
        ".article-item",
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%", // Start animation when top of container hits 80% of viewport
            toggleActions: "play none none reverse",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col md:flex-row gap-8 md:gap-16 border-t border-zinc-100 pt-10 first:border-t-0 first:pt-0"
    >
      {/* Category Sidebar */}
      <div className="md:w-1/4">
        <div className="sticky top-24 flex flex-col gap-4">
          {category === "Recent" ? (
            <h2 className="font-cormorantGaramond text-3xl md:text-4xl text-zinc-900 capitalize tracking-tight leading-none">
              {category}
            </h2>
          ) : (
            <Link href={`/${categoryToSlug(category)}`} className="group">
              <h2 className="font-cormorantGaramond text-3xl md:text-4xl text-zinc-900 capitalize tracking-tight leading-none group-hover:text-zinc-600 transition-colors">
                {category}
              </h2>
            </Link>
          )}

          {category !== "Recent" && !hideViewAllLink && (
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-zinc-200"></div>
              <Link
                href={`/${categoryToSlug(category)}`}
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors"
              >
                View All Posts
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Articles List */}
      <div className="md:w-3/4 flex flex-col gap-10 font-outfit">
        {articles.map((article, id) => (
          <Link
            href={`/${categoryToSlug(article.category)}/${article.id}`}
            key={id}
            className="article-item group flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-950 group-hover:text-zinc-600 transition-colors">
                {article.title}
              </h3>
              {article.description && (
                <p className="text-zinc-500 leading-relaxed text-sm md:text-base max-w-2xl">
                  {article.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400">
                {(() => {
                  const [day, month, year] = article.date.split("-");
                  return new Intl.DateTimeFormat("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(`${year}-${month}-${day}`));
                })()}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-950 group-hover:text-zinc-600 transition-colors">
                <span>Read Article</span>
                <ArrowLongRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArticleItemList;
