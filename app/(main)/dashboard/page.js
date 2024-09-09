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
} from "lucide-react";
import PasswordGenerator from "@/components/PasswordGenerator";
import { useUser } from "@auth0/nextjs-auth0/client";
import GithubProfileCard from "@/components/GithubProfileCard";

export default function Dashboard() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 ">
      {/* Password Generator */}

      <div className="max-w-6xl mx-auto space-y-8 mt-8">
        <header className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Welcome, {user.name}</h1>
          <Button asChild variant="ghost" size="icon">
            <Link href="/api/auth/logout">
              <LogOutIcon className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Link>
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GithubProfileCard
            nickname={user.nickname}
            picture={user.picture}
            name={user.name}
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
              >
                <BookmarkIcon className="h-8 w-8 mb-2" />
                Bookmarks
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center"
              >
                <SettingsIcon className="h-8 w-8 mb-2" />
                Settings
              </Button>
              {/* Add more tool buttons as needed */}
            </CardContent>
          </Card>
        </div>
      </div>
      <PasswordGenerator />

      <a href="/api/auth/logout">Logout</a>
    </div>
  );
}
