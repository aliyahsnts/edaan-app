"use client";

import { useState } from "react";
import { BatteryCharging } from "lucide-react";

type ManualBatteryInputProps = {
  className?: string;
  compact?: boolean;
  helperText?: string;
  initialPercentage?: number;
  label?: string;
  maxRangeKm?: number;
  onPercentageChange?: (percentage: number) => void;
  theme?: "dark" | "light";
  value?: number;
};

function clampPercentage(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

export default function ManualBatteryInput({
  className = "",
  compact = false,
  helperText = "Enter the percentage shown on the vehicle dashboard.",
  initialPercentage = 82,
  label = "Current battery",
  maxRangeKm,
  onPercentageChange,
  theme = "light",
  value,
}: ManualBatteryInputProps) {
  const [internalBatteryPercentage, setInternalBatteryPercentage] = useState(
    clampPercentage(initialPercentage),
  );
  const isControlled = typeof value === "number";
  const batteryPercentage = isControlled
    ? clampPercentage(value)
    : internalBatteryPercentage;
  const estimatedRangeKm =
    typeof maxRangeKm === "number"
      ? Math.round((maxRangeKm * batteryPercentage) / 100)
      : null;
  const isDark = theme === "dark";
  const handlePercentageChange = (nextValue: number) => {
    const nextPercentage = clampPercentage(nextValue);

    if (!isControlled) {
      setInternalBatteryPercentage(nextPercentage);
    }

    onPercentageChange?.(nextPercentage);
  };

  return (
    <div
      className={`rounded-xl ${
        isDark
          ? "border border-white/10 bg-white/10 text-white"
          : "border border-[#d1f2d9] bg-white/80 text-zinc-900"
      } ${compact ? "p-3" : "p-4"} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div
            className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${
              isDark ? "text-[#bbedcc]" : "text-[#126b34]"
            }`}
          >
            <BatteryCharging size={compact ? 14 : 16} />
            {label}
          </div>
          <p
            className={`mt-1 text-[10px] leading-snug ${
              isDark ? "text-zinc-300" : "text-zinc-500"
            }`}
          >
            {helperText}
          </p>
        </div>

        <label
          className={`flex h-10 w-20 shrink-0 items-center rounded-lg border px-2 ${
            isDark
              ? "border-white/15 bg-zinc-950/30"
              : "border-zinc-200 bg-white"
          }`}
        >
          <input
            type="number"
            min={0}
            max={100}
            value={batteryPercentage}
            onChange={(event) =>
              handlePercentageChange(event.target.valueAsNumber)
            }
            className={`min-w-0 flex-1 bg-transparent text-right text-lg font-black outline-none ${
              isDark ? "text-white" : "text-[#126b34]"
            }`}
            aria-label={`${label} percentage`}
          />
          <span
            className={`ml-1 text-xs font-black ${
              isDark ? "text-zinc-300" : "text-zinc-500"
            }`}
          >
            %
          </span>
        </label>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={batteryPercentage}
        onChange={(event) =>
          handlePercentageChange(event.target.valueAsNumber)
        }
        className="mt-3 w-full accent-[#126b34]"
        aria-label={`${label} slider`}
      />

      {estimatedRangeKm !== null ? (
        <div
          className={`mt-2 flex items-center justify-between text-xs font-bold ${
            isDark ? "text-zinc-200" : "text-zinc-700"
          }`}
        >
          <span>Estimated range</span>
          <span className={isDark ? "text-[#2bc18b]" : "text-[#126b34]"}>
            {estimatedRangeKm} km
          </span>
        </div>
      ) : null}
    </div>
  );
}
