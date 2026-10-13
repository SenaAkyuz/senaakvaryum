export default function Marquee({ words }: { words: string[] }) {
  const row = [...words, ...words];
  return (
    <div
      aria-hidden
      className="relative overflow-hidden border-y border-white/10 bg-ink-2 py-5 sm:py-7"
    >
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center gap-10">
            {row.map((w, i) => (
              <span key={`${dup}-${i}`} className="flex items-center gap-10">
                <span
                  className={`font-display text-4xl font-black tracking-tight uppercase sm:text-6xl ${
                    i % 2 ? "text-outline" : "text-white"
                  }`}
                >
                  {w}
                </span>
                <span className="bubble size-3.5 sm:size-5" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
