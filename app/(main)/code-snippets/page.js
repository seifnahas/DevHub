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
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CodeSnippets = () => {
  const [snippets, setSnippets] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
  ];

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      const response = await fetch("/api/code-snippets");
      if (response.ok) {
        const data = await response.json();
        setSnippets(data);
        if (data.length > 0 && !selectedSnippet) {
          setSelectedSnippet(data[0]);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch snippets");
      }
    } catch (error) {
      setError(error.message || "Failed to fetch snippets");
    }
  };

  const handleAddSnippet = async () => {
    const newSnippet = {
      title: "New Snippet",
      code: "",
      language: "javascript",
      description: "",
    };

    try {
      const response = await fetch("/api/code-snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSnippet),
      });

      if (response.ok) {
        const data = await response.json();
        setSnippets([data, ...snippets]);
        setSelectedSnippet(data);
        setIsEditing(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add snippet");
      }
    } catch (error) {
      setError(error.message || "Failed to add snippet");
    }
  };

  const handleSaveSnippet = async () => {
    if (!selectedSnippet.title || !selectedSnippet.code) {
      setError("Title and code are required.");
      return;
    }

    const payload = {
      _id: selectedSnippet._id,
      title: selectedSnippet.title,
      code: selectedSnippet.code,
      language: selectedSnippet.language,
      description: selectedSnippet.description,
    };

    try {
      const response = await fetch("/api/code-snippets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedSnippet = await response.json();
        setSnippets(
          snippets.map((s) =>
            s._id === updatedSnippet._id ? updatedSnippet : s
          )
        );
        setSelectedSnippet(updatedSnippet);
        setIsEditing(false);
        setError("");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update snippet");
      }
    } catch (error) {
      setError(error.message || "Failed to update snippet");
    }
  };

  const handleDeleteSnippet = async () => {
    try {
      const response = await fetch(
        `/api/code-snippets?id=${selectedSnippet._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setSnippets(snippets.filter((s) => s._id !== selectedSnippet._id));
        setSelectedSnippet(null);
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete snippet");
      }
    } catch (error) {
      setError(error.message || "Failed to delete snippet");
    }
  };

  const filteredSnippets = snippets.filter(
    (snippet) =>
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLanguageExtension = (language) => {
    switch (language) {
      case "javascript":
      case "typescript":
        return javascript();
      case "python":
        return python();
      case "java":
        return java();
      default:
        return javascript();
    }
  };

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
                key={snippet._id}
                className={`cursor-pointer ${
                  selectedSnippet?._id === snippet._id ? "bg-secondary" : ""
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

                <Select
                  value={selectedSnippet.language}
                  onValueChange={(value) =>
                    setSelectedSnippet({ ...selectedSnippet, language: value })
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <CodeMirror
                  value={selectedSnippet.code}
                  height="200px"
                  extensions={[getLanguageExtension(selectedSnippet.language)]}
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
