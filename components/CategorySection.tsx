"use client";

import Link from "next/link";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { sanitizeSlug } from "@/lib/slug";
import { formatDate } from "@/lib/utils";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ArticleItem } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  category: string;
  articles: ArticleItem[];
}

const CategorySection = ({ category, articles }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="mx-auto max-w-6xl w-11/12 py-16 border-t border-zinc-100"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Header Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h2 className="font-cormorantGaramond text-4xl text-zinc-950 mb-2">
              {category}
            </h2>
            <Link
              href={`/${sanitizeSlug(category)}`}
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors inline-flex items-center gap-2"
            >
              View All
              <ArrowLongRightIcon className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Content Column - Horizontal List style */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="group flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                {formatDate(article.date)}
              </span>

              <Link href={`/${sanitizeSlug(article.category)}/${article.id}`}>
                <h3 className="text-xl font-medium text-zinc-950 group-hover:text-zinc-600 transition-colors">
                  {article.title}
                </h3>
              </Link>

              <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                {article.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
