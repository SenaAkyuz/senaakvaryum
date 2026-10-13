import AboutSection from "@/components/AboutSection";
import CategoryPanel from "@/components/CategoryPanel";
import NewArrivals from "@/components/FeaturedProducts";
import Hero from "@/components/Hero";
import LocationSection from "@/components/LocationSection";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import SuppliesSection from "@/components/SuppliesSection";
import { getSiteData } from "@/lib/data";
import { SHOP } from "@/lib/site";

export default async function Home() {
  const data = await getSiteData();
  const { settings, categories, subCategories, products } = data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PetStore",
    name: settings.shopName,
    description: settings.aboutText,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Hastane Cad. No:16/G, Kaşyukarı Mah.",
      addressLocality: "Yalvaç",
      addressRegion: "Isparta",
      addressCountry: "TR",
    },
    geo: { "@type": "GeoCoordinates", latitude: SHOP.lat, longitude: SHOP.lng },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero
        tagline={settings.tagline}
        categories={categories.map((c) => ({ title: c.title, slug: c.slug }))}
      />
      <Marquee words={categories.map((c) => c.title)} />

      <section id="kategoriler" className="relative">
        <div className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 sm:pt-32">
          <Reveal>
            <p className="font-display text-[11px] font-semibold tracking-[0.4em] text-flame uppercase">
              Kategoriler
            </p>
            <h2 className="font-display mt-3 text-4xl leading-[0.95] font-black tracking-[-0.04em] uppercase sm:text-6xl">
              Hangi dostu
              <br />
              <span className="text-outline">arıyorsunuz?</span>
            </h2>
          </Reveal>
        </div>

        {categories.map((category, i) => (
          <CategoryPanel
            key={category.id}
            category={category}
            index={i}
            flip={i % 2 === 1}
            subTitles={subCategories.filter((s) => s.categoryId === category.id).map((s) => s.title)}
            productCount={products.filter((p) => p.categoryId === category.id).length}
          />
        ))}
      </section>

      <SuppliesSection data={data} />
      <NewArrivals data={data} />
      <AboutSection text={settings.aboutText} />
      <LocationSection settings={settings} />
    </main>
  );
}
