"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { OwnerInfo } from "@/lib/types";

interface OwnerInfoStepProps {
  onNext: (info: OwnerInfo | null) => void;
  onBack: () => void;
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export default function OwnerInfoStep({ onNext, onBack }: OwnerInfoStepProps) {
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [gender, setGender] = useState<"male" | "female">("male");

  const days = Array.from(
    { length: getDaysInMonth(year, month) },
    (_, i) => i + 1
  );

  const handleSubmit = () => {
    const info: OwnerInfo = {
      year,
      month,
      day,
      gender,
    };
    onNext(info);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="px-4 py-6 space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-pet-apricot mb-1">주인 정보 (선택)</h2>
        <p className="text-sm text-pet-cream/60">
          입력하면 주인과의 궁합도 분석해드려요!
        </p>
      </div>

      {/* 생년월일 */}
      <div className="card p-4">
        <label className="block text-sm text-pet-cream/70 mb-2">생년월일</label>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-pet-dark/60 border border-pet-apricot/20 rounded-lg px-2 py-2.5 text-pet-light focus:outline-none focus:border-pet-apricot/50"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-pet-dark/60 border border-pet-apricot/20 rounded-lg px-2 py-2.5 text-pet-light focus:outline-none focus:border-pet-apricot/50"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="bg-pet-dark/60 border border-pet-apricot/20 rounded-lg px-2 py-2.5 text-pet-light focus:outline-none focus:border-pet-apricot/50"
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {d}일
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 성별 */}
      <div className="card p-4">
        <label className="block text-sm text-pet-cream/70 mb-2">성별</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setGender("male")}
            className={`py-3 rounded-lg text-center font-bold transition-all ${
              gender === "male"
                ? "bg-pet-apricot text-pet-dark"
                : "bg-pet-dark/60 border border-pet-apricot/20 text-pet-cream/60"
            }`}
          >
            남성
          </button>
          <button
            onClick={() => setGender("female")}
            className={`py-3 rounded-lg text-center font-bold transition-all ${
              gender === "female"
                ? "bg-pet-apricot text-pet-dark"
                : "bg-pet-dark/60 border border-pet-apricot/20 text-pet-cream/60"
            }`}
          >
            여성
          </button>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="btn-secondary flex-1">
          이전
        </button>
        <button onClick={() => onNext(null)} className="btn-secondary flex-1">
          건너뛰기
        </button>
        <button onClick={handleSubmit} className="btn-primary flex-1">
          다음
        </button>
      </div>
    </motion.div>
  );
}
