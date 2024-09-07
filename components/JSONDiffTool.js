"use client";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const JSONDiffTool = () => {
  const [sourceJSON, setSourceJSON] = useState("");
  const [targetJSON, setTargetJSON] = useState("");
  const [diffResult, setDiffResult] = useState("");
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("side-by-side");

  const compareJSON = () => {
    try {
      const source = JSON.parse(sourceJSON);
      const target = JSON.parse(targetJSON);

      // Simple diff implementation (you might want to use a library for more complex diffs)
      const diff = {};
      Object.keys(source).forEach((key) => {
        if (JSON.stringify(source[key]) !== JSON.stringify(target[key])) {
          diff[key] = {
            source: source[key],
            target: target[key],
          };
        }
      });

      Object.keys(target).forEach((key) => {
        if (!(key in source)) {
          diff[key] = {
            source: undefined,
            target: target[key],
          };
        }
      });

      setDiffResult(JSON.stringify(diff, null, 2));
      setError("");
    } catch (err) {
      setError("Invalid JSON input. Please check both source and target JSON.");
    }
  };

  const clearAll = () => {
    setSourceJSON("");
    setTargetJSON("");
    setDiffResult("");
    setError("");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>JSON Diff Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label
                htmlFor="sourceJSON"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Source JSON
              </label>
              <Textarea
                id="sourceJSON"
                value={sourceJSON}
                onChange={(e) => setSourceJSON(e.target.value)}
                placeholder="Paste your source JSON here"
                className="h-64"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="targetJSON"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Target JSON
              </label>
              <Textarea
                id="targetJSON"
                value={targetJSON}
                onChange={(e) => setTargetJSON(e.target.value)}
                placeholder="Paste your target JSON here"
                className="h-64"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Button onClick={compareJSON}>Compare JSON</Button>
              <Button variant="outline" onClick={clearAll}>
                Clear All
              </Button>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Side-by-Side</span>
                    <Switch
                      checked={viewMode === "unified"}
                      onCheckedChange={() =>
                        setViewMode(
                          viewMode === "side-by-side"
                            ? "unified"
                            : "side-by-side"
                        )
                      }
                    />
                    <span className="text-sm">Unified</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch between side-by-side and unified diff views</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {diffResult && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Diff Result</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto">
                <code>{diffResult}</code>
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JSONDiffTool;
