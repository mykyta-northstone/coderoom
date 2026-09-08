import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `https://pairlet.dev${item.href}` : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-[#9d9d9d] font-mono py-2 overflow-x-auto">
        <Link href="/" className="hover:text-white transition-colors flex items-center space-x-1 shrink-0">
          <Home className="w-3.5 h-3.5 text-[#cef565]" />
        </Link>

        {allItems.slice(1).map((item, index) => (
          <div key={index} className="flex items-center space-x-1.5 shrink-0">
            <ChevronRight className="w-3 h-3 text-[#555]" />
            {item.href ? (
              <Link href={item.href} className="hover:text-[#cef565] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#f4f4f4] font-semibold">{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
