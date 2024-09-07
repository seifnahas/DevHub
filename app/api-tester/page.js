import dynamic from "next/dynamic";

const APITester = dynamic(() => import("@/components/APITester"), {
  ssr: false,
});

export default function APITesterPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">DevHub API Tester</h1>
      <APITester />
    </div>
  );
}
