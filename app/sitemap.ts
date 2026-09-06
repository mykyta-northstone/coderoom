import { MetadataRoute } from "next";
import { PROBLEMS } from "@/data/problems";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://coderoom-delta.vercel.app";

  const problemUrls: MetadataRoute.Sitemap = PROBLEMS.map((p) => ({
    url: `${baseUrl}/problems/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
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
      url: `${baseUrl}/interview/new`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...problemUrls,
  ];
}
