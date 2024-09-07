"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiGoogle, SiGithub } from "react-icons/si";
import { signIn } from "next-auth/react";

const LoginSignup = () => {
  const handleGithubSignIn = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#201c1c]">
      <Card className="w-[350px] bg-[#100c0c]">
        <CardContent className="pt-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Signup</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <div className="space-y-4">
                <Button className="w-full flex items-center justify-center space-x-2 bg-white text-black hover:bg-gray-100">
                  <SiGoogle size={20} />
                  <span>Login with Google</span>
                </Button>
                <Button
                  className="w-full flex items-center justify-center space-x-2 bg-gray-800 text-white hover:bg-gray-700"
                  onClick={handleGithubSignIn}
                >
                  <SiGithub size={20} />
                  <span>Login with GitHub</span>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <div className="space-y-4">
                <Button className="w-full flex items-center justify-center space-x-2 bg-white text-black hover:bg-gray-100">
                  <SiGoogle size={20} />
                  <span>Signup with Google</span>
                </Button>
                <Button
                  className="w-full flex items-center justify-center space-x-2 bg-gray-800 text-white hover:bg-gray-700"
                  onClick={handleGithubSignIn}
                >
                  <SiGithub size={20} />
                  <span>Signup with GitHub</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginSignup;
