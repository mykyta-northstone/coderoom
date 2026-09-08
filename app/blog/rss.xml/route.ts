import { getAllArticles } from "@/lib/blog";

export async function GET() {
  const articles = getAllArticles();
  const baseUrl = "https://pairlet.dev";

  const rssItemsXml = articles
    .map((article) => {
      const link = `${baseUrl}/blog/${article.category}/${article.slug}`;
      const pubDate = new Date(article.publishedAt).toUTCString();
      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${article.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>${article.category}</category>
    </item>`;
    })
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Pairlet Blog — JavaScript &amp; Technical Interview Resources</title>
    <link>${baseUrl}/blog</link>
    <description>Practical JavaScript, TypeScript, and technical interviewing resources for software engineers and hiring managers.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=18000",
    },
  });
}
