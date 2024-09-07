"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeftRight, Copy, RefreshCw } from "lucide-react";
import { handleConvert } from "@/utils/converter";

const unitTypes = [
  { value: "length", label: "Length" },
  { value: "weight", label: "Weight" },
  { value: "time", label: "Time" },
  { value: "data", label: "Data" },
  { value: "speed", label: "Speed" },
  { value: "temperature", label: "Temperature" },
];

const unitOptions = {
  length: [
    { value: "m", label: "Meters" },
    { value: "km", label: "Kilometers" },
    { value: "ft", label: "Feet" },
    { value: "in", label: "Inches" },
  ],
  weight: [
    { value: "kg", label: "Kilograms" },
    { value: "g", label: "Grams" },
    { value: "lb", label: "Pounds" },
    { value: "oz", label: "Ounces" },
  ],
  time: [
    { value: "s", label: "Seconds" },
    { value: "ms", label: "Milliseconds" },
    { value: "min", label: "Minutes" },
    { value: "h", label: "Hours" },
  ],
  data: [
    { value: "B", label: "Bytes" },
    { value: "KB", label: "Kilobytes" },
    { value: "MB", label: "Megabytes" },
    { value: "GB", label: "Gigabytes" },
  ],
  speed: [
    { value: "Mbps", label: "Mbps" },
    { value: "Gbps", label: "Gbps" },
    { value: "m/s", label: "m/s" },
    { value: "km/h", label: "km/h" },
  ],
  temperature: [
    { value: "C", label: "Celsius" },
    { value: "F", label: "Fahrenheit" },
    { value: "K", label: "Kelvin" },
  ],
};

const UnitConverter = () => {
  const [unitType, setUnitType] = useState("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleConvertResult = useCallback(() => {
    try {
      const converted = handleConvert(parseFloat(inputValue), fromUnit, toUnit);
      setResult(converted.toString());
      setError("");
    } catch (err) {
      setError("Conversion failed");
      setResult("");
    }
  }, [inputValue, fromUnit, toUnit]); // Dependencies for useCallback

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setInputValue(result);
    setResult(inputValue);
  };

  const handleClear = () => {
    setInputValue("");
    setResult("");
    setError("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  useEffect(() => {
    handleConvertResult();
  }, [inputValue, fromUnit, toUnit, handleConvertResult]);

  return (
    <div className="p-6 max-w-md mx-auto  rounded-xl shadow-md space-y-4">
      <Select onValueChange={setUnitType} value={unitType}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select unit type" />
        </SelectTrigger>
        <SelectContent>
          {unitTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex space-x-2 items-center">
        <Select onValueChange={setFromUnit} value={fromUnit}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="From" />
          </SelectTrigger>
          <SelectContent>
            {unitOptions[unitType].map((unit) => (
              <SelectItem key={unit.value} value={unit.value}>
                {unit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleSwap} size="icon">
          <ArrowLeftRight className="h-4 w-4" />
        </Button>

        <Select onValueChange={setToUnit} value={toUnit}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="To" />
          </SelectTrigger>
          <SelectContent>
            {unitOptions[unitType].map((unit) => (
              <SelectItem key={unit.value} value={unit.value}>
                {unit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Input
          type="number"
          placeholder="Enter value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Slider
          min={0}
          max={1000}
          step={1}
          value={[parseFloat(inputValue) || 0]}
          onValueChange={(value) => setInputValue(value[0].toString())}
        />
      </div>

      <Input type="text" placeholder="Result" value={result} readOnly />

      <div className="flex space-x-2">
        <Button onClick={handleClear} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Clear
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy result to clipboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UnitConverter;
