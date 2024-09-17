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
import { CodeIcon, LogOutIcon, Server, Regex } from "lucide-react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import GithubProfileCard from "@/components/GithubProfileCard";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchRecentActivities();
    }
  }, [status]);

  const fetchRecentActivities = async () => {
    try {
      // Fetch recent regex tests
      const regexResponse = await fetch("/api/regex-tests");
      const regexTests = await regexResponse.json();

      // Fetch recent code snippets
      const snippetsResponse = await fetch("/api/code-snippets");
      const codeSnippets = await snippetsResponse.json();

      // Map and combine activities
      const activities = [
        ...regexTests.map((test) => ({
          type: "regex",
          description: `Tested regex: ${test.regex}`,
          time: new Date(test.timestamp),
        })),
        ...codeSnippets.map((snippet) => ({
          type: "code",
          description: `Created snippet: ${snippet.title}`,
          time: new Date(snippet.createdAt),
        })),
      ];

      // Sort activities by time (most recent first)
      activities.sort((a, b) => b.time - a.time);

      // Limit to recent 5 activities
      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error("Error fetching recent activities:", error);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>No session found. Please sign in.</p>;
  }

  return (
    <div className="container mx-auto p-4 ">
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
            nickname={session.user.username}
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

        {/* Recent Activity Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest code snippets and regex tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <li key={index} className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {activity.type === "code" && (
                        <CodeIcon className="h-5 w-5 text-primary" />
                      )}
                      {activity.type === "regex" && (
                        <Regex className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time.toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent activities.
                </p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
