"use client";

interface GradeCardProps {
  grade: string;
  gradeTitle: string;
  petName?: string;
}

const GRADE_COLORS: Record<string, string> = {
  SS: "from-amber-400 to-yellow-300 text-amber-900",
  S: "from-pet-apricot to-orange-300 text-orange-900",
  A: "from-pet-blue to-blue-300 text-blue-900",
  B: "from-pet-lavender to-purple-300 text-purple-900",
  C: "from-green-400 to-emerald-300 text-emerald-900",
};

const GRADE_EMOJI: Record<string, string> = {
  SS: "✨", S: "⭐", A: "🌟", B: "💫", C: "🌈",
};

export default function GradeCard({ grade, gradeTitle, petName }: GradeCardProps) {
  const gradientClass = GRADE_COLORS[grade] || GRADE_COLORS["A"];
  const emoji = GRADE_EMOJI[grade] || "⭐";

  return (
    <div className="card p-6 text-center">
      <p className="text-sm text-pet-cream/60 mb-2">
        {petName ? `${petName}의 종합 등급` : "종합 등급"}
      </p>
      <div className={`inline-block px-6 py-3 rounded-2xl bg-gradient-to-r ${gradientClass} font-bold text-2xl mb-3`}>
        {emoji} {grade}급
      </div>
      <p className="text-lg font-bold text-pet-apricot">{gradeTitle}</p>
    </div>
  );
}
