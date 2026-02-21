"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useCamera } from "@/hooks/useCamera";

interface PetPhotoStepProps {
  onNext: (photoBase64: string | null) => void;
  onBack: () => void;
}

export default function PetPhotoStep({ onNext, onBack }: PetPhotoStepProps) {
  const { videoRef, photo, setPhoto, error, startCamera, takePhoto, retake } =
    useCamera();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startCamera();
  }, [startCamera]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="px-4 py-6 space-y-4"
    >
      <div className="text-center mb-4">
        <h2 className="font-serif text-2xl text-pet-apricot mb-1">반려동물 사진</h2>
        <p className="text-sm text-pet-cream/60">
          얼굴이 잘 보이도록 촬영하거나 업로드해주세요
        </p>
      </div>

      {/* 카메라 / 사진 영역 */}
      <div className="card p-4">
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-pet-dark">
          {!photo && !error && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="photo-guide" />
            </>
          )}

          {photo && (
            // base64 data URL이므로 next/image 사용 불가
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt="촬영된 사진"
              className="w-full h-full object-cover"
            />
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <p className="text-pet-cream/60 text-sm mb-4">{error}</p>
              <button
                onClick={() => galleryInputRef.current?.click()}
                className="btn-secondary text-sm"
              >
                갤러리에서 선택
              </button>
            </div>
          )}
        </div>

        {/* 팁 */}
        {!photo && !error && (
          <p className="text-xs text-pet-apricot/70 text-center mt-2">
            &#128062; 정면에서 얼굴이 잘 보이게 찍어주세요!
          </p>
        )}

        {/* 촬영/재촬영 버튼 */}
        <div className="flex gap-3 mt-4">
          {!photo ? (
            <>
              <button
                onClick={takePhoto}
                disabled={!!error}
                className="btn-primary flex-1 disabled:opacity-40"
              >
                촬영
              </button>
              <button
                onClick={() => galleryInputRef.current?.click()}
                className="btn-secondary flex-1"
              >
                업로드
              </button>
            </>
          ) : (
            <button onClick={retake} className="btn-secondary flex-1">
              다시 촬영
            </button>
          )}
        </div>

        {/* 카메라 촬영용 (후면 카메라) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />
        {/* 갤러리 업로드용 (capture 없음 → 파일 선택 가능) */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* 개인정보 안내 */}
      <div className="flex items-start gap-2 px-2">
        <span className="text-sm mt-0.5">&#128274;</span>
        <p className="text-xs text-pet-cream/50 leading-relaxed">
          업로드된 사진은 AI 분석에만 사용되며, 분석 즉시 완전히 삭제됩니다.
          어떤 서버에도 저장되지 않습니다.
        </p>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="btn-secondary flex-1">
          이전
        </button>
        <button
          onClick={() => onNext(photo)}
          className="btn-primary flex-1"
        >
          {photo ? "분석 시작" : "사진 없이 분석"}
        </button>
      </div>
    </motion.div>
  );
}
