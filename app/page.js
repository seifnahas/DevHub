"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for loading to complete

    if (user) {
      // If the user is authenticated, redirect to /dashboard
      router.push("/dashboard");
    } else {
      // If the user is not authenticated, redirect to /access
      router.push("/api/auth/login");
    }
  }, [user, isLoading, router]);

  // Optionally return some loading state while redirecting
}
