import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Hides credentials and hostnames in error text before it is shown publicly. */
function mask(text: string) {
  return text
    .replace(/mongodb(\+srv)?:\/\/[^\s"']+/gi, "mongodb://***")
    .replace(/[a-z0-9-]+\.[a-z0-9]+\.mongodb\.net/gi, "***.mongodb.net")
    .slice(0, 400);
}

/**
 * Health check: GET /api/health
 * Reports whether the settings are present and whether MongoDB answers. Never returns secret values.
 */
export async function GET() {
  const url = process.env.DATABASE_URL ?? "";
  let dbName = "";
  let parsable = false;
  try {
    const u = new URL(url);
    parsable = true;
    dbName = u.pathname.replace(/^\//, "");
  } catch {}

  const settings = {
    DATABASE_URL: url ? "set" : "MISSING",
    DATABASE_URL_starts_with_mongodb: /^mongodb(\+srv)?:\/\//.test(url),
    DATABASE_URL_has_quotes_or_spaces: /["'\s]/.test(url),
    DATABASE_URL_valid_format: parsable,
    DATABASE_URL_has_database_name: !!dbName,
    JWT_SECRET: (process.env.JWT_SECRET ?? "").length >= 16 ? "set" : "MISSING or too short",
  };

  const started = Date.now();
  try {
    const products = await prisma.product.count();
    return Response.json({ ok: true, database: "connected", products, ms: Date.now() - started, settings });
  } catch (e) {
    const err = e as Error & { code?: string; errorCode?: string };
    return Response.json(
      { ok: false, database: "FAILED", errorType: err.name, errorCode: err.code ?? err.errorCode ?? null, error: mask(err.message ?? String(e)), ms: Date.now() - started, settings },
      { status: 503 },
    );
  }
}
