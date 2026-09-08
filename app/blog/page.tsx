import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { getAllArticles, getFeaturedArticles } from "@/lib/blog";
import { CATEGORIES, BlogCategory } from "@/data/blog/articles";
import { BookOpen, ArrowRight, Clock, Tag, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "JavaScript, TypeScript & Technical Interviewing Resources | Pairlet Blog",
  description:
    "Practical JavaScript, TypeScript, and technical interviewing resources for engineering managers, interviewers, and developers.",
  alternates: {
    canonical: "https://pairlet.dev/blog",
  },
  openGraph: {
    title: "JavaScript, TypeScript & Technical Interviewing Resources | Pairlet Blog",
    description:
      "Practical JavaScript, TypeScript, and technical interviewing resources for engineering teams.",
    url: "https://pairlet.dev/blog",
    siteName: "Pairlet",
    images: [{ url: "/icon.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JavaScript, TypeScript & Technical Interviewing Resources | Pairlet Blog",
    description:
      "Practical JavaScript, TypeScript, and technical interviewing resources for engineering teams.",
    images: ["/icon.png"],
  },
};

export default function BlogIndexPage() {
  const articles = getAllArticles();
  const featured = getFeaturedArticles();

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Pairlet Blog & Engineering Knowledge Hub",
    url: "https://pairlet.dev/blog",
    description:
      "Practical JavaScript, TypeScript, and technical interviewing resources for engineering teams.",
    publisher: {
      "@type": "Organization",
      name: "Pairlet",
      url: "https://pairlet.dev",
      logo: "https://pairlet.dev/icon.png",
    },
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#f4f4f4] flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[]} />

        {/* Hero Section */}
        <section className="space-y-6 text-center max-w-3xl mx-auto pt-4">
          <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#cef565]/10 border border-[#cef565]/25 text-xs font-bold text-[#cef565] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Engineering Resources</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            JavaScript, TypeScript & Technical Interviewing
          </h1>
          <p className="text-sm sm:text-base text-[#9d9d9d] leading-relaxed">
            Practical guides, interview question breakdowns, code review exercises, and hiring frameworks for software engineers and hiring managers.
          </p>
        </section>

        {/* Categories Navigation Cards */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-white tracking-tight">Explore Categories</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {(Object.keys(CATEGORIES) as BlogCategory[]).map((catKey) => {
              const cat = CATEGORIES[catKey];
              return (
                <Link
                  key={cat.slug}
                  href={`/blog/${cat.slug}`}
                  className="p-5 rounded-[22px] bg-[#161616] border border-[#2e2e2e] hover:border-[#cef565]/50 transition-all flex flex-col justify-between space-y-3 group hover:scale-[1.02]"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-[#cef565] uppercase tracking-wider">
                      Category
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-[#cef565] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#9d9d9d] line-clamp-2">{cat.description}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-xs font-bold text-[#cef565] pt-2">
                    <span>View articles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Articles */}
        {featured.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Featured Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featured.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.category}/${article.slug}`}
                  className="p-8 rounded-[28px] bg-gradient-to-br from-[#181f14] via-[#161616] to-[#141414] border border-[#cef565]/40 hover:border-[#cef565] transition-all flex flex-col justify-between space-y-6 group shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-xs font-mono">
                      <span className="px-3 py-1 rounded-full bg-[#cef565]/10 border border-[#cef565]/30 text-[#cef565] font-bold uppercase">
                        {CATEGORIES[article.category]?.name}
                      </span>
                      <span className="text-[#9d9d9d] flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readingTime}</span>
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white group-hover:text-[#cef565] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#9d9d9d] leading-relaxed line-clamp-3">
                      {article.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#cef565]">
                    <span>Read full article</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Articles Grid */}
        <section className="space-y-6">
          <h2 className="text-xl font-extrabold text-white tracking-tight">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.category}/${article.slug}`}
                className="p-6 rounded-[22px] bg-[#161616] border border-[#2e2e2e] hover:border-[#cef565]/40 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#9d9d9d]">
                    <span className="text-[#cef565] font-bold uppercase">
                      {CATEGORIES[article.category]?.name}
                    </span>
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

        {/* Pairlet CTA */}
        <section className="p-8 sm:p-12 rounded-[32px] bg-gradient-to-b from-[#1f2617] via-[#161616] to-[#121212] border border-[#cef565]/50 text-center space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Practice & Conduct Live Technical Interviews
          </h2>
          <p className="text-xs sm:text-sm text-[#9d9d9d] max-w-xl mx-auto leading-relaxed">
            Pairlet provides zero-signup live coding interview rooms with real-time code collaboration, Monaco editor, and instant execution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/interview/new"
              className="px-8 py-3.5 text-xs font-extrabold text-[#131313] bg-[#cef565] hover:bg-[#b9e83c] rounded-full shadow-lg transition-all"
            >
              Create Free Interview Room
            </Link>
            <Link
              href="/problems"
              className="px-6 py-3.5 text-xs font-bold text-[#f4f4f4] hover:bg-[#222] rounded-full border border-[#2e2e2e] transition-colors"
            >
              Explore 26+ Problems
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
