"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const KoiCanvas = dynamic(() => import("./KoiCanvas"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const subscribe = () => () => {};
let cached: boolean | undefined;
const getSnapshot = () => (cached ??= hasWebGL());

/** WebGL yoksa (eski cihaz) balık yerine sade bir görsel gösterilir; sayfa yine de güzel görünür. */
export default function KoiScene({ className }: { className?: string }) {
  const ok = useSyncExternalStore(subscribe, getSnapshot, () => false);
  if (!ok) {
    return (
      <div
        className={className}
        style={{
          backgroundImage: "url(/photos/hero-koi.webp)",
          backgroundSize: "auto 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden
      />
    );
  }
  return <KoiCanvas className={className} />;
}
