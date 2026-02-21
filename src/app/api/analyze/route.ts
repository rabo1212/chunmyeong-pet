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
  const textToParse = codeBlockMatch ? codeBlockMatch[1].trim() : raw;

  // 2) { } 매칭
  const jsonMatch = textToParse.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    // 3) 흔한 JSON 오류 수정 시도: trailing comma
    const cleaned = jsonMatch[0].replace(/,\s*([}\]])/g, "$1");
    try {
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }
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
      max_tokens: 4000,
      temperature: 0.8,
      system: PET_SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    });

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // JSON 추출
    const parsed = extractJSON(rawText);
    if (parsed) {
      return NextResponse.json({ result: parsed });
    }

    // fallback — JSON 파싱 완전 실패 시 rawText에서 코드/JSON 잔해 제거
    const cleanedText = rawText
      .replace(/```[\s\S]*?```/g, "")
      .replace(/[{}[\]]/g, "")
      .replace(/"/g, "")
      .trim();

    return NextResponse.json({
      result: {
        scores: { lucky: 80, charm: 85, charisma: 75, wealth: 78, noble: 82 },
        grade: "A",
        gradeTitle: "A급 매력둥이",
        interpretation: cleanedText || "AI가 관상을 분석했지만 결과를 정리하는 중 문제가 발생했습니다. 다시 시도해주세요!",
        pastLife: "",
        superPower: "",
        ownerMatch: "",
      },
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
