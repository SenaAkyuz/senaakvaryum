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

      {/* Dev, şeffaf yazı: arkasında pastel su ve japon balıkları */}
      <div className="relative isolate mt-4 grid h-[min(40vw,400px)] min-h-[200px] place-items-center overflow-hidden">
        <Image
          src="/photos/bg-altin.webp"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover [object-position:50%_34%]"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b0f15] via-[#0b0f15]/20 to-[#06080c]/70" />
        <p
          aria-hidden
          className="font-display pointer-events-none px-3 text-center text-[9.4vw] leading-none font-black tracking-[0.005em] whitespace-nowrap text-white/[0.16] uppercase select-none [text-shadow:0_1px_0_rgba(255,255,255,0.55),0_8px_40px_rgba(0,40,70,0.4)] min-[1500px]:text-[8.4rem]"
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
