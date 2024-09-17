import dynamic from "next/dynamic";

const PasswordGenerator = dynamic(
  () => import("@/components/PasswordGenerator"),
  {
    ssr: false,
  }
);

export default function PasswordGeneratorPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">DevHub Code Snippets</h1>
      <PasswordGenerator />
    </div>
  );
}
