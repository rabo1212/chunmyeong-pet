"use client";

import { motion } from "framer-motion";

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[80dvh] px-6 text-center"
    >
      {/* 발바닥 아이콘 */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mb-8"
      >
        <div className="text-6xl mb-4 animate-paw-bounce">&#128062;</div>
        <h1 className="font-serif text-4xl font-bold text-pet-apricot glow-apricot mb-2">
          냥멍천명
        </h1>
        <p className="font-serif text-lg text-pet-cream">
          AI 반려동물 관상 분석
        </p>
      </motion.div>

      {/* 단계 설명 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mb-12 space-y-3"
      >
        <div className="flex flex-col gap-2 text-sm text-pet-cream/70 mt-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-pet-apricot font-bold">1.</span>
            <span>반려동물 정보 입력</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-pet-apricot font-bold">2.</span>
            <span>사진 촬영</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-pet-apricot font-bold">3.</span>
            <span>AI 관상 분석</span>
          </div>
        </div>
      </motion.div>

      {/* 시작 버튼 */}
      <motion.button
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="btn-primary text-lg px-10 py-4 rounded-xl animate-pulse-apricot"
      >
        우리 아이 관상 보기
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-6 text-xs text-pet-cream/40"
      >
        소요시간 약 1분 · 무료
      </motion.p>
    </motion.div>
  );
}
