"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { GithubIcon } from "lucide-react";
import Logo from "../public/logo.png";

const LoginSignup = () => {
  const handleGithubSignIn = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#201c1c]">
      <Card className="w-full max-w-md bg-[#100c0c]">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src={Logo}
              alt="Logo"
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
          {/* Explicitly set the color to match */}
          <CardTitle className="text-2xl font-bold text-center text-muted-foreground">
            Welcome to Devhub!
          </CardTitle>
          <CardDescription className="text-center">
            Login or sign up with your GitHub account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGithubSignIn}
            className="w-full flex items-center justify-center"
            variant="outline"
          >
            <GithubIcon className="mr-2 h-4 w-4" />
            Continue with GitHub
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginSignup;
