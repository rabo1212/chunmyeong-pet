"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { PetInfo } from "@/lib/types";

interface PetInfoStepProps {
  onNext: (info: PetInfo) => void;
  onBack: () => void;
}

export default function PetInfoStep({ onNext, onBack }: PetInfoStepProps) {
  const [name, setName] = useState("");
  const [petType, setPetType] = useState<"dog" | "cat" | "other">("dog");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");

  const handleSubmit = () => {
    const info: PetInfo = {
      name: name.trim() || undefined,
      petType,
      breed: breed.trim() || undefined,
      age: age.trim() || undefined,
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
        <h2 className="font-serif text-2xl text-pet-apricot mb-1">반려동물 정보</h2>
        <p className="text-sm text-pet-cream/60">
          우리 아이에 대해 알려주세요
        </p>
      </div>

      {/* 이름 (선택) */}
      <div className="card p-4">
        <label className="block text-sm text-pet-cream/70 mb-2">이름 (선택)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 초코, 나비"
          className="w-full bg-pet-dark/60 border border-pet-apricot/20 rounded-lg px-3 py-2.5 text-pet-light placeholder:text-pet-cream/30 focus:outline-none focus:border-pet-apricot/50"
        />
      </div>

      {/* 종류 */}
      <div className="card p-4">
        <label className="block text-sm text-pet-cream/70 mb-2">종류</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setPetType("dog")}
            className={`py-2.5 rounded-lg text-center text-sm font-bold transition-all ${
              petType === "dog"
                ? "bg-pet-apricot text-pet-dark"
                : "bg-pet-dark/60 border border-pet-apricot/20 text-pet-cream/60"
            }`}
          >
            &#128054; 강아지
          </button>
          <button
            onClick={() => setPetType("cat")}
            className={`py-2.5 rounded-lg text-center text-sm font-bold transition-all ${
              petType === "cat"
                ? "bg-pet-apricot text-pet-dark"
                : "bg-pet-dark/60 border border-pet-apricot/20 text-pet-cream/60"
            }`}
          >
            &#128049; 고양이
          </button>
          <button
            onClick={() => setPetType("other")}
            className={`py-2.5 rounded-lg text-center text-sm font-bold transition-all ${
              petType === "other"
                ? "bg-pet-apricot text-pet-dark"
                : "bg-pet-dark/60 border border-pet-apricot/20 text-pet-cream/60"
            }`}
          >
            &#128048; 기타
          </button>
        </div>
      </div>

      {/* 품종 (선택) */}
      <div className="card p-4">
        <label className="block text-sm text-pet-cream/70 mb-2">품종 (선택)</label>
        <input
          type="text"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          placeholder="예: 골든리트리버, 코리안숏헤어"
          className="w-full bg-pet-dark/60 border border-pet-apricot/20 rounded-lg px-3 py-2.5 text-pet-light placeholder:text-pet-cream/30 focus:outline-none focus:border-pet-apricot/50"
        />
      </div>

      {/* 나이 (선택) */}
      <div className="card p-4">
        <label className="block text-sm text-pet-cream/70 mb-2">나이 (선택)</label>
        <input
          type="text"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="예: 3살"
          className="w-full bg-pet-dark/60 border border-pet-apricot/20 rounded-lg px-3 py-2.5 text-pet-light placeholder:text-pet-cream/30 focus:outline-none focus:border-pet-apricot/50"
        />
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
            남아
          </button>
          <button
            onClick={() => setGender("female")}
            className={`py-3 rounded-lg text-center font-bold transition-all ${
              gender === "female"
                ? "bg-pet-apricot text-pet-dark"
                : "bg-pet-dark/60 border border-pet-apricot/20 text-pet-cream/60"
            }`}
          >
            여아
          </button>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="btn-secondary flex-1">
          이전
        </button>
        <button onClick={handleSubmit} className="btn-primary flex-1">
          다음
        </button>
      </div>
    </motion.div>
  );
}
