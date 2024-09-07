"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // If the user is authenticated, redirect to /dashboard
      router.push("/dashboard");
    } else if (status === "unauthenticated") {
      // If the user is not authenticated, redirect to /access
      router.push("/access");
    }
  }, [session, status, router]);

  // Optionally return some loading state while redirecting
  return <div>Loading...</div>;
}
