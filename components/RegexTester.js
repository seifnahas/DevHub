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

const RegexTester = () => {
  const [regex, setRegex] = useState("");
  const [testString, setTestString] = useState("");
  const [replaceString, setReplaceString] = useState("");
  const [matchResult, setMatchResult] = useState([]);
  const [replaceResult, setReplaceResult] = useState("");
  const [error, setError] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false });

  useEffect(() => {
    handleRegexTest();
  }, [regex, testString, flags]);

  const handleRegexTest = () => {
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
    } catch (err) {
      setError(err.message);
    }
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

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Match Results:</h3>
            {matchResult.length > 0 ? (
              matchResult.map((match, index) => (
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
              ))
            ) : (
              <p>No matches found</p>
            )}
          </div>

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
        </div>
      </CardContent>
    </Card>
  );
};

export default RegexTester;
