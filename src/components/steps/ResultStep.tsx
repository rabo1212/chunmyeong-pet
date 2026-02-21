"use client";

import { useState, useEffect, useRef } from "react";
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseMarkdown(text: string): string {
  if (!text) return "";
  // XSS 방지: HTML 태그 이스케이프 후 마크다운 변환
  return escapeHtml(text)
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^### (.*)/gm, '<h3 class="font-bold text-base text-pet-apricot mt-4 mb-1">$1</h3>')
    .replace(/^## (.*)/gm, '<h2 class="font-bold text-lg text-pet-apricot mt-6 mb-2">$1</h2>')
    .replace(/^# (.*)/gm, '<h2 class="font-bold text-xl text-pet-apricot mt-6 mb-2">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-pet-apricot">$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
    .replace(/^\d+\. (.*)/gm, '<li class="ml-4 text-sm leading-relaxed text-pet-cream/80 list-decimal">$1</li>')
    .replace(/^- (.*)/gm, '<li class="ml-4 text-sm leading-relaxed text-pet-cream/80 list-disc">$1</li>')
    .replace(/\n\n/g, '<div class="h-3"></div>')
    .replace(/\n/g, "<br/>");
}

/** 내용이 실질적으로 비어있는지 체크 */
function isEmpty(text?: string): boolean {
  if (!text) return true;
  const stripped = text.replace(/[{}[\]"`\\]/g, "").trim();
  return stripped.length < 5;
}

/** 인라인 광고 + 카운트다운 후 잠금 해제 */
function AdUnlock({ onUnlock }: { onUnlock: () => void }) {
  const [countdown, setCountdown] = useState(5);
  const adRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    // 카카오 AdFit 로드 (중복 방지)
    if (loaded.current || !adRef.current) return;
    const ins = document.createElement("ins");
    ins.className = "kakao_ad_area";
    ins.style.display = "none";
    ins.setAttribute("data-ad-unit", "DAN-ra6Bp0jJlyb0KOOd");
    ins.setAttribute("data-ad-width", "320");
    ins.setAttribute("data-ad-height", "100");
    adRef.current.appendChild(ins);
    // 매번 새 스크립트를 로드해야 SDK가 새 ins 요소를 스캔함
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;
    adRef.current.appendChild(script);
    loaded.current = true;
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="card p-5 text-center space-y-4"
    >
      <p className="text-sm text-pet-cream/70">
        광고를 잠시 확인해주세요
      </p>
      <div ref={adRef} className="flex justify-center" />
      <p className="text-xs text-pet-cream/30">
        광고 수익은 AI 분석 비용에 사용됩니다
      </p>
      <button
        onClick={onUnlock}
        disabled={countdown > 0}
        className={`btn-primary px-8 text-sm transition-all ${
          countdown > 0 ? "opacity-50 cursor-not-allowed" : "animate-pulse-apricot"
        }`}
      >
        {countdown > 0 ? `잠금 해제 (${countdown}초)` : "결과 더 보기"}
      </button>
    </motion.div>
  );
}

export default function ResultStep({ result, petName, petPhoto, onRestart }: ResultStepProps) {
  const displayName = petName || "우리 아이";
  const gradientClass = GRADE_COLORS[result.grade] || GRADE_COLORS["A"];
  const emoji = GRADE_EMOJI[result.grade] || "⭐";
  const [unlocked, setUnlocked] = useState(false);

  const hasPastLife = !isEmpty(result.pastLife);
  const hasSuperPower = !isEmpty(result.superPower);
  const hasOwnerMatch = !isEmpty(result.ownerMatch);
  const hasLockedContent = hasPastLife || hasSuperPower || hasOwnerMatch;

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
      {!isEmpty(result.interpretation) && (
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
      )}

      {/* ===== 잠금 영역 ===== */}
      {hasLockedContent && !unlocked && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          {/* 잠긴 미리보기 */}
          <div className="relative">
            <div className="space-y-4 blur-sm pointer-events-none select-none">
              {hasPastLife && (
                <div className="card p-5">
                  <h3 className="font-bold text-lg text-pet-apricot text-center mb-3">전생 이야기</h3>
                  <p className="text-sm text-pet-cream/80">이 아이의 전생에 대한 흥미로운 이야기가 숨겨져 있습니다...</p>
                </div>
              )}
              {hasSuperPower && (
                <div className="card p-5">
                  <h3 className="font-bold text-lg text-pet-apricot text-center mb-3">숨겨진 초능력</h3>
                  <p className="text-sm text-pet-cream/80">이 아이만의 특별한 초능력이 발견되었습니다...</p>
                </div>
              )}
              {hasOwnerMatch && (
                <div className="card p-5">
                  <h3 className="font-bold text-lg text-pet-apricot text-center mb-3">주인과의 궁합</h3>
                  <p className="text-sm text-pet-cream/80">보호자와의 궁합 분석 결과가 준비되었습니다...</p>
                </div>
              )}
            </div>
            {/* 잠금 오버레이 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-pet-apricot font-bold text-lg mb-1">🔒 추가 결과 잠금</p>
                <p className="text-pet-cream/50 text-xs">광고를 확인하면 전생/초능력/궁합을 볼 수 있어요</p>
              </div>
            </div>
          </div>

          {/* 광고 + 카운트다운 */}
          <AdUnlock onUnlock={() => setUnlocked(true)} />
        </motion.div>
      )}

      {/* ===== 잠금 해제된 컨텐츠 ===== */}
      {hasLockedContent && unlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {hasPastLife && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
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
          )}

          {hasSuperPower && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
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
          )}

          {hasOwnerMatch && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="card p-5"
            >
              <h3 className="font-bold text-lg text-pet-apricot text-center mb-4">
                주인과의 궁합
              </h3>
              <div
                className="text-sm leading-relaxed text-pet-cream/80"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(result.ownerMatch!) }}
              />
            </motion.div>
          )}
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
