/**
 * Fotoğraf hattı — TARAYICIDA çalışır (Sanity panelinde, yükleme anında).
 *  - optimizePhoto: büyük fotoğrafı görünür kalite kaybı olmadan küçültür (WebP)
 *  - cutoutPhoto:   küçültür + arka planı siler + kenarları temizler + hayvanın etrafını kırpar
 * Böylece panele 50 MB'lık bir fotoğraf da girse Sanity'ye ve siteye yüzlerce KB'lık dosya gider.
 */

export type Progress = (message: string, fraction?: number) => void;

export type PhotoResult = {
  file: File;
  width: number;
  height: number;
  originalBytes: number;
  hasAlpha: boolean;
  /** Kullanıcıya gösterilecek kısa not */
  note: string;
};

const BIG_ERROR =
  "Bu dosya tarayıcıda açılamadı (çok büyük ya da desteklenmeyen bir biçim olabilir). Telefonla çekilmiş normal bir JPG/PNG/WebP fotoğraf deneyin.";

function baseName(name: string) {
  return name.replace(/\.[^.]+$/, "") || "foto";
}

async function decode(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error(BIG_ERROR);
  }
}

function fit(w: number, h: number, max: number): [number, number] {
  const s = Math.min(1, max / Math.max(w, h));
  return [Math.max(1, Math.round(w * s)), Math.max(1, Math.round(h * s))];
}

/** Kaliteyi korumak için yarıya indirerek küçültür (tek seferde büyük oranda küçültmekten daha keskin). */
function resize(source: ImageBitmap | HTMLCanvasElement, maxSide: number): HTMLCanvasElement {
  const sw = "width" in source ? source.width : 0;
  const sh = "height" in source ? source.height : 0;
  const [tw, th] = fit(sw, sh, maxSide);
  let cur: CanvasImageSource = source;
  let cw = sw;
  let ch = sh;
  while (cw / 2 >= tw && ch / 2 >= th) {
    const c = document.createElement("canvas");
    c.width = Math.round(cw / 2);
    c.height = Math.round(ch / 2);
    const g = c.getContext("2d")!;
    g.imageSmoothingQuality = "high";
    g.drawImage(cur, 0, 0, c.width, c.height);
    cur = c;
    cw = c.width;
    ch = c.height;
  }
  const out = document.createElement("canvas");
  out.width = tw;
  out.height = th;
  const g = out.getContext("2d")!;
  g.imageSmoothingQuality = "high";
  g.drawImage(cur, 0, 0, tw, th);
  return out;
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Fotoğraf kaydedilemedi."))), type, quality),
  );
}

/** WebP desteklenmiyorsa (eski Safari) alfa varsa PNG, yoksa JPEG kullanır. */
async function encode(canvas: HTMLCanvasElement, hasAlpha: boolean, quality: number) {
  const webp = await toBlob(canvas, "image/webp", quality);
  if (webp.type === "image/webp") return { blob: webp, ext: "webp" };
  if (hasAlpha) return { blob: await toBlob(canvas, "image/png"), ext: "png" };
  return { blob: await toBlob(canvas, "image/jpeg", 0.92), ext: "jpg" };
}

function canvasHasAlpha(canvas: HTMLCanvasElement) {
  // Ölçeği küçük bir kopyada ara: hızlıdır
  const s = document.createElement("canvas");
  s.width = Math.min(200, canvas.width);
  s.height = Math.min(200, canvas.height);
  const g = s.getContext("2d")!;
  g.drawImage(canvas, 0, 0, s.width, s.height);
  const d = g.getImageData(0, 0, s.width, s.height).data;
  for (let i = 3; i < d.length; i += 4) if (d[i] < 250) return true;
  return false;
}

export async function optimizePhoto(
  file: File,
  progress?: Progress,
  maxSide = 2400,
): Promise<PhotoResult> {
  progress?.("Fotoğraf açılıyor…", 0.1);
  const bmp = await decode(file);
  const alreadySmall =
    file.size < 1_200_000 &&
    Math.max(bmp.width, bmp.height) <= maxSide &&
    ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  if (alreadySmall) {
    const res = { file, width: bmp.width, height: bmp.height, originalBytes: file.size, hasAlpha: file.type !== "image/jpeg", note: "Zaten hafif; olduğu gibi kullanıldı." };
    bmp.close();
    return res;
  }
  progress?.("Küçültülüyor…", 0.5);
  const canvas = resize(bmp, maxSide);
  bmp.close();
  const hasAlpha = canvasHasAlpha(canvas);
  const { blob, ext } = await encode(canvas, hasAlpha, 0.9);
  const out = new File([blob], `${baseName(file.name)}.${ext}`, { type: blob.type });
  return {
    file: out,
    width: canvas.width,
    height: canvas.height,
    originalBytes: file.size,
    hasAlpha,
    note: `${(file.size / 1e6).toFixed(1)} MB → ${(out.size / 1e6).toFixed(2)} MB`,
  };
}

/* ---------- Arka plan temizleme ---------- */

function boxBlur(src: Uint8Array, w: number, h: number, r: number) {
  const tmp = new Float32Array(w * h);
  const out = new Uint8Array(w * h);
  const win = 2 * r + 1;
  for (let y = 0; y < h; y++) {
    let sum = 0;
    const row = y * w;
    for (let x = -r; x <= r; x++) sum += src[row + Math.min(w - 1, Math.max(0, x))];
    for (let x = 0; x < w; x++) {
      tmp[row + x] = sum / win;
      sum += src[row + Math.min(w - 1, x + r + 1)] - src[row + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let y = -r; y <= r; y++) sum += tmp[Math.min(h - 1, Math.max(0, y)) * w + x];
    for (let y = 0; y < h; y++) {
      out[y * w + x] = Math.round(sum / win);
      sum += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x];
    }
  }
  return out;
}

/** Siyah/gri sis temizlenir, hayvanın içindeki küçük delikler (göz parlaması gibi) kapanır. */
function refineAlpha(img: ImageData) {
  const { width: w, height: h, data } = img;
  const n = w * h;
  const a = new Uint8Array(n);
  for (let i = 0; i < n; i++) a[i] = data[i * 4 + 3];
  const blurred = boxBlur(a, w, h, Math.max(3, Math.round(Math.min(w, h) / 160)));
  for (let i = 0; i < n; i++) {
    let v = a[i];
    if (blurred[i] > 232) v = 255;
    v = Math.max(0, Math.min(255, ((v - 28) * 255) / 204));
    data[i * 4 + 3] = v;
  }
}

function trimToSubject(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
  const g = canvas.getContext("2d")!;
  const { width: w, height: h } = canvas;
  const d = g.getImageData(0, 0, w, h).data;
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (d[(y * w + x) * 4 + 3] > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  const pad = Math.round(Math.max(w, h) * 0.015);
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad);
  maxY = Math.min(h - 1, maxY + pad);
  const out = document.createElement("canvas");
  out.width = maxX - minX + 1;
  out.height = maxY - minY + 1;
  out.getContext("2d")!.drawImage(canvas, minX, minY, out.width, out.height, 0, 0, out.width, out.height);
  return out;
}

export async function cutoutPhoto(file: File, progress?: Progress): Promise<PhotoResult> {
  progress?.("Fotoğraf açılıyor…", 0.04);
  const bmp = await decode(file);
  const work = resize(bmp, 1600);
  bmp.close();
  const input = await toBlob(work, "image/png");

  progress?.("Arka plan temizleniyor… (ilk seferde yapay zekâ modeli indirilir, 1–2 dakika sürebilir)", 0.1);
  const { removeBackground } = await import("@imgly/background-removal");
  const cut = await removeBackground(input, {
    model: "isnet_fp16",
    output: { format: "image/png", quality: 1 },
    progress: (key: string, current: number, total: number) => {
      const f = total ? current / total : 0;
      if (key.startsWith("fetch")) progress?.("Yapay zekâ modeli indiriliyor… (yalnızca ilk seferde)", 0.1 + f * 0.5);
      else progress?.("Arka plan temizleniyor…", 0.65 + f * 0.2);
    },
  });

  progress?.("Kenarlar düzeltiliyor…", 0.9);
  const bitmap = await createImageBitmap(cut);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const g = canvas.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(bitmap, 0, 0);
  bitmap.close();
  const img = g.getImageData(0, 0, canvas.width, canvas.height);
  refineAlpha(img);
  g.putImageData(img, 0, 0);

  const trimmed = trimToSubject(canvas);
  if (!trimmed) {
    throw new Error("Fotoğrafta net bir hayvan/ürün bulunamadı. “Arka planı silmeden kullan” seçeneğini deneyin.");
  }
  const { blob, ext } = await encode(trimmed, true, 0.9);
  const out = new File([blob], `${baseName(file.name)}-kesik.${ext}`, { type: blob.type });
  return {
    file: out,
    width: trimmed.width,
    height: trimmed.height,
    originalBytes: file.size,
    hasAlpha: true,
    note: `${(file.size / 1e6).toFixed(1)} MB → ${(out.size / 1e6).toFixed(2)} MB, arka plan silindi`,
  };
}
