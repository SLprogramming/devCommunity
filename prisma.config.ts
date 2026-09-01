import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma Client generation does not require a live database URL. Vercel runs
// `prisma generate` during dependency installation, where DIRECT_URL may not be
// configured. Prefer the direct connection for migrations, fall back to the
// runtime connection, and allow generation when neither is available.
const datasourceUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  ...(datasourceUrl ? { datasource: { url: datasourceUrl } } : {}),
});
