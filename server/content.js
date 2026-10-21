import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const here = path.dirname(fileURLToPath(import.meta.url));
const defaultContentPath = path.join(here, "..", "data", "site.json");

export const contentPath = process.env.SITE_CONTENT_PATH
  ? path.resolve(process.env.SITE_CONTENT_PATH)
  : defaultContentPath;

const projectSchema = z.object({
  id: z.string().min(1).max(80),
  title: z.string().min(1).max(120),
  tags: z.array(z.string().min(1).max(40)).min(1).max(6),
  image: z.string().min(1).max(300),
  alt: z.string().min(1).max(300),
  layout: z.enum(["wide", "narrow", "inset"]).default("wide"),
  year: z.string().regex(/^\d{4}$/),
  summary: z.string().max(240).optional().default(""),
  url: z.string().url().or(z.literal("")).optional().default(""),
});

const statSchema = z.object({
  id: z.string().min(1).max(40),
  value: z.number().int().min(0).max(1_000_000),
  suffix: z.string().max(12).optional().default(""),
  prefix: z.string().max(12).optional().default(""),
  label: z.string().min(1).max(120),
});

export const siteContentSchema = z.object({
  profile: z.object({
    name: z.string().min(1).max(80),
    initials: z.string().min(1).max(4),
    role: z.string().min(1).max(120),
    email: z.string().min(3).max(254),
    phone: z.string().min(3).max(40),
    phoneDisplay: z.string().min(3).max(40),
    location: z.string().min(1).max(120),
    region: z.string().max(40).optional().default(""),
    hours: z.string().min(1).max(120),
    working: z.string().min(1).max(120),
    description: z.string().min(1).max(300),
  }),
  availability: z.object({
    available: z.boolean(),
    booking: z.string().min(1).max(80),
    footer: z.string().min(1).max(80),
  }),
  stats: z.array(statSchema).min(1).max(6),
  clients: z.array(z.string().min(1).max(80)).min(1).max(20),
  projects: z.array(projectSchema).min(1).max(60),
  testimonial: z.object({
    quoteStart: z.string().min(1).max(300),
    quoteEmphasis: z.string().min(1).max(120),
    quoteEnd: z.string().min(1).max(300),
    source: z.string().min(1).max(160),
  }),
});

let cache = null;

/**
 * Read and validate the site content. The mtime check means content edits are
 * picked up on the next request without restarting the server.
 */
export async function loadSiteContent() {
  const info = await stat(contentPath);
  const version = `${info.mtimeMs}:${info.size}`;

  if (cache && cache.version === version) {
    return cache.data;
  }

  const raw = await readFile(contentPath, "utf8");
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Site content is not valid JSON: ${error.message}`);
  }

  const result = siteContentSchema.safeParse(parsed);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".") || "content"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Site content failed validation: ${details}`);
  }

  cache = { version, data: result.data };
  return result.data;
}
