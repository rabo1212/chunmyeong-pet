"use client";

import type { ScoreData } from "@/lib/types";

interface ResultCardProps {
  scores: ScoreData;
  grade: string;
  gradeTitle: string;
  petName?: string;
}

const SCORE_LABELS: { key: keyof ScoreData; label: string; color: string }[] = [
  { key: "lucky", label: "복덩이", color: "#4ade80" },
  { key: "charm", label: "애교", color: "#f472b6" },
  { key: "charisma", label: "카리스마", color: "#fbbf24" },
  { key: "wealth", label: "재물", color: "#facc15" },
  { key: "noble", label: "전생귀족", color: "#a78bfa" },
];

export default function ResultCard({ scores, grade, gradeTitle, petName }: ResultCardProps) {
  const displayName = petName || "우리 아이";

  return (
    <div
      id="result-card"
      className="bg-pet-dark p-6 rounded-2xl border border-pet-apricot/30 max-w-sm mx-auto"
      style={{ width: 360, minHeight: 360 }}
    >
      <div className="text-center mb-4">
        <p className="text-2xl font-bold text-pet-apricot">🐾 냥멍천명 🐾</p>
        <p className="text-xs text-pet-cream/50 mt-1">{displayName}의 관상</p>
      </div>

      {/* 점수 바 */}
      <div className="space-y-2 mb-4">
        {SCORE_LABELS.map((item) => {
          const score = scores[item.key];
          return (
            <div key={item.key} className="flex items-center gap-2">
              <span className="text-[11px] text-pet-cream/70 w-14 text-right">{item.label}</span>
              <div className="flex-1 h-2.5 bg-pet-deep rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${score}%`, backgroundColor: item.color }}
                />
              </div>
              <span className="text-[11px] font-bold text-pet-light w-7">{score}</span>
            </div>
          );
        })}
      </div>

      {/* 등급 */}
      <div className="text-center mb-2">
        <span className="inline-block px-4 py-1.5 rounded-full bg-pet-apricot/20 text-pet-apricot font-bold text-sm">
          {grade}급 · {gradeTitle}
        </span>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-pet-cream/30">chunmyeong-pet.vercel.app</p>
      </div>
    </div>
  );
}
