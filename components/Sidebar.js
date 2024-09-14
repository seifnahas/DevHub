"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Sigma,
  Braces,
  FileJson,
  ChevronLeft,
  ChevronRight,
  RectangleEllipsis,
  Server,
  LayoutDashboard,
  CodeIcon,
  Regex,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-40 ${
          isOpen ? "w-64" : "w-20"
        } bg-[#100c0c] h-full min-h-screen transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full p-4 space-y-4">
          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <Avatar>
              {/* <AvatarImage src={user?.picture} alt={user?.name} /> */}
              {/* <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback> */}
            </Avatar>
            {isOpen && (
              <div className="text-white">{/* <p>{user?.name}</p> */}</div>
            )}
          </div>

          {/* Toggle Button */}
          <Button
            variant="ghost"
            className="justify-start text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <ChevronLeft className="h-6 w-6" />
            ) : (
              <ChevronRight className="h-6 w-6" />
            )}
          </Button>

          {/* Sidebar Links */}
          <Button asChild variant="ghost" className="justify-start text-white">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <LayoutDashboard size={24} />
              {isOpen && <span>Dashboard</span>}
            </Link>
          </Button>

          <Button asChild variant="ghost" className="justify-start text-white">
            <Link
              href="/unit-converter"
              className="flex items-center space-x-2"
            >
              <Sigma size={24} />
              {isOpen && <span>Unit Converter</span>}
            </Link>
          </Button>

          <Button asChild variant="ghost" className="justify-start text-white">
            <Link href="/json-tools" className="flex items-center space-x-2">
              <Braces size={24} />
              {isOpen && <span>JSON Tools</span>}
            </Link>
          </Button>

          <Button asChild variant="ghost" className="justify-start text-white">
            <Link href="/code-snippets" className="flex items-center space-x-2">
              <CodeIcon size={24} />
              {isOpen && <span>Code Snippets</span>}
            </Link>
          </Button>

          <Button asChild variant="ghost" className="justify-start text-white">
            <Link href="/regex-tester" className="flex items-center space-x-2">
              <Regex size={24} />
              {isOpen && <span>Regex Tester</span>}
            </Link>
          </Button>

          <Button asChild variant="ghost" className="justify-start text-white">
            <Link
              href="/password-generator"
              className="flex items-center space-x-2"
            >
              <RectangleEllipsis size={24} />
              {isOpen && <span>Password Generator</span>}
            </Link>
          </Button>

          <Button asChild variant="ghost" className="justify-start text-white">
            <Link href="/api-tester" className="flex items-center space-x-2">
              <Server size={24} />
              {isOpen && <span>API Tester</span>}
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
