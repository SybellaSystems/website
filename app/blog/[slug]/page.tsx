import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
  getBlogPostBySlug,
  searchBlogPosts,
  getAllBlogPosts,
} from "@/lib/models/BlogPost";
import ShareButtons from "@/components/blog/ShareButtons";

// Revalidate this page on-demand at most once a minute (ISR) so edits show up
// quickly without hitting MongoDB on every single request.
export const revalidate = 60;

const DEFAULT_THUMBNAIL = "/images/blog/default.jpg";
const SITE_NAME = "Sybella Systems";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.sybellasystems.co.rw";

interface BlogPostDoc {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  slug: string;
  readTime: number;
  thumbnailUrl: string;
  publishedAt: string | Date;
  updatedAt?: string | Date;
}

// Dedupe the DB lookup between generateMetadata() and the page render — both
// run for the same request, so `cache()` ensures we only hit Mongo once.
const getPost = cache(async (slug: string) => {
  const post = await getBlogPostBySlug(slug);
  return post as unknown as BlogPostDoc | null;
});

function absoluteUrl(path?: string) {
  if (!path) return `${SITE_URL}${DEFAULT_THUMBNAIL}`;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function toIso(dateValue?: string | Date) {
  if (!dateValue) return undefined;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

function formatDate(dateValue?: string | Date) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Builds schema.org BlogPosting JSON-LD for this article. Returned as an
// already-escaped string so it can be safely injected via
// dangerouslySetInnerHTML without risking a </script> breakout.
function buildArticleJsonLd(post: BlogPostDoc, pageUrl: string, image: string) {
  const datePublished = toIso(post.publishedAt) ?? toIso(new Date());
  const dateModified = toIso(post.updatedAt) ?? datePublished;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [image],
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        // NOTE: update this path if your actual logo asset lives elsewhere.
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  };

  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}

// Next.js 14 App Router: params is a plain object (not a Promise). If this
// project is later upgraded to Next.js 15+, change to
// `{ params }: { params: Promise<{ slug: string }> }` and `const { slug } = await params;`
type RouteParams = { params: { slug: string } };

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: `Blog Not Found | ${SITE_NAME}`,
      description: "The article you are looking for could not be found.",
    };
  }

  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = absoluteUrl(post.thumbnailUrl);
  const title = `${post.title} | ${SITE_NAME}`;
  const description = post.excerpt;
  const publishedTime = toIso(post.publishedAt);
  const modifiedTime = toIso(post.updatedAt);

  return {
    title,
    description,
    keywords: post.tags && post.tags.length > 0 ? post.tags : undefined,
    authors: post.author ? [{ name: post.author }] : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: post.author ? [post.author] : undefined,
      images: [
        {
          url: image,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: RouteParams) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  // Related articles: prefer posts sharing a tag, fall back to recent posts.
  // Reuses the existing searchBlogPosts/getAllBlogPosts backend functions —
  // no API or schema changes required.
  let related: BlogPostDoc[] = [];
  if (post.tags?.length) {
    const tagResults = await searchBlogPosts("", { tags: post.tags }, 1, 4);
    related = (tagResults.data as unknown as BlogPostDoc[]).filter(
      (item) => item.slug !== post.slug,
    );
  }
  if (related.length === 0) {
    const { blogs } = await getAllBlogPosts(0, 4);
    related = (blogs as unknown as BlogPostDoc[]).filter(
      (item) => item.slug !== post.slug,
    );
  }
  related = related.slice(0, 3);

  const pageUrl = `${SITE_URL}/blog/${post.slug}`;
  const image = absoluteUrl(post.thumbnailUrl);
  const primaryTag = post.tags?.[0];
  const jsonLd = buildArticleJsonLd(post, pageUrl, image);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Article structured data for Google (schema.org BlogPosting) */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <div className="grid-pattern absolute inset-0 opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_60%)] pointer-events-none" />

      {/* Single <article> for the whole post. This renders inside the root
          layout's <main>, so we intentionally do NOT add another <main> here
          — nesting <main> elements is invalid HTML and hurts semantic SEO. */}
      <article className="relative">
        {/* Header — wide container for the hero/title area. Contains the one
            and only <h1> for this page. */}
        <header className="border-b border-dim">
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-14 max-w-5xl">
            {/* Breadcrumb — plain <Link>, crawlable without JS */}
            <div className="flex items-center gap-2 text-sm text-secondary mb-6 flex-wrap">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 hover:text-[var(--blue-bright)] transition-colors"
              >
                ← Blog
              </Link>
              {primaryTag && (
                <>
                  <span className="text-dim">/</span>
                  <span className="text-[var(--blue-bright)]">
                    {primaryTag}
                  </span>
                </>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[var(--blue-dim)] text-[var(--blue-bright)] text-xs rounded-full border border-[rgba(59,130,246,0.25)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-base sm:text-lg text-secondary max-w-2xl leading-relaxed mb-6">
                {post.excerpt}
              </p>
            )}

            {/* Author + meta */}
            <div className="flex items-center flex-wrap gap-x-4 gap-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--blue-dim)] text-[var(--blue-bright)] border border-[rgba(59,130,246,0.25)] flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {getInitials(post.author)}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-primary">
                    {post.author}
                  </p>
                  <p className="text-xs text-secondary">
                    {formatDate(post.publishedAt)} · {post.readTime} min read
                  </p>
                </div>
              </div>
            </div>

            <ShareButtons url={pageUrl} title={post.title} />
          </div>
        </header>

        {/* Featured image — natural aspect ratio preserved, never distorted */}
        <figure className="container mx-auto px-4 sm:px-6 pt-6 sm:pt-8 max-w-5xl">
          <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-dim bg-[var(--surface)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.thumbnailUrl || DEFAULT_THUMBNAIL}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        </figure>

        {/* Article body — narrower reading width. A <section> for the body
            text, and a <footer> for the article's own back-link/share actions
            (semantically distinct from the body content itself). */}
        <section
          aria-label="Article content"
          className="container mx-auto px-4 sm:px-6 py-10 sm:py-14 max-w-2xl"
        >
          <section
            aria-label="Article content"
            className="container mx-auto px-4 sm:px-6 py-10 sm:py-14 max-w-2xl"
          >
            <div
              className="blog-content text-secondary text-base sm:text-lg leading-7 sm:leading-8 break-words"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <footer className="mt-10 pt-6 border-t border-dim flex items-center justify-between flex-wrap gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--blue-bright)] hover:underline"
              >
                ← Back to Blog
              </Link>

              <ShareButtons url={pageUrl} title={post.title} />
            </footer>
          </section>

          <footer className="mt-10 pt-6 border-t border-dim flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--blue-bright)] hover:underline"
            >
              ← Back to Blog
            </Link>
            <ShareButtons url={pageUrl} title={post.title} />
          </footer>
        </section>

        {/* Related articles — own <section> with an <h2>, keeping heading
            hierarchy correct (h1 in header, h2 here, h3 per card). */}
        {related.length > 0 && (
          <section
            aria-labelledby="related-articles-heading"
            className="container mx-auto px-4 sm:px-6 py-12 max-w-5xl border-t border-dim"
          >
            <h2
              id="related-articles-heading"
              className="text-xl sm:text-2xl font-bold mb-6"
            >
              More from {SITE_NAME}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="card overflow-hidden rounded-xl flex flex-col group transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnailUrl || DEFAULT_THUMBNAIL}
                      alt={item.title}
                      className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.tags?.[0] && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-[var(--surface)]/90 backdrop-blur text-[var(--blue-bright)] text-xs font-medium rounded-full border border-[rgba(59,130,246,0.25)]">
                        {item.tags[0]}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[var(--blue-bright)] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-secondary mt-auto">
                      {formatDate(item.publishedAt)} · {item.readTime} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
