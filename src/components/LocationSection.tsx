import Image from "next/image";
import Reveal from "@/components/Reveal";
import { SHOP, directionsUrl, mapEmbedUrl } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

function Action({
  href,
  children,
  primary,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-display rounded-full px-6 py-3 text-[11px] font-bold tracking-[0.18em] uppercase transition-all ${
        primary
          ? "bg-ember text-white hover:bg-flame"
          : "border border-white/25 hover:border-white hover:bg-white hover:text-ink"
      }`}
    >
      {children}
    </a>
  );
}

export default function LocationSection({ settings }: { settings: SiteSettings }) {
  return (
    <section id="konum" className="relative isolate overflow-hidden py-24 sm:py-32">
      {/* Koyu su altı fotoğrafı: üstten ve alttan siyaha karışır */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,#000_28%,#000_72%,transparent)]"
      >
        <Image
          src="/photos/bg-su.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.38]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,12,0.88),rgba(6,8,12,0.35)_60%,rgba(6,8,12,0.7))]" />
      </div>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="font-display text-[11px] font-semibold tracking-[0.4em] text-flame uppercase">
            Konum
          </p>
          <h2 className="font-display mt-3 text-4xl leading-[0.95] font-black tracking-[-0.04em] uppercase sm:text-6xl">
            Dükkanımız
            <br />
            <span className="text-outline">Yalvaç’ta</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-panel p-7 sm:p-9">
              <p className="font-display text-2xl leading-snug font-extrabold tracking-tight sm:text-3xl">
                Canlıları yakından görmek için dükkana bekleriz.
              </p>
              <div className="mt-8">
                <p className="font-display text-[10px] font-semibold tracking-[0.3em] text-white/45 uppercase">
                  Adres
                </p>
                <p className="mt-2 text-lg leading-relaxed text-white/85">
                  {settings.address || SHOP.address}
                </p>
              </div>

              <div className="mt-9 flex flex-wrap gap-3 lg:mt-auto lg:pt-9">
                <Action href={directionsUrl} primary>
                  Yol tarifi
                </Action>
                <Action href={SHOP.yandexUrl}>Yandex Haritalar</Action>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="map-dark relative h-[380px] overflow-hidden rounded-3xl border border-white/10 bg-panel sm:h-[460px] lg:h-full lg:min-h-[480px]">
              <iframe
                title="Sena Akvaryum harita konumu"
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
