// /utils/converter.js

const conversionRates = {
  // Length conversions
  m: {
    m: 1,
    km: 0.001,
    ft: 3.28084,
    in: 39.3701,
  },
  km: {
    m: 1000,
    km: 1,
    ft: 3280.84,
    in: 39370.1,
  },
  ft: {
    m: 0.3048,
    km: 0.0003048,
    ft: 1,
    in: 12,
  },
  in: {
    m: 0.0254,
    km: 0.0000254,
    ft: 0.0833333,
    in: 1,
  },

  // Time conversions
  s: {
    s: 1,
    ms: 1000,
    min: 1 / 60,
    h: 1 / 3600,
  },
  ms: {
    s: 0.001,
    ms: 1,
    min: 1 / 60000,
    h: 1 / 3600000,
  },
  min: {
    s: 60,
    ms: 60000,
    min: 1,
    h: 1 / 60,
  },
  h: {
    s: 3600,
    ms: 3600000,
    min: 60,
    h: 1,
  },

  // Data conversions
  B: {
    B: 1,
    KB: 1 / 1024,
    MB: 1 / (1024 * 1024),
    GB: 1 / (1024 * 1024 * 1024),
  },
  KB: {
    B: 1024,
    KB: 1,
    MB: 1 / 1024,
    GB: 1 / (1024 * 1024),
  },
  MB: {
    B: 1024 * 1024,
    KB: 1024,
    MB: 1,
    GB: 1 / 1024,
  },
  GB: {
    B: 1024 * 1024 * 1024,
    KB: 1024 * 1024,
    MB: 1024,
    GB: 1,
  },

  // Speed conversions
  Mbps: {
    Mbps: 1,
    Gbps: 1 / 1000,
    "m/s": 1 / 0.000125,
    "km/h": 1 / 0.0002777778,
  },
  Gbps: {
    Mbps: 1000,
    Gbps: 1,
    "m/s": 1 / 0.000000125,
    "km/h": 1 / 0.0000002777778,
  },
  "m/s": {
    Mbps: 0.000125,
    Gbps: 0.000000125,
    "m/s": 1,
    "km/h": 3.6,
  },
  "km/h": {
    Mbps: 0.0002777778,
    Gbps: 0.0000002777778,
    "m/s": 1 / 3.6,
    "km/h": 1,
  },
};

// Temperature conversion logic
const temperatureConversion = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;

  // Celsius to other units
  if (fromUnit === "C") {
    if (toUnit === "F") {
      return (value * 9) / 5 + 32;
    } else if (toUnit === "K") {
      return value + 273.15;
    }
  }

  // Fahrenheit to other units
  if (fromUnit === "F") {
    if (toUnit === "C") {
      return ((value - 32) * 5) / 9;
    } else if (toUnit === "K") {
      return ((value - 32) * 5) / 9 + 273.15;
    }
  }

  // Kelvin to other units
  if (fromUnit === "K") {
    if (toUnit === "C") {
      return value - 273.15;
    } else if (toUnit === "F") {
      return ((value - 273.15) * 9) / 5 + 32;
    }
  }

  throw new Error("Conversion not supported");
};

export const handleConvert = (inputValue, fromUnit, toUnit) => {
  if (["C", "F", "K"].includes(fromUnit) && ["C", "F", "K"].includes(toUnit)) {
    return temperatureConversion(inputValue, fromUnit, toUnit);
  }

  if (!conversionRates[fromUnit] || !conversionRates[fromUnit][toUnit]) {
    throw new Error("Conversion not supported");
  }

  const convertedValue = inputValue * conversionRates[fromUnit][toUnit];
  return convertedValue;
};
