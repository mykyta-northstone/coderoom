import { MetadataRoute } from "next";
import { PROBLEMS } from "@/data/problems";
import { getAllArticles, getAllCategorySlugs } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pairlet.dev";

  const problemUrls: MetadataRoute.Sitemap = PROBLEMS.map((p) => ({
    url: `${baseUrl}/problems/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogCategoryUrls: MetadataRoute.Sitemap = getAllCategorySlugs().map((cat) => ({
    url: `${baseUrl}/blog/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogArticleUrls: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: `${baseUrl}/blog/${article.category}/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/problems`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/interview/new`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...blogCategoryUrls,
    ...blogArticleUrls,
    ...problemUrls,
  ];
}
