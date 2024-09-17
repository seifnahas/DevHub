import dynamic from "next/dynamic";

const CodeSnippets = dynamic(() => import("@/components/CodeSnippets"), {
  ssr: false,
});

export default function CodeSnippetsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">DevHub Code Snippets</h1>
      <CodeSnippets />
    </div>
  );
}
