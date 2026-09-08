import { ARTICLES, CATEGORIES, BlogCategory, BlogArticle, CategoryMeta } from "@/data/blog/articles";

export type { BlogCategory, BlogArticle, CategoryMeta };

export function getAllArticles(): BlogArticle[] {
  return ARTICLES.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getFeaturedArticles(): BlogArticle[] {
  return getAllArticles().filter((article) => article.featured);
}

export function getArticlesByCategory(category: BlogCategory): BlogArticle[] {
  return getAllArticles().filter((article) => article.category === category);
}

export function getArticleBySlug(category: string, slug: string): BlogArticle | undefined {
  return ARTICLES.find(
    (article) => article.category === category && article.slug === slug
  );
}

export function getCategoryMeta(category: string): CategoryMeta | undefined {
  return CATEGORIES[category as BlogCategory];
}

export function getAllCategorySlugs(): BlogCategory[] {
  return Object.keys(CATEGORIES) as BlogCategory[];
}

export function getRelatedArticles(article: BlogArticle, limit = 4): BlogArticle[] {
  const all = getAllArticles();
  
  // First priority: explicitly defined related articles
  let related: BlogArticle[] = [];
  if (article.relatedArticles && article.relatedArticles.length > 0) {
    related = all.filter((a) => article.relatedArticles.includes(a.slug));
  }

  // Fill remaining slots with same-category articles
  if (related.length < limit) {
    const sameCategory = all.filter(
      (a) => a.slug !== article.slug && a.category === article.category && !related.some((r) => r.slug === a.slug)
    );
    related = [...related, ...sameCategory];
  }

  // Fill any remaining with recent articles
  if (related.length < limit) {
    const others = all.filter((a) => a.slug !== article.slug && !related.some((r) => r.slug === a.slug));
    related = [...related, ...others];
  }

  return related.slice(0, limit);
}
