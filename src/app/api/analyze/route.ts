import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { PET_SYSTEM_PROMPT, buildAnalysisPrompt } from "@/lib/prompts";
import type { PetInfo, OwnerInfo } from "@/lib/types";

export const maxDuration = 60;

const rateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

/** AI 응답에서 JSON만 깨끗하게 추출 */
function extractJSON(raw: string): Record<string, unknown> | null {
  // 1) 코드블록 안의 JSON 추출 시도
  const codeBlockMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {
      // 코드블록 파싱 실패 → 다음 방법 시도
    }
  }

  // 2) 가장 바깥쪽 { } 추출 (중첩된 {} 포함)
  let depth = 0;
  let start = -1;
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (raw[i] === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        const candidate = raw.substring(start, i + 1);
        try {
          return JSON.parse(candidate);
        } catch {
          // trailing comma 수정 시도
          const cleaned = candidate.replace(/,\s*([}\]])/g, "$1");
          try {
            return JSON.parse(cleaned);
          } catch {
            // 이 블록은 실패, 다음 { 를 찾기
            start = -1;
          }
        }
      }
    }
  }

  // 3) 잘린 JSON 복구 시도 (max_tokens로 잘린 경우)
  const firstBrace = raw.indexOf("{");
  if (firstBrace !== -1) {
    let truncated = raw.substring(firstBrace);
    // 코드블록 닫는 백틱 제거
    truncated = truncated.replace(/`+\s*$/, "");
    // 잘린 문자열 닫기: 마지막 열린 따옴표 찾아서 닫기
    const lastQuote = truncated.lastIndexOf('"');
    if (lastQuote > 0) {
      const beforeQuote = truncated.substring(0, lastQuote);
      const openQuotes = (beforeQuote.match(/(?<!\\)"/g) || []).length;
      if (openQuotes % 2 === 0) {
        // 따옴표가 짝수 → lastQuote는 열린 따옴표, 내용 잘라내기
        truncated = truncated.substring(0, lastQuote) + '""';
      } else {
        // 홀수 → lastQuote가 닫는 따옴표, 그 뒤를 정리
        truncated = truncated.substring(0, lastQuote + 1);
      }
    }
    // 누락된 닫는 괄호 추가
    const openBraces = (truncated.match(/\{/g) || []).length;
    const closeBraces = (truncated.match(/\}/g) || []).length;
    // trailing comma 제거
    truncated = truncated.replace(/,\s*$/, "");
    truncated += "}".repeat(Math.max(0, openBraces - closeBraces));

    try {
      return JSON.parse(truncated);
    } catch {
      // trailing comma 한번 더 정리
      const cleaned = truncated.replace(/,\s*([}\]])/g, "$1");
      try {
        return JSON.parse(cleaned);
      } catch {
        // 최종 실패
      }
    }
  }

  return null;
}

/** 결과 객체 검증 및 기본값 채움 */
function validateResult(parsed: Record<string, unknown>, hasOwner: boolean) {
  const scores = (parsed.scores as Record<string, number>) || {};
  return {
    scores: {
      lucky: Math.min(100, Math.max(0, Number(scores.lucky) || 75)),
      charm: Math.min(100, Math.max(0, Number(scores.charm) || 75)),
      charisma: Math.min(100, Math.max(0, Number(scores.charisma) || 75)),
      wealth: Math.min(100, Math.max(0, Number(scores.wealth) || 75)),
      noble: Math.min(100, Math.max(0, Number(scores.noble) || 75)),
    },
    grade: (parsed.grade as string) || "A",
    gradeTitle: (parsed.gradeTitle as string) || "A급 매력둥이",
    interpretation: (parsed.interpretation as string) || "",
    pastLife: (parsed.pastLife as string) || "",
    superPower: (parsed.superPower as string) || "",
    ownerMatch: hasOwner ? ((parsed.ownerMatch as string) || "") : "",
  };
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "잠시 후 다시 시도해주세요. (1분 내 3회 제한)" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const petInfo: PetInfo = body.petInfo;
    const ownerInfo: OwnerInfo | null = body.ownerInfo ?? null;
    let photoBase64: string | null = body.photoBase64 ?? null;

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

    const hasOwner = !!ownerInfo;
    const promptText = buildAnalysisPrompt(petInfo, hasOwner, ownerInfo ?? undefined);

    type ContentBlock =
      | { type: "image"; source: { type: "base64"; media_type: "image/jpeg"; data: string } }
      | { type: "text"; text: string };

    const content: ContentBlock[] = [];

    if (photoBase64) {
      const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "");
      content.push({
        type: "image",
        source: { type: "base64", media_type: "image/jpeg", data: base64Data },
      });
      photoBase64 = null;
    }

    content.push({ type: "text", text: promptText });

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 4096,
      temperature: 0.8,
      system: PET_SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    });

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    console.log("[analyze] rawText length:", rawText.length);
    console.log("[analyze] rawText preview:", rawText.substring(0, 500));

    // JSON 추출
    const parsed = extractJSON(rawText);
    if (parsed) {
      console.log("[analyze] JSON parsed successfully, keys:", Object.keys(parsed));
      const result = validateResult(parsed, hasOwner);
      return NextResponse.json({ result });
    }

    // 파싱 실패 — rawText 자체를 interpretation으로 사용
    console.error("[analyze] JSON parse failed. rawText:", rawText.substring(0, 500));

    const cleanedText = rawText
      .replace(/```[\s\S]*?```/g, "")
      .replace(/^\s*[{}[\]",:]\s*$/gm, "")
      .trim();

    return NextResponse.json({
      result: {
        scores: { lucky: 80, charm: 85, charisma: 75, wealth: 78, noble: 82 },
        grade: "A",
        gradeTitle: "A급 매력둥이",
        interpretation: cleanedText || "AI 분석 결과를 불러오지 못했습니다. 다시 시도해주세요!",
        pastLife: "",
        superPower: "",
        ownerMatch: "",
      },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Analysis error:", errMsg);
    return NextResponse.json(
      { error: `분석 중 오류: ${errMsg}` },
      { status: 500 }
    );
  }
}
