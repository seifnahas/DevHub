"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Copy, Trash, Edit } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

const CodeSnippets = () => {
  const [snippets, setSnippets] = useState([
    {
      id: 1,
      title: "Example Snippet",
      code: 'console.log("Hello, World!");',
      language: "javascript",
      description: "A simple console log example",
    },
  ]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (snippets.length > 0 && !selectedSnippet) {
      setSelectedSnippet(snippets[0]);
    }
  }, [snippets, selectedSnippet]);

  const handleAddSnippet = () => {
    const newSnippet = {
      id: snippets.length + 1,
      title: "New Snippet",
      code: "",
      language: "javascript",
      description: "",
    };
    setSnippets([...snippets, newSnippet]);
    setSelectedSnippet(newSnippet);
    setIsEditing(true);
  };

  const handleSaveSnippet = () => {
    if (!selectedSnippet.title || !selectedSnippet.code) {
      setError("Title and code are required.");
      return;
    }
    setError("");
    setSnippets(
      snippets.map((s) => (s.id === selectedSnippet.id ? selectedSnippet : s))
    );
    setIsEditing(false);
  };

  const handleDeleteSnippet = () => {
    setSnippets(snippets.filter((s) => s.id !== selectedSnippet.id));
    setSelectedSnippet(null);
    setIsEditing(false);
  };

  const filteredSnippets = snippets.filter(
    (snippet) =>
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Code Snippets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <Input
            type="text"
            placeholder="Search snippets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleAddSnippet}>
            <Plus className="mr-2 h-4 w-4" /> Add Snippet
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1 space-y-2">
            {filteredSnippets.map((snippet) => (
              <Card
                key={snippet.id}
                className={`cursor-pointer ${
                  selectedSnippet?.id === snippet.id ? "bg-secondary" : ""
                }`}
                onClick={() => {
                  setSelectedSnippet(snippet);
                  setIsEditing(false);
                }}
              >
                <CardHeader className="p-2">
                  <CardTitle className="text-sm">{snippet.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {snippet.language}
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="col-span-2">
            {selectedSnippet && (
              <div className="space-y-4">
                <Input
                  value={selectedSnippet.title}
                  onChange={(e) =>
                    setSelectedSnippet({
                      ...selectedSnippet,
                      title: e.target.value,
                    })
                  }
                  placeholder="Snippet Title"
                  disabled={!isEditing}
                />

                <CodeMirror
                  value={selectedSnippet.code}
                  height="200px"
                  extensions={[javascript()]}
                  onChange={(value) =>
                    setSelectedSnippet({ ...selectedSnippet, code: value })
                  }
                  editable={isEditing}
                  className="border rounded"
                />

                <Textarea
                  value={selectedSnippet.description}
                  onChange={(e) =>
                    setSelectedSnippet({
                      ...selectedSnippet,
                      description: e.target.value,
                    })
                  }
                  placeholder="Add a description..."
                  disabled={!isEditing}
                />

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() =>
                            navigator.clipboard.writeText(selectedSnippet.code)
                          }
                          disabled={isEditing}
                        >
                          <Copy className="mr-2 h-4 w-4" /> Copy
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy snippet to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div>
                    {isEditing ? (
                      <Button onClick={handleSaveSnippet}>Save</Button>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      onClick={handleDeleteSnippet}
                      className="ml-2"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeSnippets;
