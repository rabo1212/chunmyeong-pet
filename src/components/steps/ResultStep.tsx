"use client";

import { motion } from "framer-motion";
import ScoreChart from "@/components/ui/ScoreChart";
import GradeCard from "@/components/ui/GradeCard";
import ResultCard from "@/components/ResultCard";
import ShareButtons from "@/components/ShareButtons";
import CoupangBanner from "@/components/CoupangBanner";
import type { PetAnalysisResult } from "@/lib/types";

interface ResultStepProps {
  result: PetAnalysisResult;
  petName?: string;
  onRestart: () => void;
}

function parseMarkdown(text: string): string {
  return text
    .replace(/## (.*)/g, '<h2 class="font-bold text-lg text-pet-apricot mt-6 mb-2">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-pet-apricot">$1</strong>')
    .replace(/\n- (.*)/g, '\n<li class="ml-4 text-sm leading-relaxed text-pet-cream/80">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

export default function ResultStep({ result, petName, onRestart }: ResultStepProps) {
  const displayName = petName || "우리 아이";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 py-6 space-y-6 no-scrollbar"
    >
      {/* 타이틀 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-pet-apricot glow-apricot">
          {displayName}의 관상 분석
        </h2>
        <p className="text-sm text-pet-cream/50 mt-1">
          AI 반려동물 관상 분석 결과
        </p>
      </div>

      {/* 종합 등급 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <GradeCard
          grade={result.grade}
          gradeTitle={result.gradeTitle}
          petName={petName}
        />
      </motion.div>

      {/* 점수 차트 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <ScoreChart scores={result.scores} />
      </motion.div>

      {/* AI 관상 해석 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="card p-5"
      >
        <h3 className="font-bold text-lg text-pet-apricot text-center mb-4">
          AI 관상 해석
        </h3>
        <div
          className="text-sm leading-relaxed text-pet-cream/80 space-y-1"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(result.interpretation) }}
        />
      </motion.div>

      {/* 전생 스토리 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="card p-5"
      >
        <h3 className="font-bold text-lg text-pet-apricot text-center mb-3">
          전생 이야기
        </h3>
        <p className="text-sm leading-relaxed text-pet-cream/80">
          {result.pastLife}
        </p>
      </motion.div>

      {/* 숨겨진 초능력 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="card p-5"
      >
        <h3 className="font-bold text-lg text-pet-apricot text-center mb-3">
          숨겨진 초능력
        </h3>
        <p className="text-sm leading-relaxed text-pet-cream/80 text-center">
          {result.superPower}
        </p>
      </motion.div>

      {/* 주인 궁합 (선택사항) */}
      {result.ownerMatch && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="card p-5"
        >
          <h3 className="font-bold text-lg text-pet-apricot text-center mb-4">
            주인과의 궁합
          </h3>
          <div
            className="text-sm leading-relaxed text-pet-cream/80 space-y-1"
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
        transition={{ delay: 1.1 }}
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
