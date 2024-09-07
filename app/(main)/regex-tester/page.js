import React from "react";
import dynamic from "next/dynamic";

const RegexTester = dynamic(() => import("@/components/RegexTester"), {
  ssr: false,
});

export default function RegexTesterPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">DevHub - Regex Tester</h1>
      <RegexTester />
    </div>
  );
}
