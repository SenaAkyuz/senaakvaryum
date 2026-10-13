"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { directionsUrl } from "@/lib/site";

const LINKS = [
  { href: "/#kategoriler", label: "Kategoriler" },
  { href: "/#malzemeler", label: "Malzemeler" },
  { href: "/#yeni", label: "Yeni gelenler", onlyIfNew: true },
  { href: "/#hakkimizda", label: "Hakkımızda" },
  { href: "/#konum", label: "Konum" },
];

export default function Header({ hasNew = false }: { hasNew?: boolean }) {
  const links = LINKS.filter((l) => !("onlyIfNew" in l) || hasNew);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? "bg-ink/70 py-3 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
            : "py-5 sm:py-7"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="font-display group flex items-center gap-2.5 text-[14px] font-bold tracking-[0.22em] uppercase"
          >
            <span>
              Sena <span className="font-light text-white/70">Akvaryum</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Ana menü">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-display text-[11px] font-semibold tracking-[0.2em] text-white/70 uppercase transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display rounded-full border border-white/25 px-5 py-2 text-[11px] font-semibold tracking-[0.2em] uppercase transition-all hover:border-ember hover:bg-ember"
            >
              Yol tarifi
            </a>
          </nav>

          <button
            type="button"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 grid size-10 place-items-center md:hidden"
          >
            <span className="grid gap-[5px]">
              <span
                className={`block h-[2px] w-6 bg-white transition-transform duration-300 ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-4 justify-self-end bg-white transition-opacity duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-6 bg-white transition-transform duration-300 ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink/95 px-8 backdrop-blur-2xl md:hidden"
          >
            <nav className="grid gap-5" aria-label="Mobil menü">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.1 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-display block text-4xl font-black tracking-tight uppercase"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display mt-4 w-fit rounded-full bg-ember px-7 py-3 text-xs font-bold tracking-[0.2em] uppercase"
              >
                Yol tarifi al
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
