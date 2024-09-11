"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";

const RegexTester = () => {
  const [regex, setRegex] = useState("");
  const [testString, setTestString] = useState("");
  const [replaceString, setReplaceString] = useState("");
  const [matchResult, setMatchResult] = useState([]);
  const [replaceResult, setReplaceResult] = useState("");
  const [error, setError] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [recentTests, setRecentTests] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetchRecentTests();
    }
  }, [session]);

  const fetchRecentTests = async () => {
    try {
      const response = await fetch("/api/regex-tests");
      if (response.ok) {
        const data = await response.json();
        setRecentTests(data);
      } else {
        throw new Error("Failed to fetch recent tests");
      }
    } catch (error) {
      console.error("Error fetching recent tests:", error);
      setError("Failed to fetch recent tests. Please try again later.");
    }
  };

  const handleRegexTest = async () => {
    setError("");
    setMatchResult([]);
    setReplaceResult("");

    if (!regex || !testString) return;

    try {
      const flagString = Object.entries(flags)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join("");
      const regexObj = new RegExp(regex, flagString);
      const matches = [...testString.matchAll(regexObj)];
      setMatchResult(matches);

      if (replaceString) {
        setReplaceResult(testString.replace(regexObj, replaceString));
      }

      if (session) {
        await saveRegexTest();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const saveRegexTest = async () => {
    try {
      const response = await fetch("/api/regex-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ regex, testString }),
      });

      if (response.ok) {
        await fetchRecentTests();
      } else {
        throw new Error("Failed to save regex test");
      }
    } catch (error) {
      console.error("Error saving regex test:", error);
      setError("Failed to save regex test. Please try again later.");
    }
  };

  const handleDeleteTest = async (testId) => {
    try {
      const response = await fetch(`/api/regex-tests?testId=${testId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchRecentTests();
      } else {
        throw new Error("Failed to delete regex test");
      }
    } catch (error) {
      console.error("Error deleting regex test:", error);
      setError("Failed to delete regex test. Please try again later.");
    }
  };

  const handleLoadRecentTest = (test) => {
    setRegex(test.regex);
    setTestString(test.testString);
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleClearAll = () => {
    setRegex("");
    setTestString("");
    setReplaceString("");
    setMatchResult([]);
    setReplaceResult("");
    setError("");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Regex Tester</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          <div>
            <Textarea
              placeholder="Enter your regex here"
              value={regex}
              onChange={(e) => setRegex(e.target.value)}
              className="font-mono"
            />
            <div className="flex space-x-4 mt-2">
              <TooltipProvider>
                {Object.entries(flags).map(([key, value]) => (
                  <Tooltip key={key}>
                    <TooltipTrigger>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) =>
                            setFlags({ ...flags, [key]: checked })
                          }
                        />
                        <span>{key}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {key === "g"
                          ? "Global"
                          : key === "i"
                          ? "Case-insensitive"
                          : "Multiline"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>

          <Textarea
            placeholder="Enter your test string here"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className="min-h-[100px]"
          />

          <Textarea
            placeholder="Enter replacement string (optional)"
            value={replaceString}
            onChange={(e) => setReplaceString(e.target.value)}
          />

          <Button onClick={handleRegexTest}>Test Regex</Button>

          {matchResult.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Match Results:</h3>
              {matchResult.map((match, index) => (
                <div key={index} className="bg-secondary p-2 rounded">
                  <p>
                    Match {index + 1}: {match[0]}
                  </p>
                  <p>Index: {match.index}</p>
                  {match.groups &&
                    Object.entries(match.groups).map(([key, value]) => (
                      <p key={key}>
                        Group {key}: {value}
                      </p>
                    ))}
                </div>
              ))}
            </div>
          )}

          {replaceResult && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Replace Result:</h3>
              <p className="bg-secondary p-2 rounded">{replaceResult}</p>
            </div>
          )}

          <div className="flex space-x-2">
            <Button onClick={() => handleCopyToClipboard(regex)}>
              Copy Regex
            </Button>
            <Button onClick={() => handleCopyToClipboard(testString)}>
              Copy Test String
            </Button>
            <Button onClick={handleClearAll}>Clear All</Button>
          </div>

          {session && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Recent Tests:</h3>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                {recentTests.length > 0 ? (
                  recentTests.map((test) => (
                    <div
                      key={test._id}
                      className="mb-4 p-2 bg-secondary rounded-md"
                    >
                      <p className="font-mono text-sm">Regex: {test.regex}</p>
                      <p className="text-sm truncate">
                        Test String: {test.testString}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(test.timestamp).toLocaleString()}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadRecentTest(test)}
                        >
                          Load
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteTest(test._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No recent tests found.</p>
                )}
              </ScrollArea>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegexTester;
