import type { PetInfo, OwnerInfo } from "./types";

export const PET_SYSTEM_PROMPT = `당신은 10년 경력의 반려동물 관상학 전문가 '냥멍 선생'입니다.
동물의 얼굴, 체형, 표정을 보고 성격, 전생, 숨겨진 능력을 읽어내는 전문가입니다.

## 규칙
1. 반드시 한국어로 답변합니다.
2. 마크다운 형식을 사용합니다 (## 제목, **강조**, - 목록 등).
3. 따뜻하고 사랑스럽고 유머러스한 톤을 유지합니다.
4. **절대로 어떤 동물도 비하하지 않습니다.** 못생긴 동물도 "개성 있는 매력"으로 긍정 해석합니다.
5. 건강 진단은 절대 하지 않습니다. 건강 관련 우려는 "수의사 선생님과 상담을 추천드려요"로 안내합니다.
6. 모든 등급은 긍정적으로 느껴져야 합니다. C등급도 "숨겨진 매력의 소유자"입니다.
7. 각 섹션은 구체적이고 개인화된 내용으로 작성합니다. 뻔한 말은 피합니다.
8. 점수는 절대 모든 항목이 똑같지 않게, 개성 있게 배분합니다.
9. 반드시 유효한 JSON만 출력합니다. JSON 외의 텍스트는 포함하지 않습니다.`;

export function buildAnalysisPrompt(
  petInfo: PetInfo,
  hasOwner: boolean,
  ownerInfo?: OwnerInfo
): string {
  const petTypeKo = petInfo.petType === "dog" ? "강아지" : petInfo.petType === "cat" ? "고양이" : "반려동물";
  const genderKo = petInfo.gender === "male" ? "남아" : "여아";

  const petDescription = [
    petInfo.name ? `이름: ${petInfo.name}` : null,
    `종류: ${petTypeKo}`,
    petInfo.breed ? `품종: ${petInfo.breed}` : null,
    petInfo.age ? `나이: ${petInfo.age}` : null,
    `성별: ${genderKo}`,
  ]
    .filter(Boolean)
    .join("\n");

  const ownerSection =
    hasOwner && ownerInfo
      ? `

[보호자 정보]
생년월일: ${ownerInfo.year}년 ${ownerInfo.month}월 ${ownerInfo.day}일
성별: ${ownerInfo.gender === "male" ? "남성" : "여성"}`
      : "";

  const ownerMatchField = hasOwner
    ? `,
  "ownerMatch": "## 궁합 점수: XX/100\\n(보호자와 이 아이의 전체 궁합 점수와 한줄 요약)\\n\\n## 전생 인연\\n(보호자와 이 아이가 전생에 어떤 관계였는지 재미있는 스토리 3~4문장)\\n\\n## 함께하면 좋은 활동 TOP 3\\n(궁합 기반 추천 활동 3가지, 각각 한줄 설명)\\n\\n## 주의할 점\\n(함께 생활할 때 주의할 점 2~3가지, 긍정적 톤)\\n\\n## 10년 후\\n(10년 후 둘의 모습을 따뜻하게 그려주는 2~3문장)"`
    : "";

  return `위 사진의 ${petTypeKo} 관상을 분석해주세요.

[반려동물 정보]
${petDescription}${ownerSection}

## 분석 요청

사진을 보고 이 아이의 관상을 분석하여 아래 JSON 형식으로 정확히 응답해주세요.

### 점수 기준
- lucky (복덩이 지수): 이 아이가 가정에 가져오는 복과 행운의 정도
- charm (애교 지수): 표정, 눈빛, 포즈에서 느껴지는 애교와 사랑스러움
- charisma (카리스마 지수): 당당함, 위엄, 존재감
- wealth (재물 지수): 이 아이와 함께하면 재물운이 얼마나 상승하는지
- noble (전생 귀족 지수): 전생에서의 지위와 품격

### 등급 기준 (5개 점수의 평균)
- 평균 90 이상: grade "SS", gradeTitle "${petTypeKo === "고양이" ? "SS급 전설의 복냥이" : "SS급 전설의 복덩이"}"
- 평균 80 이상: grade "S", gradeTitle "${petTypeKo === "고양이" ? "S급 복냥이" : "S급 복멍이"}"
- 평균 70 이상: grade "A", gradeTitle "A급 매력둥이"
- 평균 60 이상: grade "B", gradeTitle "B급 귀여움 폭탄"
- 평균 60 미만: grade "C", gradeTitle "C급 숨겨진 보석"

### 응답 JSON 형식

\`\`\`json
{
  "scores": {
    "lucky": (0-100 정수),
    "charm": (0-100 정수),
    "charisma": (0-100 정수),
    "wealth": (0-100 정수),
    "noble": (0-100 정수)
  },
  "grade": "(SS/S/A/B/C)",
  "gradeTitle": "(위 기준에 맞는 등급 칭호)",
  "interpretation": "## 🐾 얼굴형 & 전체 인상\\n(얼굴형, 전체적 인상, 풍기는 에너지를 3~4문장으로)\\n\\n## 👀 눈 (마음의 창)\\n(눈의 크기, 모양, 빛남 정도로 성격과 내면을 읽기 3~4문장)\\n\\n## 👃 코 & 입\\n(코와 입 모양에서 읽히는 성격, 식복, 재물운 3~4문장)\\n\\n## 👂 귀\\n(귀의 크기, 모양에서 읽히는 지혜와 경청 능력 2~3문장)\\n\\n## 🎀 털 & 체형\\n(털의 색상, 질감, 체형에서 보이는 기운과 건강 에너지 3~4문장)",
  "pastLife": "(이 아이의 전생 이야기를 구체적이고 재미있게 4~5문장으로. 역사적 배경이나 판타지 요소를 섞어서 흥미롭게)",
  "superPower": "(이 아이의 숨겨진 초능력을 유머러스하게 1~2문장으로. 예: '간식 탐지 레이더 Lv.99 — 봉지 뜯는 소리를 3층 밖에서도 감지합니다')"${ownerMatchField}
}
\`\`\`

중요: 반드시 위 JSON 형식만 출력하세요. JSON 앞뒤로 다른 텍스트를 넣지 마세요.
\`\`\`json 과 \`\`\` 마크다운 코드블록으로 감싸서 출력하세요.`;
}
