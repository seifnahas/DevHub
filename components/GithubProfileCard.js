import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function GithubProfileCard({ nickname, picture, name }) {
  const [githubData, setGithubData] = useState(null);

  // Fetch GitHub profile data based on the user's nickname
  useEffect(() => {
    if (!nickname) return;

    const fetchGithubData = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${nickname}`
        );
        const data = await response.json();
        setGithubData(data);
      } catch (error) {
        console.error("Failed to fetch GitHub data", error);
      }
    };

    fetchGithubData();
  }, [nickname]);

  if (!githubData) {
    return <div>Loading GitHub data...</div>;
  }

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={picture || githubData.avatar_url}
              alt={name || githubData.name}
            />
            <AvatarFallback>{name || githubData.name}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{name || githubData.name}</h2>
            <p className="text-muted-foreground">@{nickname}</p>
          </div>
        </div>
        <p>{githubData.bio}</p>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{githubData.public_repos} repos</span>
          <span>{githubData.followers} followers</span>
          <span>{githubData.following} following</span>
        </div>
      </CardContent>
    </Card>
  );
}
