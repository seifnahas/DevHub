"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GithubIcon,
  CodeIcon,
  BookmarkIcon,
  SettingsIcon,
  LogOutIcon,
  Sigma,
  Braces,
  FileJson,
  ChevronLeft,
  ChevronRight,
  RectangleEllipsis,
  Server,
  LayoutDashboard,
  Regex,
} from "lucide-react";
import PasswordGenerator from "@/components/PasswordGenerator";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import GithubProfileCard from "@/components/GithubProfileCard";

export default function Dashboard() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      console.log("User session:", session.user);
      console.log("GitHub username:", session.user.username);
    }
  }, [status, session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>No session found. Please sign in.</p>;
  }

  return (
    <div className="container mx-auto p-4 ">
      {/* Password Generator */}

      <div className="max-w-6xl mx-auto space-y-8 mt-8">
        <header className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Welcome, {session.user.name}</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOutIcon className="h-5 w-5" />
            <span className="sr-only">Log out</span>
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GithubProfileCard
            nickname={session.user.username} // GitHub login (username)
            picture={session.user.image}
            name={session.user.name}
          />

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Quick Tools</CardTitle>
              <CardDescription>
                Access your most-used developer tools
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
                asChild
              >
                <Link href="/code-snippets">
                  <CodeIcon className="h-8 w-8 mb-2" />
                  Code Snippets
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
                asChild
              >
                <Link href="/regex-tester">
                  <Regex className="h-8 w-8 mb-2" />
                  Regex Tester
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
                asChild
              >
                <Link href="/api-tester">
                  <Server className="h-8 w-8 mb-2" />
                  API Tester
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <PasswordGenerator />
    </div>
  );
}
