import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { getArticlesByCategory, getCategoryMeta, getAllCategorySlugs } from "@/lib/blog";
import { CATEGORIES, BlogCategory } from "@/data/blog/articles";
import { Clock, ArrowRight, BookOpen, PlusCircle } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getAllCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = getCategoryMeta(category);
  if (!meta) return {};

  const url = `https://pairlet.dev/blog/${category}`;

  return {
    title: `${meta.title} | Pairlet Blog`,
    description: meta.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${meta.title} | Pairlet Blog`,
      description: meta.description,
      url,
      siteName: "Pairlet",
      images: [{ url: "/icon.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | Pairlet Blog`,
      description: meta.description,
      images: ["/icon.png"],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const catKey = category as BlogCategory;
  const meta = getCategoryMeta(category);

  if (!meta) {
    notFound();
  }

  const articles = getArticlesByCategory(catKey);
  const featured = articles.find((a) => a.featured) || articles[0];
  const remaining = articles.filter((a) => a.slug !== featured?.slug);

  const otherCategories = (Object.keys(CATEGORIES) as BlogCategory[]).filter((c) => c !== catKey);

  return (
    <div className="min-h-screen bg-[#121212] text-[#f4f4f4] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: meta.name }]} />

        {/* Category Header */}
        <header className="space-y-4 max-w-3xl">
          <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#cef565]/10 border border-[#cef565]/30 text-xs font-mono font-bold text-[#cef565] uppercase">
            Topic Hub
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {meta.name} Resources
          </h1>
          <p className="text-sm text-[#9d9d9d] leading-relaxed pt-1">
            {meta.introHtml}
          </p>
        </header>

        {/* Featured Article in Category */}
        {featured && (
          <section className="space-y-4">
            <h2 className="text-xs font-mono font-bold text-[#cef565] uppercase tracking-wider">
              Featured Article
            </h2>
            <Link
              href={`/blog/${featured.category}/${featured.slug}`}
              className="p-8 rounded-[28px] bg-gradient-to-br from-[#1b2315] via-[#161616] to-[#141414] border border-[#cef565]/40 hover:border-[#cef565] transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group shadow-xl"
            >
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="text-[#cef565] font-bold uppercase">{meta.name}</span>
                  <span className="text-[#9d9d9d] flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{featured.readingTime}</span>
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white group-hover:text-[#cef565] transition-colors">
                  {featured.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#9d9d9d] leading-relaxed line-clamp-2">
                  {featured.description}
                </p>
              </div>
              <div className="flex items-center space-x-2 text-xs font-extrabold text-[#131313] bg-[#cef565] px-6 py-3 rounded-full shrink-0 group-hover:bg-[#b9e83c] transition-colors">
                <span>Read Guide</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </section>
        )}

        {/* All Category Articles Grid */}
        <section className="space-y-6">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            All {meta.name} Articles ({articles.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.category}/${article.slug}`}
                className="p-6 rounded-[22px] bg-[#161616] border border-[#2e2e2e] hover:border-[#cef565]/40 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#9d9d9d]">
                    <span className="text-[#cef565] font-bold uppercase">{meta.name}</span>
                    <span>{article.readingTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#cef565] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#9d9d9d] line-clamp-3 leading-relaxed">
                    {article.description}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs text-[#9d9d9d]">
                  <span>{article.publishedAt}</span>
                  <span className="text-[#cef565] font-bold group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Related Categories Navigation */}
        <section className="space-y-4 pt-6 border-t border-[#2e2e2e]">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Related Categories</h2>
          <div className="flex flex-wrap gap-3">
            {otherCategories.map((otherKey) => {
              const other = CATEGORIES[otherKey];
              return (
                <Link
                  key={other.slug}
                  href={`/blog/${other.slug}`}
                  className="px-4 py-2 rounded-full bg-[#161616] border border-[#2e2e2e] hover:border-[#cef565]/40 text-xs font-semibold text-[#c4c4c4] hover:text-white transition-all"
                >
                  {other.name}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Category Pairlet CTA */}
        <section className="p-8 rounded-[28px] bg-gradient-to-br from-[#1a2115] via-[#161616] to-[#141414] border border-[#cef565]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-xl font-extrabold text-white">
              Practice {meta.name} Coding Interviews Live
            </h3>
            <p className="text-xs text-[#9d9d9d] leading-relaxed">
              Create an instant, free interview room with real-time code execution and collaborative editor. No candidate account required.
            </p>
          </div>
          <Link
            href="/interview/new"
            className="inline-flex items-center space-x-2 px-6 py-3 text-xs font-extrabold text-[#131313] bg-[#cef565] hover:bg-[#b9e83c] rounded-full shrink-0 shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Free Room</span>
          </Link>
        </section>
      </main>
    </div>
  );
}
