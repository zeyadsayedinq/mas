import { useEffect } from "react";

/**
 * Decorative motion only runs while its section is on screen. Every section
 * and footer on the page is watched, and one that is out of view gets the
 * `is-asleep` class, which index.css uses to switch its looping animations
 * off. A long page then only ever animates the screenful being looked at,
 * which is lighter on the battery and on memory.
 */
export function useSleepOffscreen() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("is-asleep", !e.isIntersecting)),
      { rootMargin: "120px 0px" },
    );
    const watch = () => document.querySelectorAll("section, footer").forEach((el) => io.observe(el));
    watch();
    // Sections that arrive a moment later (lazy parts of a page) are picked up too.
    const late = window.setTimeout(watch, 1500);
    return () => { window.clearTimeout(late); io.disconnect(); };
  }, []);
}
