import dynamic from "next/dynamic";

const JSONDiffTool = dynamic(() => import("@/components/JSONDiffTool"), {
  ssr: false,
});

export default function JSONDiff() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">DevHub - JSON Tools</h1>
      <JSONDiffTool />
    </div>
  );
}
