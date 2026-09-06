import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeRoom — Free Live Coding Interviews for JavaScript & TypeScript",
  description:
    "Create a live coding room, share the link, and interview candidates in real time. No candidate account required.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark antialiased nl">
      <body className="min-h-full flex flex-col bg-[#121212] text-[#f4f4f4] nl">
        {children}
      </body>
    </html>
  );
}
