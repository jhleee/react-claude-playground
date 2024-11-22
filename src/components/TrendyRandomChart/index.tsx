import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartData {
  x: number;
  value: number;
}

interface Settings {
  noiseLevel: number;
  eventNoiseLevel: number;
  boxBoundaryStrength: number;
  cyclicStrength: number;
  meanReversionRate: number;
  useBoxBoundary: boolean;
  seed: number;
  useSeed: boolean;
}

// Seeded Random Number Generator
class RandomGenerator {
  private seed: number;

  constructor(seed: number = Math.random()) {
    this.seed = seed;
  }

  // Simple LCG (Linear Congruential Generator)
  random(): number {
    this.seed = (1664525 * this.seed + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }
}

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const TrendyRandomChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [settings, setSettings] = useState<Settings>({
    noiseLevel: 0.1,
    eventNoiseLevel: 0.3,
    boxBoundaryStrength: 0.5,
    cyclicStrength: 0.3,
    meanReversionRate: 0.1,
    useBoxBoundary: true,
    seed: Date.now(),
    useSeed: false,
  });

  const totalPoints: number = 500;

  const generateMathExpression = useCallback((): string => {
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

  const generateData = useCallback((): ChartData[] => {
    const newData: ChartData[] = [];
    let lastValue: number = 0.5;

    // Initialize random generator with seed if enabled
    const rng = new RandomGenerator(
      settings.useSeed ? settings.seed : Date.now()
    );

    for (let i = 0; i < totalPoints; i++) {
      const trend: number =
        settings.cyclicStrength *
        (0.3 * Math.sin(i * 0.05) +
          0.1 * Math.sin(i * 0.1) +
          0.05 * Math.sin(i * 0.2));

      // Use seeded random generator
      const noise: number = (rng.random() - 0.5) * settings.noiseLevel;
      const eventNoise: number =
        rng.random() < 0.05
          ? (rng.random() - 0.5) * settings.eventNoiseLevel
          : 0;

      lastValue =
        lastValue * (1 - settings.meanReversionRate) +
        (0.5 + trend + noise + eventNoise) * settings.meanReversionRate;

      if (settings.useBoxBoundary) {
        const boxCenter: number = 0.5;
        const deviation: number = lastValue - boxCenter;
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

  const handleSettingChange = (
    setting: keyof Settings,
    value: number | boolean | string
  ): void => {
    setSettings((prev) => ({
      ...prev,
      [setting]:
        typeof value === "boolean"
          ? value
          : setting === "seed"
          ? parseInt(value.toString()) || prev.seed
          : parseFloat(value.toString()),
    }));
  };

  const generateNewSeed = (): void => {
    handleSettingChange("seed", Math.floor(Math.random() * 1000000));
  };

  useEffect(() => {
    setData(generateData());
  }, [settings, generateData]);

  const Slider: React.FC<SliderProps> = ({
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
