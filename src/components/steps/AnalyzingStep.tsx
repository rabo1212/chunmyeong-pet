"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PHASES = [
  "관상을 살펴보고 있어요...",
  "얼굴형과 눈을 분석 중...",
  "성격과 기질을 읽는 중...",
  "전생의 기억을 탐색 중...",
  "숨겨진 초능력을 감지 중...",
  "종합 관상을 완성하고 있어요...",
];

export default function AnalyzingStep() {
  const [phaseIdx, setPhaseIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIdx((prev) => (prev + 1) % PHASES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[70dvh] px-6 text-center"
    >
      {/* 발바닥 바운스 애니메이션 */}
      <div className="text-7xl mb-8 animate-paw-bounce">
        &#128062;
      </div>

      {/* 분석 단계 문구 */}
      <motion.p
        key={phaseIdx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="text-pet-cream/80 text-base mb-6"
      >
        {PHASES[phaseIdx]}
      </motion.p>

      {/* 진행 바 */}
      <div className="w-48 h-1 bg-pet-deep rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-pet-apricot/60 rounded-full"
          animate={{ width: ["0%", "100%"] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <p className="text-xs text-pet-cream/40 mt-8">
        AI가 관상을 분석하고 있어요
      </p>
    </motion.div>
  );
}
