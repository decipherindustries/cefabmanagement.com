import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCALES, href, isLocale, type Locale } from "@/lib/routes";
import { getDictionary } from "@/content";
import { formatPostDate, getAllPosts, getPost } from "@/lib/insights";
import { blogPostingJsonLd, postCanonical } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import { Section } from "@/components/layout/Section";
import { PostPanel } from "@/components/insights/PostPanel";

type Params = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getAllPosts();
  return LOCALES.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = isLocale(locale) ? getPost(slug) : null;
  if (!post) return {};
  const title = `${post.title} · Catherine Cruickshank`;
  const url = postCanonical(slug);
  return {
    title, description: post.description,
    // One language per post, so no hreflang pair: both locales point at /en.
    alternates: { canonical: url },
    openGraph: {
      type: "article", title, description: post.description, url,
      publishedTime: post.date, modifiedTime: post.updated ?? post.date, authors: ["Catherine Cruickshank"],
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const dict = getDictionary(locale as Locale);
  const t = dict.insights;
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd(post)) }}
      />
      <div className="ck-hero-wrap">
        <Header locale={locale as Locale} nav={dict.nav} />
        <section className="ck-hero ck-hero--post" aria-label={post.title}>
          <Container>
            <nav className="ck-crumb" aria-label="Breadcrumb">
              <Link href={href("insights", locale as Locale)}>{t.breadcrumb}</Link>
              <span aria-hidden="true"> /</span>
            </nav>
            <h1 className="ck-hero__title ck-post__title" lang={post.lang}>{post.title}</h1>
            <p className="ck-post__meta">
              {post.author} · {formatPostDate(post.date, locale as Locale)} · {post.readingMinutes} {t.minRead}
            </p>
          </Container>
        </section>
      </div>
      <Section label={post.title}>
        <article lang={post.lang} className="ck-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
        <PostPanel dict={dict} locale={locale as Locale} />
      </Section>
    </main>
  );
}
