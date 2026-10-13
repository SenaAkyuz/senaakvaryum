import { NextStudio } from "next-sanity/studio";
import config from "../../../../../sanity.config";
import { hasSanity } from "@/lib/env";

export default function StudioPage() {
  if (!hasSanity) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#06080c",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 560, lineHeight: 1.6 }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Yönetim paneli henüz bağlı değil</h1>
          <p>
            Sanity projesi oluşturulup <code>.env.local</code> dosyasına{" "}
            <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> eklendiğinde bu sayfada ürün ekleme
            paneli açılır. Adımlar için proje klasöründeki <code>README.md</code> dosyasına
            bakın.
          </p>
        </div>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
