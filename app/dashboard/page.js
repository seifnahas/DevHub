import PasswordGenerator from "@/components/PasswordGenerator";
import React from "react";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">DevHub Dashboard</h1>
      <PasswordGenerator />
    </div>
  );
}
