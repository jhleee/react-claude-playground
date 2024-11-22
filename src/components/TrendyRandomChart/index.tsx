import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Seeded Random Number Generator
class RandomGenerator {
  seed: number;

  constructor(seed = Math.random()) {
    this.seed = seed;
  }

  // Simple LCG (Linear Congruential Generator)
  random() {
    this.seed = (1664525 * this.seed + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }
}

const TrendyRandomChart = () => {
  const [data, setData] = useState([]);
  const [settings, setSettings] = useState({
    noiseLevel: 0.1,
    eventNoiseLevel: 0.3,
    boxBoundaryStrength: 0.5,
    cyclicStrength: 0.3,
    meanReversionRate: 0.1,
    useBoxBoundary: true,
    seed: Date.now(), // 초기 시드값
    useSeed: false, // 시드 사용 여부
  });

  const totalPoints = 500;

  const generateMathExpression = useCallback(() => {
    const expressions = [
      "Parameters:",
      `seed = ${settings.useSeed ? settings.seed : "random"}`,
      "",
      "Function:",
      "f(t) = lastValue * (1 - meanReversionRate) + (0.5 + trend + noise) * meanReversionRate",
      "",
      "where:",
      "trend = cyclicStrength * (",
      "  0.3 * sin(0.05t) +    // Long cycle",
      "  0.1 * sin(0.1t) +     // Medium cycle",
      "  0.05 * sin(0.2t)      // Short cycle",
      ")",
      "noise = seededRandom(-noiseLevel/2, noiseLevel/2)",
      "eventNoise = seededRandom(-eventNoiseLevel/2, eventNoiseLevel/2) * eventProbability",
      "boxBoundary = useBoxBoundary ? clamp(value, 0.2, 0.8) * boxBoundaryStrength : value",
    ].join("\n");
    return expressions;
  }, [settings]);

  const generateData = useCallback(() => {
    const newData = [];
    let lastValue = 0.5;

    // Initialize random generator with seed if enabled
    const rng = new RandomGenerator(
      settings.useSeed ? settings.seed : Date.now()
    );

    for (let i = 0; i < totalPoints; i++) {
      const trend =
        settings.cyclicStrength *
        (0.3 * Math.sin(i * 0.05) +
          0.1 * Math.sin(i * 0.1) +
          0.05 * Math.sin(i * 0.2));

      // Use seeded random generator
      const noise = (rng.random() - 0.5) * settings.noiseLevel;
      const eventNoise =
        rng.random() < 0.05
          ? (rng.random() - 0.5) * settings.eventNoiseLevel
          : 0;

      lastValue =
        lastValue * (1 - settings.meanReversionRate) +
        (0.5 + trend + noise + eventNoise) * settings.meanReversionRate;

      if (settings.useBoxBoundary) {
        const boxCenter = 0.5;
        const deviation = lastValue - boxCenter;
        lastValue = boxCenter + deviation * (1 - settings.boxBoundaryStrength);
        lastValue = Math.max(0.2, Math.min(0.8, lastValue));
      }

      newData.push({
        x: i,
        value: lastValue,
      });
    }
    return newData;
  }, [settings]);

  const handleSettingChange = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]:
        typeof value === "boolean"
          ? value
          : setting === "seed"
          ? parseInt(value) || prev.seed
          : parseFloat(value),
    }));
  };

  const generateNewSeed = () => {
    handleSettingChange("seed", Math.floor(Math.random() * 1000000));
  };

  useEffect(() => {
    setData(generateData());
  }, [settings, generateData]);

  const Slider = ({
    label,
    value,
    onChange,
    min = 0,
    max = 1,
    step = 0.1,
    disabled = false,
  }) => (
    <div className="flex items-center gap-4 mb-2">
      <label className="w-48">{label}:</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-48"
        disabled={disabled}
      />
      <span className="w-12 text-right">{value}</span>
    </div>
  );

  return (
    <div className="w-full p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-4">Seed Control</h3>
            <div className="flex items-center gap-4 mb-4">
              <label className="w-48">Use Fixed Seed:</label>
              <input
                type="checkbox"
                checked={settings.useSeed}
                onChange={(e) =>
                  handleSettingChange("useSeed", e.target.checked)
                }
                className="mr-4"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <label className="w-48">Seed Value:</label>
              <Input
                type="number"
                value={settings.seed}
                onChange={(e) => handleSettingChange("seed", e.target.value)}
                disabled={!settings.useSeed}
                className="w-48"
              />
              <Button onClick={generateNewSeed} disabled={!settings.useSeed}>
                New Seed
              </Button>
            </div>
          </div>

          <div className="p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-4">Parameters</h3>
            <Slider
              label="Basic Noise Level"
              value={settings.noiseLevel}
              onChange={(v) => handleSettingChange("noiseLevel", v)}
            />
            <Slider
              label="Event Noise Level"
              value={settings.eventNoiseLevel}
              onChange={(v) => handleSettingChange("eventNoiseLevel", v)}
            />
            <div className="flex items-center gap-4 mb-2">
              <label className="w-48">Box Boundary:</label>
              <input
                type="checkbox"
                checked={settings.useBoxBoundary}
                onChange={(e) =>
                  handleSettingChange("useBoxBoundary", e.target.checked)
                }
              />
            </div>
            <Slider
              label="Box Boundary Strength"
              value={settings.boxBoundaryStrength}
              onChange={(v) => handleSettingChange("boxBoundaryStrength", v)}
              disabled={!settings.useBoxBoundary}
            />
            <Slider
              label="Cyclic Strength"
              value={settings.cyclicStrength}
              onChange={(v) => handleSettingChange("cyclicStrength", v)}
            />
            <Slider
              label="Mean Reversion Rate"
              value={settings.meanReversionRate}
              onChange={(v) => handleSettingChange("meanReversionRate", v)}
            />
          </div>

          <div className="p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-4">Mathematical Expression</h3>
            <pre className="text-sm whitespace-pre-wrap">
              {generateMathExpression()}
            </pre>
          </div>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis domain={[0, 1]} ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ff0000"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TrendyRandomChart;
