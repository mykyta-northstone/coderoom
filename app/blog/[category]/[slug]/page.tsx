import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { TableOfContents, TocHeading } from "@/components/blog/TableOfContents";
import { ArticleCTA } from "@/components/blog/ArticleCTA";
import { getArticleBySlug, getRelatedArticles, getAllArticles } from "@/lib/blog";
import { CATEGORIES, BlogCategory } from "@/data/blog/articles";
import { PROBLEMS } from "@/data/problems";
import { Clock, User, Calendar, Tag, Code2, ArrowRight, CheckCircle2 } from "lucide-react";

interface ArticlePageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({
    category: a.category,
    slug: a.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticleBySlug(category, slug);

  if (!article) return {};

  const url = `https://pairlet.dev/blog/${category}/${slug}`;

  return {
    title: article.seoTitle || `${article.title} | Pairlet`,
    description: article.seoDescription || article.description,
    authors: [{ name: article.author.name }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.seoTitle || `${article.title} | Pairlet`,
      description: article.seoDescription || article.description,
      url,
      siteName: "Pairlet",
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      tags: article.tags,
      images: [{ url: "https://pairlet.dev/icon.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle || `${article.title} | Pairlet`,
      description: article.seoDescription || article.description,
      images: ["https://pairlet.dev/icon.png"],
    },
  };
}

// Utility to parse markdown H2 headings for Table of Contents
function extractHeadings(markdownContent: string): TocHeading[] {
  const h2Regex = /^##\s+(.+)$/gm;
  const headings: TocHeading[] = [];
  let match;

  while ((match = h2Regex.exec(markdownContent)) !== null) {
    const text = match[1].replace(/[`*]/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text });
  }

  return headings;
}

// Helper to convert markdown content string into clean JSX elements
function renderMarkdownContent(content: string) {
  const sections = content.split(/\n\n+/);

  return sections.map((section, idx) => {
    const trimmed = section.trim();

    // H2 Heading
    if (trimmed.startsWith("## ")) {
      const title = trimmed.replace(/^##\s+/, "").replace(/[`*]/g, "").trim();
      const id = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return (
        <h2 key={idx} id={id} className="text-xl sm:text-2xl font-extrabold text-white mt-10 mb-4 tracking-tight scroll-mt-24">
          {title}
        </h2>
      );
    }

    // H3 Heading
    if (trimmed.startsWith("### ")) {
      const title = trimmed.replace(/^###\s+/, "").replace(/[`*]/g, "").trim();
      return (
        <h3 key={idx} className="text-lg font-bold text-[#cef565] mt-6 mb-3 tracking-tight">
          {title}
        </h3>
      );
    }

    // Fenced Code Block
    if (trimmed.startsWith("```")) {
      const lines = trimmed.split("\n");
      const lang = lines[0].replace("```", "").trim();
      const code = lines.slice(1, -1).join("\n");
      return (
        <div key={idx} className="my-6 rounded-[18px] bg-[#141414] border border-[#2e2e2e] overflow-hidden shadow-lg">
          {lang && (
            <div className="px-4 py-2 bg-[#1a1a1a] border-b border-[#2e2e2e] flex items-center justify-between text-[11px] font-mono text-[#9d9d9d]">
              <span className="uppercase font-bold text-[#cef565]">{lang}</span>
              <span>Pairlet Snippet</span>
            </div>
          )}
          <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono text-[#f4f4f4] leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      );
    }

    // Unordered Bullet List
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items = trimmed.split("\n").map((line) => line.replace(/^[-*]\s+/, "").trim());
      return (
        <ul key={idx} className="my-4 space-y-2 text-xs sm:text-sm text-[#c4c4c4]">
          {items.map((item, i) => (
            <li key={i} className="flex items-start space-x-2">
              <span className="text-[#cef565] font-bold mt-0.5">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
            </li>
          ))}
        </ul>
      );
    }

    // Paragraph
    return (
      <p
        key={idx}
        className="my-4 text-xs sm:text-sm text-[#c4c4c4] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
      />
    );
  });
}

function formatInlineMarkdown(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[#1a1a1a] border border-[#2e2e2e] text-[#cef565] font-mono text-xs">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#cef565] hover:underline font-semibold">$1</a>');
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { category, slug } = await params;
  const article = getArticleBySlug(category, slug);

  if (!article || article.category !== category) {
    notFound();
  }

  const categoryMeta = CATEGORIES[article.category as BlogCategory];
  const headings = extractHeadings(article.content);
  const relatedArticles = getRelatedArticles(article, 4);

  // Fetch relevant Pairlet problems
  const relatedProblems = (article.relatedProblems || [])
    .map((id) => PROBLEMS.find((p) => p.id === id))
    .filter((p): p is (typeof PROBLEMS)[number] => p !== undefined);

  // JSON-LD Schemas
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: article.author.name,
      url: "https://pairlet.dev",
    },
    publisher: {
      "@type": "Organization",
      name: "Pairlet",
      url: "https://pairlet.dev",
      logo: {
        "@type": "ImageObject",
        url: "https://pairlet.dev/icon.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://pairlet.dev/blog/${category}/${slug}`,
    },
  };

  const faqJsonLd =
    article.faq && article.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-[#121212] text-[#f4f4f4] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: categoryMeta?.name || category, href: `/blog/${category}` },
            { label: article.title },
          ]}
        />

        {/* Article Header */}
        <header className="space-y-4 max-w-4xl border-b border-[#2e2e2e] pb-8">
          <div className="flex items-center space-x-3 text-xs font-mono">
            <Link
              href={`/blog/${category}`}
              className="px-3 py-1 rounded-full bg-[#cef565]/10 border border-[#cef565]/30 text-[#cef565] font-bold uppercase hover:bg-[#cef565]/20 transition-colors"
            >
              {categoryMeta?.name || category}
            </Link>
            <span className="text-[#9d9d9d] flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readingTime}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-[#9d9d9d] leading-relaxed max-w-3xl">
            {article.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#9d9d9d] pt-2 font-mono">
            <span className="flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-[#cef565]" />
              <span>{article.author.name}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#9d9d9d]" />
              <span>Published: {article.publishedAt}</span>
            </span>
          </div>
        </header>

        {/* Article Body Grid with Sticky TOC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article Content (8 cols) */}
          <article className="lg:col-span-8 space-y-6">
            {renderMarkdownContent(article.content)}

            {/* FAQ Section */}
            {article.faq && article.faq.length > 0 && (
              <section className="mt-12 pt-8 border-t border-[#2e2e2e] space-y-6">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {article.faq.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-[20px] bg-[#161616] border border-[#2e2e2e] space-y-2"
                    >
                      <h3 className="text-sm font-bold text-white flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-[#cef565] shrink-0 mt-0.5" />
                        <span>{item.question}</span>
                      </h3>
                      <p className="text-xs text-[#9d9d9d] leading-relaxed pl-6">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Relevant Pairlet Problems Card */}
            {relatedProblems.length > 0 && (
              <section className="mt-10 p-6 rounded-[24px] bg-[#161616] border border-[#2e2e2e] space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#cef565] uppercase tracking-wider">
                  <Code2 className="w-4 h-4" />
                  <span>Practice Relevant Coding Problems</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedProblems.map((prob) => (
                    <Link
                      key={prob.id}
                      href={`/problems/${prob.id}`}
                      className="p-4 rounded-[16px] bg-[#1a1a1a] border border-[#2e2e2e] hover:border-[#cef565]/50 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <span className="text-[10px] font-mono text-[#cef565] uppercase">
                          {prob.difficulty}
                        </span>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#cef565] transition-colors">
                          {prob.title}
                        </h4>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#9d9d9d] group-hover:text-[#cef565] group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <ArticleCTA variant="medium" />
          </article>

          {/* Sidebar (4 cols): Sticky TOC + Tags */}
          <aside className="lg:col-span-4 space-y-6">
            {headings.length > 0 && (
              <div className="sticky top-24 space-y-6">
                <TableOfContents headings={headings} />

                {/* Article Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="p-5 rounded-[20px] bg-[#161616] border border-[#2e2e2e] space-y-3">
                    <span className="text-xs font-bold text-[#cef565] uppercase tracking-wider flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Article Tags</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#222] text-[#9d9d9d] border border-[#2e2e2e]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="pt-12 border-t border-[#2e2e2e] space-y-6">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.category}/${rel.slug}`}
                  className="p-5 rounded-[20px] bg-[#161616] border border-[#2e2e2e] hover:border-[#cef565]/40 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-[#cef565] uppercase font-bold">
                      {CATEGORIES[rel.category]?.name}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#cef565] transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-[#9d9d9d] line-clamp-2 leading-relaxed">
                      {rel.description}
                    </p>
                  </div>
                  <div className="text-xs text-[#cef565] font-bold flex items-center space-x-1 pt-1">
                    <span>Read guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
