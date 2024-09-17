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
  const [diffResult, setDiffResult] = useState([]);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("side-by-side"); // "side-by-side" or "unified"

  // Function to compute diff
  const computeDiff = (source, target) => {
    const sourceLines = source.split("\n");
    const targetLines = target.split("\n");

    const maxLength = Math.max(sourceLines.length, targetLines.length);
    const diff = [];

    for (let i = 0; i < maxLength; i++) {
      const sourceLine = sourceLines[i];
      const targetLine = targetLines[i];

      if (sourceLine === targetLine) {
        diff.push({
          type: "unchanged",
          source: sourceLine,
          target: targetLine,
        });
      } else {
        if (sourceLine && targetLine) {
          diff.push({
            type: "modified",
            source: sourceLine,
            target: targetLine,
          });
        } else if (sourceLine && !targetLine) {
          diff.push({ type: "removed", source: sourceLine, target: "" });
        } else if (!sourceLine && targetLine) {
          diff.push({ type: "added", source: "", target: targetLine });
        }
      }
    }

    return diff;
  };

  const compareJSON = () => {
    try {
      // Parse JSON to ensure validity and pretty-print
      const sourceObj = JSON.parse(sourceJSON);
      const targetObj = JSON.parse(targetJSON);

      const prettySource = JSON.stringify(sourceObj, null, 2);
      const prettyTarget = JSON.stringify(targetObj, null, 2);

      const diff = computeDiff(prettySource, prettyTarget);
      setDiffResult(diff);
      setError("");
    } catch (err) {
      setError("Invalid JSON input. Please check both source and target JSON.");
      setDiffResult([]);
    }
  };

  const clearAll = () => {
    setSourceJSON("");
    setTargetJSON("");
    setDiffResult([]);
    setError("");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-4">
      <CardHeader>
        <CardTitle>JSON Diff Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* JSON Input Textareas */}
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
                className="h-64 p-2 border border-gray-300 rounded-md"
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
                className="h-64 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Action Buttons and View Mode Switch */}
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
                  <div className="flex items-center space-x-2 cursor-pointer">
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

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Diff Result */}
          {diffResult.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Diff Result</h3>
              {viewMode === "unified" ? (
                // Unified View
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto whitespace-pre-wrap">
                  {diffResult.map((line, index) => {
                    let style = {};
                    if (line.type === "added") {
                      style = { backgroundColor: "#e6ffed", color: "#2c662d" };
                    } else if (line.type === "removed") {
                      style = { backgroundColor: "#ffeef0", color: "#a00" };
                    } else if (line.type === "modified") {
                      style = { backgroundColor: "#fff5b1", color: "#b54700" };
                    }

                    return (
                      <div key={index} style={style}>
                        {line.type === "added"
                          ? "+ "
                          : line.type === "removed"
                          ? "- "
                          : "  "}
                        {line.target || line.source}
                      </div>
                    );
                  })}
                </pre>
              ) : (
                // Side-by-Side View
                <div className="flex">
                  <div className="w-1/2 pr-2">
                    <h4 className="text-md font-semibold mb-1">Source</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-auto whitespace-pre-wrap">
                      {diffResult.map((line, index) => {
                        let style = {};
                        if (
                          line.type === "removed" ||
                          line.type === "modified"
                        ) {
                          style = { backgroundColor: "#ffeef0", color: "#a00" };
                        }

                        return (
                          <div key={index} style={style}>
                            {line.source}
                          </div>
                        );
                      })}
                    </pre>
                  </div>
                  <div className="w-1/2 pl-2">
                    <h4 className="text-md font-semibold mb-1">Target</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-auto whitespace-pre-wrap">
                      {diffResult.map((line, index) => {
                        let style = {};
                        if (line.type === "added" || line.type === "modified") {
                          style = {
                            backgroundColor: "#e6ffed",
                            color: "#2c662d",
                          };
                        }

                        return (
                          <div key={index} style={style}>
                            {line.target}
                          </div>
                        );
                      })}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JSONDiffTool;
