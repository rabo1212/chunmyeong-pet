"use client";

import type { ScoreData } from "@/lib/types";

interface ScoreChartProps {
  scores: ScoreData;
}

const SCORE_ITEMS: { key: keyof ScoreData; label: string; emoji: string; color: string }[] = [
  { key: "lucky", label: "복덩이 지수", emoji: "🍀", color: "bg-green-400" },
  { key: "charm", label: "애교 지수", emoji: "💕", color: "bg-pink-400" },
  { key: "charisma", label: "카리스마", emoji: "🦁", color: "bg-amber-400" },
  { key: "wealth", label: "재물 지수", emoji: "💰", color: "bg-yellow-400" },
  { key: "noble", label: "전생 귀족", emoji: "👑", color: "bg-purple-400" },
];

export default function ScoreChart({ scores }: ScoreChartProps) {
  return (
    <div className="card p-4 space-y-3">
      <h3 className="font-bold text-lg text-pet-apricot text-center mb-4">
        관상 지수
      </h3>
      {SCORE_ITEMS.map((item) => {
        const score = scores[item.key];
        return (
          <div key={item.key} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-pet-cream/80">
                {item.emoji} {item.label}
              </span>
              <span className="font-bold text-pet-light">{score}</span>
            </div>
            <div className="h-3 bg-pet-dark/60 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
