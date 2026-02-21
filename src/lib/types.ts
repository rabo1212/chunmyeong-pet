export interface PetInfo {
  name?: string;
  petType: "dog" | "cat" | "other";
  breed?: string;
  age?: string;
  gender: "male" | "female";
}

export interface OwnerInfo {
  year: number;
  month: number;
  day: number;
  gender: "male" | "female";
}

export interface ScoreData {
  lucky: number;      // 복덩이 지수 (0-100)
  charm: number;      // 애교 지수
  charisma: number;   // 카리스마 지수
  wealth: number;     // 재물 지수
  noble: number;      // 전생 귀족 지수
}

export interface PetAnalysisResult {
  scores: ScoreData;
  grade: string;         // "SS" | "S" | "A" | "B" | "C"
  gradeTitle: string;    // e.g. "S급 복냥이"
  interpretation: string; // AI face reading markdown
  pastLife: string;       // past life story
  superPower: string;     // hidden superpower
  ownerMatch?: string;    // owner compatibility (if provided)
}
