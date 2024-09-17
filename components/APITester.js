"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";

const APITester = () => {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    setError(null);
    setResponse(null);

    const headerObject = headers.reduce((acc, { key, value }) => {
      if (key && value) acc[key] = value;
      return acc;
    }, {});

    try {
      const res = await fetch("/api/api-tester", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, url, headers: headerObject, body }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError("An error occurred while making the request.");
    }
  };

  const handleClear = () => {
    setMethod("GET");
    setUrl("");
    setHeaders([{ key: "", value: "" }]);
    setBody("");
    setResponse(null);
    setError(null);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const removeHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>API Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger>
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Enter API URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <Accordion type="single" collapsible>
          <AccordionItem value="headers">
            <AccordionTrigger>Headers</AccordionTrigger>
            <AccordionContent>
              {headers.map((header, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Key"
                    value={header.key}
                    onChange={(e) => updateHeader(index, "key", e.target.value)}
                  />
                  <Input
                    placeholder="Value"
                    value={header.value}
                    onChange={(e) =>
                      updateHeader(index, "value", e.target.value)
                    }
                  />
                  <Button
                    onClick={() => removeHeader(index)}
                    variant="destructive"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button onClick={addHeader} variant="outline">
                Add Header
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {(method === "POST" || method === "PUT") && (
          <Textarea
            placeholder="Enter request body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        )}

        <div className="flex space-x-2">
          <Button onClick={handleSend}>Send Request</Button>
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {response && (
          <Card>
            <CardHeader>
              <CardTitle>Response</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Status: {response.status}</p>
              <p>Time: {response.time}ms</p>
              <Accordion type="single" collapsible>
                <AccordionItem value="body">
                  <AccordionTrigger>Body</AccordionTrigger>
                  <AccordionContent>
                    <pre className="bg-gray-100 p-2 rounded">
                      {JSON.stringify(response.data, null, 2)}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default APITester;
