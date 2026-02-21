"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import StepIndicator from "@/components/ui/StepIndicator";
import StartScreen from "@/components/steps/StartScreen";
import PetInfoStep from "@/components/steps/PetInfoStep";
import OwnerInfoStep from "@/components/steps/OwnerInfoStep";
import PetPhotoStep from "@/components/steps/PetPhotoStep";
import AnalyzingStep from "@/components/steps/AnalyzingStep";
import AdStep from "@/components/steps/AdStep";
import ResultStep from "@/components/steps/ResultStep";
import type { PetInfo, OwnerInfo, PetAnalysisResult } from "@/lib/types";

type Step = "start" | "pet" | "owner" | "photo" | "analyzing" | "ad" | "result";

const STEP_NUMBER: Record<Step, number> = {
  start: 0,
  pet: 1,
  owner: 2,
  photo: 3,
  analyzing: 4,
  ad: 5,
  result: 6,
};

export default function Home() {
  const [step, setStep] = useState<Step>("start");
  const [petInfo, setPetInfo] = useState<PetInfo | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null);
  const [result, setResult] = useState<PetAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePetInfoNext = useCallback((info: PetInfo) => {
    setPetInfo(info);
    setStep("owner");
  }, []);

  const handleOwnerNext = useCallback((info: OwnerInfo | null) => {
    setOwnerInfo(info);
    setStep("photo");
  }, []);

  const handlePhotoNext = useCallback(
    async (photoBase64: string | null) => {
      if (!petInfo) return;
      setStep("analyzing");
      setError(null);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ petInfo, ownerInfo, photoBase64 }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "분석에 실패했습니다.");
        }

        const data = await res.json();
        setResult(data.result);
        setStep("ad");
      } catch (err) {
        setError(err instanceof Error ? err.message : "분석에 실패했습니다.");
        setStep("photo");
      }
    },
    [petInfo, ownerInfo]
  );

  const handleRestart = useCallback(() => {
    setPetInfo(null);
    setOwnerInfo(null);
    setResult(null);
    setError(null);
    setStep("start");
  }, []);

  const stepNumber = STEP_NUMBER[step];

  return (
    <main className="flex-1">
      {step !== "start" && step !== "result" && stepNumber > 0 && (
        <StepIndicator currentStep={stepNumber} />
      )}

      {error && step === "photo" && (
        <div className="mx-4 mb-4 p-3 bg-pet-red/10 border border-pet-red/30 rounded-lg text-pet-red text-sm text-center">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "start" && (
          <StartScreen key="start" onStart={() => setStep("pet")} />
        )}

        {step === "pet" && (
          <PetInfoStep
            key="pet"
            onNext={handlePetInfoNext}
            onBack={() => setStep("start")}
          />
        )}

        {step === "owner" && (
          <OwnerInfoStep
            key="owner"
            onNext={handleOwnerNext}
            onBack={() => setStep("pet")}
          />
        )}

        {step === "photo" && (
          <PetPhotoStep
            key="photo"
            onNext={handlePhotoNext}
            onBack={() => setStep("owner")}
          />
        )}

        {step === "analyzing" && <AnalyzingStep key="analyzing" />}

        {step === "ad" && (
          <AdStep key="ad" onNext={() => setStep("result")} />
        )}

        {step === "result" && result && (
          <ResultStep
            key="result"
            result={result}
            petName={petInfo?.name}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
