"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Subscribe from "./Subscribe";

export default function StickySubscribe() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Only run on homepage
    if (pathname !== "/") {
      setShouldRender(false);
      return;
    }
    setShouldRender(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the footer subscribe is NOT intersecting, show the sticky one
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0,
        // Start showing slightly before the footer one disappears
        rootMargin: "0px 0px -100px 0px",
      },
    );

    const footerElem = document.getElementById("footer-subscribe");
    if (footerElem) {
      observer.observe(footerElem);
    }

    return () => {
      if (footerElem) {
        observer.unobserve(footerElem);
      }
    };
  }, [pathname]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto w-11/12 lg:w-3/4 mb-4 flex justify-center">
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg py-3 px-4 shadow-2xl">
          <Subscribe minimal={true} darkMode={true} />
        </div>
      </div>
    </div>
  );
}
