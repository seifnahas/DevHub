"use client";
import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";

const PasswordGenerator = () => {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(false);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [showToast, setShowToast] = useState(false);

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let chars = "";
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSpecial) chars += special;

    if (chars.length === 0) {
      setPassword("Please select at least one character type");
      setStrength("");
      return;
    }

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  useEffect(() => {
    generatePassword();
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSpecial,
  ]);

  useEffect(() => {
    if (password.length > 0) {
      const score =
        (includeUppercase ? 1 : 0) +
        (includeLowercase ? 1 : 0) +
        (includeNumbers ? 1 : 0) +
        (includeSpecial ? 1 : 0);

      if (length < 8) setStrength("Weak");
      else if (length < 12) setStrength(score >= 3 ? "Moderate" : "Weak");
      else setStrength(score >= 3 ? "Strong" : "Moderate");
    } else {
      setStrength("");
    }
  }, [password]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Password Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Password Length: {length}
          </label>
          <Slider
            min={8}
            max={64}
            step={1}
            value={[length]}
            onValueChange={(value) => setLength(value[0])}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Include:</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={setIncludeUppercase}
              />
              <label htmlFor="uppercase">Uppercase</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={setIncludeLowercase}
              />
              <label htmlFor="lowercase">Lowercase</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={setIncludeNumbers}
              />
              <label htmlFor="numbers">Numbers</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="special"
                checked={includeSpecial}
                onCheckedChange={setIncludeSpecial}
              />
              <label htmlFor="special">Special</label>
            </div>
          </div>
        </div>

        <Button onClick={generatePassword} className="w-full">
          Generate Password
        </Button>

        <div className="relative">
          <Input value={password} readOnly className="pr-10" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {strength && (
          <Badge
            variant={
              strength === "Weak"
                ? "destructive"
                : strength === "Moderate"
                ? "warning"
                : "success"
            }
          >
            {strength}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default PasswordGenerator;
