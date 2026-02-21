"use client";

import { motion } from "framer-motion";
import ScoreChart from "@/components/ui/ScoreChart";
import ResultCard from "@/components/ResultCard";
import ShareButtons from "@/components/ShareButtons";
import CoupangBanner from "@/components/CoupangBanner";
import type { PetAnalysisResult } from "@/lib/types";

interface ResultStepProps {
  result: PetAnalysisResult;
  petName?: string;
  petPhoto?: string | null;
  onRestart: () => void;
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

function parseMarkdown(text: string): string {
  if (!text) return "";
  return text
    // 코드블록 제거 (```json ... ``` 등)
    .replace(/```[\s\S]*?```/g, "")
    // ### 소제목
    .replace(/^### (.*)/gm, '<h3 class="font-bold text-base text-pet-apricot mt-4 mb-1">$1</h3>')
    // ## 제목
    .replace(/^## (.*)/gm, '<h2 class="font-bold text-lg text-pet-apricot mt-6 mb-2">$1</h2>')
    // # 대제목
    .replace(/^# (.*)/gm, '<h2 class="font-bold text-xl text-pet-apricot mt-6 mb-2">$1</h2>')
    // 볼드
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-pet-apricot">$1</strong>')
    // 이탤릭
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // 번호 목록
    .replace(/^\d+\. (.*)/gm, '<li class="ml-4 text-sm leading-relaxed text-pet-cream/80 list-decimal">$1</li>')
    // 불릿 목록
    .replace(/^- (.*)/gm, '<li class="ml-4 text-sm leading-relaxed text-pet-cream/80 list-disc">$1</li>')
    // 연속 줄바꿈 → 단락 구분
    .replace(/\n\n/g, '<div class="h-3"></div>')
    // 단일 줄바꿈
    .replace(/\n/g, "<br/>");
}

export default function ResultStep({ result, petName, petPhoto, onRestart }: ResultStepProps) {
  const displayName = petName || "우리 아이";
  const gradientClass = GRADE_COLORS[result.grade] || GRADE_COLORS["A"];
  const emoji = GRADE_EMOJI[result.grade] || "⭐";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 py-6 space-y-6 no-scrollbar"
    >
      {/* 사진 + 등급 히어로 */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="card p-6 text-center"
      >
        {petPhoto && (
          <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-pet-apricot/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={petPhoto}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <p className="text-sm text-pet-cream/60 mb-2">
          {displayName}의 관상 등급
        </p>
        <div className={`inline-block px-6 py-3 rounded-2xl bg-gradient-to-r ${gradientClass} font-bold text-2xl mb-2`}>
          {emoji} {result.grade}급
        </div>
        <p className="text-lg font-bold text-pet-apricot">{result.gradeTitle}</p>
      </motion.div>

      {/* 점수 차트 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ScoreChart scores={result.scores} />
      </motion.div>

      {/* AI 관상 해석 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="card p-5"
      >
        <h3 className="font-bold text-lg text-pet-apricot text-center mb-4">
          AI 관상 해석
        </h3>
        <div
          className="text-sm leading-relaxed text-pet-cream/80"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(result.interpretation) }}
        />
      </motion.div>

      {/* 전생 스토리 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="card p-5"
      >
        <h3 className="font-bold text-lg text-pet-apricot text-center mb-3">
          전생 이야기
        </h3>
        <div
          className="text-sm leading-relaxed text-pet-cream/80"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(result.pastLife) }}
        />
      </motion.div>

      {/* 숨겨진 초능력 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="card p-5"
      >
        <h3 className="font-bold text-lg text-pet-apricot text-center mb-3">
          숨겨진 초능력
        </h3>
        <div
          className="text-sm leading-relaxed text-pet-cream/80 text-center"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(result.superPower) }}
        />
      </motion.div>

      {/* 주인 궁합 (선택사항) */}
      {result.ownerMatch && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="card p-5"
        >
          <h3 className="font-bold text-lg text-pet-apricot text-center mb-4">
            주인과의 궁합
          </h3>
          <div
            className="text-sm leading-relaxed text-pet-cream/80"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(result.ownerMatch) }}
          />
        </motion.div>
      )}

      {/* 공유용 카드 (숨김) */}
      <div className="overflow-hidden" style={{ height: 0 }}>
        <ResultCard
          scores={result.scores}
          grade={result.grade}
          gradeTitle={result.gradeTitle}
          petName={petName}
        />
      </div>

      {/* 공유 버튼 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <h3 className="text-sm text-pet-cream/60 text-center mb-3">결과 공유하기</h3>
        <ShareButtons />
      </motion.div>

      {/* 쿠팡 파트너스 */}
      <div className="flex justify-center">
        <CoupangBanner />
      </div>

      {/* 다시 하기 */}
      <div className="text-center pt-4 pb-8">
        <button onClick={onRestart} className="btn-secondary">
          다시 분석하기
        </button>
      </div>
    </motion.div>
  );
}
