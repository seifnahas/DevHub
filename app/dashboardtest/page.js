"use client";
import { useState, useEffect } from "react";
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

// Mock function to fetch user data - replace with actual API call
const fetchUserData = async () => {
  // Simulating API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    name: "Jane Doe",
    username: "janedoe",
    avatar_url: "https://github.com/ghost.png",
    bio: "Full-stack developer | Open source enthusiast",
    public_repos: 42,
    followers: 100,
    following: 50,
  };
};

export default function Dashboard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData().then(setUserData);
  }, []);

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">DevHub Dashboard</h1>
          <Button variant="ghost" size="icon">
            <LogOutIcon className="h-5 w-5" />
            <span className="sr-only">Log out</span>
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userData.avatar_url} alt={userData.name} />
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{userData.name}</h2>
                  <p className="text-muted-foreground">@{userData.username}</p>
                </div>
              </div>
              <p>{userData.bio}</p>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{userData.public_repos} repos</span>
                <span>{userData.followers} followers</span>
                <span>{userData.following} following</span>
              </div>
            </CardContent>
          </Card>

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
              >
                <CodeIcon className="h-8 w-8 mb-2" />
                Code Snippets
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

          {/* Add more cards for other features */}
        </div>
      </div>
    </div>
  );
}
