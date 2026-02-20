"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Initial state is set in CSS/Tailwind (opacity-0 etc) to prevent FOUC,
      // but we iterate here with 'from' or 'fromTo' for control.

      // Animate the letters of SUTRA if we had them split, but for now we'll do a clip-path reveal
      // or a simple slide up. Let's do a slide up with opacity.

      tl.fromTo(
        titleRef.current,
        { y: 100, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: "power3.out" },
      );

      // Pop the dot
      tl.fromTo(
        dotRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.8",
      );

      // Draw the line
      tl.fromTo(
        lineRef.current,
        { width: 0, opacity: 0 },
        { width: "6rem", opacity: 1, duration: 1 },
        "-=1",
      );

      // Fade up subtitle
      tl.fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.8",
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="mx-auto max-w-6xl w-11/12 min-h-[50vh] flex flex-col justify-center py-20 md:py-32 relative overflow-hidden"
    >
      <div className="overflow-hidden">
        <h1
          ref={titleRef}
          className="font-cormorantGaramond text-7xl md:text-9xl lg:text-[10rem] text-zinc-950 font-bold tracking-tighter leading-none opacity-0"
        >
          Sutra
          <span ref={dotRef} className="text-zinc-400 inline-block">
            .
          </span>
        </h1>
      </div>

      <div ref={lineRef} className="mt-8 h-2 bg-zinc-950 opacity-0"></div>

      <p
        ref={subtitleRef}
        className="mt-10 text-xl md:text-3xl text-zinc-500 max-w-3xl font-light leading-snug opacity-0"
      >
        A simple actuarial blog, exploring numbers, AI, and the human side of
        tech.
      </p>

      {/* Decorative background element (very subtle) */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 -z-10 opacity-[0.03] select-none pointer-events-none">
        <span className="text-[20rem] font-bold font-outfit">S</span>
      </div>
    </section>
  );
}
