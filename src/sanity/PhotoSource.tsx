"use client";

import { Box, Button, Card, Dialog, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { useEffect, useRef, useState } from "react";
import type { AssetSource, AssetSourceComponentProps } from "sanity";
import { cutoutPhoto, optimizePhoto, type PhotoResult } from "./photoPipeline";

type Mode = "cutout" | "optimize";

const COPY: Record<Mode, { header: string; intro: string }> = {
  cutout: {
    header: "Fotoğraf yükle (arka plan otomatik silinir)",
    intro:
      "Hayvanın fotoğrafını seçin. Sistem fotoğrafı küçültür, arka planı siler ve ana sayfadaki büyük vitrine uygun hâle getirir. Büyük dosyalar sorun değil.",
  },
  optimize: {
    header: "Fotoğraf yükle (otomatik küçültülür)",
    intro:
      "Fotoğrafı seçin. Sistem görüntü kalitesini koruyarak dosyayı otomatik küçültür; sitede her ekrana uygun boyutta gösterilir.",
  },
};

function PhotoDialog({ mode, onClose, onSelect }: AssetSourceComponentProps & { mode: Mode }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [fraction, setFraction] = useState(0);
  const [error, setError] = useState("");
  const [original, setOriginal] = useState<File | null>(null);
  const [result, setResult] = useState<PhotoResult | null>(null);
  const [preview, setPreview] = useState<string>("");

  const previewRef = useRef("");
  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
  }, []);

  async function run(file: File, how: Mode) {
    setBusy(true);
    setFraction(0);
    setError("");
    setResult(null);
    try {
      const progress = (m: string, f = 0) => {
        setMessage(m);
        // İlerleme çubuğu geri gitmesin (indirme/işleme aşamaları sıra sıra raporlanır)
        setFraction((prev) => Math.max(prev, f));
      };
      const res = how === "cutout" ? await cutoutPhoto(file, progress) : await optimizePhoto(file, progress);
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      previewRef.current = URL.createObjectURL(res.file);
      setPreview(previewRef.current);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fotoğraf işlenemedi.");
    } finally {
      setBusy(false);
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Lütfen bir fotoğraf (JPG, PNG, WebP) seçin.");
      return;
    }
    setOriginal(file);
    void run(file, mode);
  }

  function use() {
    if (!result) return;
    // Sanity tipleri kendi `File` arayüzünü kullanıyor; gerçek tarayıcı File nesnesi çalışır.
    onSelect([{ kind: "file", value: result.file as unknown as string }]);
    onClose();
  }

  return (
    <Dialog id={`photo-source-${mode}`} header={COPY[mode].header} onClose={onClose} width={1} animate>
      <Box padding={4}>
        <Stack gap={4}>
          <Text size={1} muted>
            {COPY[mode].intro}
          </Text>

          <input ref={inputRef} type="file" accept="image/*" hidden onChange={onPick} />

          {!busy && !result && (
            <Button
              text="Bilgisayardan / telefondan fotoğraf seç"
              tone="primary"
              padding={4}
              onClick={() => inputRef.current?.click()}
            />
          )}

          {busy && (
            <Card padding={4} radius={2} tone="primary" border>
              <Flex align="center" gap={3}>
                <Spinner muted />
                <Stack gap={2}>
                  <Text size={1}>{message || "İşleniyor…"}</Text>
                  <Text size={0} muted>
                    {Math.round(fraction * 100)}% — pencereyi kapatmayın
                  </Text>
                </Stack>
              </Flex>
            </Card>
          )}

          {error && (
            <Card padding={3} radius={2} tone="critical" border>
              <Text size={1}>{error}</Text>
            </Card>
          )}

          {result && preview && (
            <Stack gap={3}>
              <Card
                radius={2}
                padding={3}
                style={{
                  background:
                    "linear-gradient(135deg,#0b0f15,#141b26)",
                }}
              >
                <Flex justify="center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Sonuç önizlemesi"
                    style={{ maxWidth: "100%", maxHeight: 360, objectFit: "contain" }}
                  />
                </Flex>
              </Card>
              <Text size={1} muted>
                Sitede bu koyu zeminde görünecek. {result.note}
              </Text>
              <Flex gap={2} wrap="wrap">
                <Button text="Bu fotoğrafı kullan" tone="positive" onClick={use} />
                {mode === "cutout" && original && (
                  <Button
                    text="Arka planı silmeden kullan"
                    mode="ghost"
                    onClick={() => void run(original, "optimize")}
                  />
                )}
                <Button text="Başka fotoğraf seç" mode="ghost" onClick={() => inputRef.current?.click()} />
              </Flex>
            </Stack>
          )}

          {error && original && mode === "cutout" && (
            <Button
              text="Arka planı silmeden devam et"
              mode="ghost"
              onClick={() => void run(original, "optimize")}
            />
          )}
        </Stack>
      </Box>
    </Dialog>
  );
}

function CutoutDialog(props: AssetSourceComponentProps) {
  return <PhotoDialog {...props} mode="cutout" />;
}
function OptimizeDialog(props: AssetSourceComponentProps) {
  return <PhotoDialog {...props} mode="optimize" />;
}

/** Büyük vitrin fotoğrafı: küçült + arka planı sil */
export const cutoutSource: AssetSource = {
  name: "sena-cutout",
  title: "Fotoğraf yükle (arka plan silinir)",
  component: CutoutDialog,
  uploadMode: "component",
};

/** Ürün ve diğer fotoğraflar: yalnızca otomatik küçült */
export const optimizeSource: AssetSource = {
  name: "sena-optimize",
  title: "Fotoğraf yükle (otomatik küçülür)",
  component: OptimizeDialog,
  uploadMode: "component",
};
