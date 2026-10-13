import Image from "next/image";
import Link from "next/link";
import type { Category, SiteSettings } from "@/lib/types";

export default function Footer({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink-2">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 pt-16 pb-10 sm:px-8 md:grid-cols-3">
        <div>
          <p className="font-display text-sm font-bold tracking-[0.22em] uppercase">
            Sena <span className="font-light text-white/70">Akvaryum</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">{settings.tagline}</p>
        </div>

        <div>
          <p className="font-display text-[10px] font-semibold tracking-[0.3em] text-white/45 uppercase">
            Kategoriler
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/kategori/${c.slug}`} className="transition-colors hover:text-white">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-[10px] font-semibold tracking-[0.3em] text-white/45 uppercase">
            Dükkanımız
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            <li>{settings.address}</li>
            <li>
              <Link href="/#konum" className="transition-colors hover:text-white">
                Haritada gör →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Dev, şeffaf yazı: arkasında pastel su ve yüzen iki japon balığı */}
      <div className="relative isolate mt-4 h-[min(44vw,460px)] min-h-[260px] overflow-hidden">
        <Image
          src="/photos/bg-su-serit.webp"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b0f15] via-[#0b0f15]/10 to-transparent" />
        <Image
          src="/photos/goldfish-a.webp"
          alt=""
          width={630}
          height={474}
          sizes="(min-width: 1024px) 38vw, 56vw"
          className="animate-float-slow pointer-events-none absolute top-1/2 left-[-6%] h-auto w-[56vw] max-w-[560px] -translate-y-[46%] -rotate-3 drop-shadow-[0_24px_30px_rgba(0,60,90,0.35)] sm:left-[3%] sm:w-[38vw]"
        />
        <Image
          src="/photos/goldfish-b.webp"
          alt=""
          width={500}
          height={461}
          sizes="(min-width: 1024px) 30vw, 46vw"
          className="animate-float pointer-events-none absolute top-1/2 right-[-4%] h-auto w-[46vw] max-w-[440px] -translate-y-[48%] rotate-3 drop-shadow-[0_24px_30px_rgba(0,60,90,0.35)] sm:right-[4%] sm:w-[30vw]"
        />
        <p
          aria-hidden
          className="font-display pointer-events-none absolute inset-0 z-10 grid place-items-center px-3 text-center text-[9.4vw] leading-none font-black tracking-[0.005em] whitespace-nowrap text-white/[0.2] uppercase select-none [text-shadow:0_1px_0_rgba(255,255,255,0.6),0_10px_44px_rgba(0,50,80,0.45)] min-[1500px]:text-[8.4rem]"
        >
          Sena Akvaryum
        </p>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/40">
        © Sena Akvaryum · Yalvaç, Isparta
      </div>
    </footer>
  );
}
