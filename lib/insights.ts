import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";
import type { Locale } from "@/lib/routes";

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  summary: string;
  date: string;
  updated?: string;
  author: string;
  lang: "en" | "nl";
  readingMinutes: number;
}

export interface Post extends PostMeta {
  html: string;
  markdown: string;
}

const DEFAULT_DIR = path.join(process.cwd(), "content/insights");
const SLUG = /^[a-z0-9-]+$/;
const REQUIRED = ["title", "description", "summary", "date"] as const;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Raw HTML in a post is escaped, never passed through.
const marked = new Marked({ renderer: { html: ({ text }) => escapeHtml(text) } });

export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function formatPostDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

function isoDate(value: unknown): string {
  return value instanceof Date ? value.toISOString().slice(0, 10) : String(value);
}

function readPost(slug: string, dir: string): (Post & { draft: boolean }) | null {
  const file = path.join(dir, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  for (const key of REQUIRED) {
    if (!data[key]) throw new Error(`${slug}.md: missing frontmatter "${key}"`);
  }
  const markdown = content.trim();
  return {
    slug,
    title: String(data.title),
    description: String(data.description),
    summary: String(data.summary),
    date: isoDate(data.date),
    updated: data.updated ? isoDate(data.updated) : undefined,
    author: data.author ? String(data.author) : "CEFAB Management",
    lang: data.lang === "nl" ? "nl" : "en",
    readingMinutes: readingMinutes(markdown),
    html: marked.parse(markdown, { async: false }),
    markdown,
    draft: data.draft === true,
  };
}

function visible(draft: boolean): boolean {
  return !(draft && process.env.NODE_ENV === "production");
}

export function getAllPosts(dir: string = DEFAULT_DIR): PostMeta[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readPost(f.slice(0, -3), dir))
    .filter((p): p is Post & { draft: boolean } => p !== null && visible(p.draft))
    .map(({ html: _html, markdown: _markdown, draft: _draft, ...meta }) => meta)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string, dir: string = DEFAULT_DIR): Post | null {
  if (!SLUG.test(slug)) return null;
  const post = readPost(slug, dir);
  if (!post || !visible(post.draft)) return null;
  const { draft: _draft, ...rest } = post;
  return rest;
}
