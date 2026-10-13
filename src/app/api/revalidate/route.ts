import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Sanity webhook'u: içerik yayınlanınca siteyi anında günceller.
 * Sanity > API > Webhooks: POST  https://<site>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret || request.nextUrl.searchParams.get("secret") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidateTag("sanity", "max");
  return NextResponse.json({ ok: true, revalidated: Date.now() });
}
