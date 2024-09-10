"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait for loading to complete

    if (session) {
      // If the user is authenticated, redirect to /dashboard
      router.push("/dashboard");
    } else {
      // If the user is not authenticated, redirect to /access
      router.push("/access");
    }
  }, [session, status, router]);

  // Optionally return some loading state while redirecting
  return null;
}
