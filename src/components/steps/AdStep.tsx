"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AdStepProps {
  onNext: () => void;
}

function KakaoAdFit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    if (!containerRef.current) return;

    const ins = document.createElement("ins");
    ins.className = "kakao_ad_area";
    ins.style.display = "none";
    ins.setAttribute("data-ad-unit", "DAN-ra6Bp0jJlyb0KOOd");
    ins.setAttribute("data-ad-width", "320");
    ins.setAttribute("data-ad-height", "100");
    containerRef.current.appendChild(ins);

    // AdFit SDK 로드 후 광고 렌더링
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;
    containerRef.current.appendChild(script);
    loaded.current = true;
  }, []);

  return <div ref={containerRef} className="flex justify-center" />;
}

export default function AdStep({ onNext }: AdStepProps) {
  const [countdown, setCountdown] = useState(5);

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[70dvh] px-6 text-center"
    >
      <div className="mb-6">
        <p className="text-pet-apricot font-serif text-xl mb-2">분석이 완료되었습니다!</p>
        <p className="text-pet-cream/60 text-sm">
          잠시 후 결과를 확인할 수 있습니다
        </p>
      </div>

      {/* 카카오 AdFit 광고 */}
      <div className="w-full max-w-sm mb-6">
        <KakaoAdFit />
      </div>

      <p className="text-xs text-pet-cream/30 mb-4">
        광고 수익은 AI 분석 비용에 사용됩니다
      </p>

      <button
        onClick={onNext}
        disabled={countdown > 0}
        className={`btn-primary px-10 transition-all ${
          countdown > 0 ? "opacity-50 cursor-not-allowed" : "animate-pulse-apricot"
        }`}
      >
        {countdown > 0 ? `결과 확인 (${countdown}초)` : "결과 확인하기"}
      </button>
    </motion.div>
  );
}
