import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { PROBLEMS, getProblemById } from "@/data/problems";
import { PlusCircle, ArrowLeft, Code2, BookOpen } from "lucide-react";

export async function generateStaticParams() {
  return PROBLEMS.map((problem) => ({
    problemId: problem.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ problemId: string }>;
}): Promise<Metadata> {
  const { problemId } = await params;
  const problem = getProblemById(problemId);

  if (!problem) {
    return {
      title: "Problem Not Found — CodeRoom",
    };
  }

  const title = `${problem.title} (${problem.difficulty.toUpperCase()}) — Live Coding Interview Question`;
  const description = `Practice or interview candidates on ${problem.title}. ${problem.description.slice(0, 150)}... No account required.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://coderoom-delta.vercel.app/problems/${problem.id}`,
      siteName: "CodeRoom",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://coderoom-delta.vercel.app/problems/${problem.id}`,
    },
  };
}

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ problemId: string }>;
}) {
  const { problemId } = await params;
  const problem = getProblemById(problemId);

  if (!problem) {
    notFound();
  }

  // Schema.org Question structured data for Google Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Question",
    name: problem.title,
    text: problem.description,
    answerCount: 1,
    suggestedAnswer: [
      {
        "@type": "Answer",
        text: `Starter template provided for JavaScript and TypeScript. Use CodeRoom to conduct live coding interviews with ${problem.title}.`,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-[#f4f4f4]">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Link
          href="/problems"
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#9d9d9d] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Problem Library</span>
        </Link>

        <div className="bg-[#1e1e1e] p-6 sm:p-8 rounded-[28px] border border-[#2e2e2e] space-y-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#9d9d9d] font-mono">
                {problem.category}
              </span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                {problem.title}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#cef565]/10 text-[#cef565] border border-[#cef565]/20 uppercase">
                {problem.difficulty}
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#141414] text-[#c4c4c4] border border-[#2e2e2e]">
                JS / TS
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#2e2e2e]">
            <h2 className="text-xs font-bold text-[#9d9d9d] uppercase tracking-wider">
              Problem Statement
            </h2>
            <p className="text-sm text-[#c4c4c4] leading-relaxed whitespace-pre-wrap">
              {problem.description}
            </p>
          </div>

          {problem.type !== "code_review" && problem.examples && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-[#9d9d9d] uppercase tracking-wider">
                Examples
              </h2>
              <pre className="bg-[#141414] p-4 rounded-[16px] border border-[#2e2e2e] text-xs font-mono text-[#c4c4c4] overflow-x-auto whitespace-pre-wrap">
                {problem.examples}
              </pre>
            </div>
          )}

          <div className="pt-6 border-t border-[#2e2e2e] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs text-[#9d9d9d]">
              <Code2 className="w-4 h-4 text-[#cef565]" />
              <span>Includes TypeScript & JavaScript starter code</span>
            </div>

            <Link
              href={`/interview/new?problemId=${problem.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 text-xs font-extrabold text-[#131313] bg-[#cef565] hover:bg-[#b9e83c] rounded-full shadow-xl shadow-[#cef565]/15 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start Interview with this Problem</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
