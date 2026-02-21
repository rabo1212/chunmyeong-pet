import Link from "next/link";

export const metadata = {
  title: "개인정보처리방침 - 냥멍천명",
};

export default function PrivacyPage() {
  return (
    <main className="flex-1 px-4 py-8 max-w-lg mx-auto">
      <Link href="/" className="text-pet-apricot text-sm hover:underline">
        &larr; 돌아가기
      </Link>

      <h1 className="text-2xl font-bold text-pet-apricot mt-6 mb-6">
        개인정보처리방침
      </h1>

      <div className="space-y-6 text-sm text-pet-cream/80 leading-relaxed">
        <section>
          <h2 className="text-base text-pet-light font-bold mb-2">
            1. 수집하는 정보
          </h2>
          <ul className="list-disc ml-4 space-y-1">
            <li>
              <strong>필수:</strong> 반려동물 종류, 성별 (관상 분석 목적)
            </li>
            <li>
              <strong>선택:</strong> 반려동물 이름, 품종, 나이, 사진, 보호자 생년월일 (궁합 분석 목적)
            </li>
            <li>
              <strong>미수집:</strong> 이메일, 전화번호, 주소 등 개인 식별 정보
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base text-pet-light font-bold mb-2">
            2. 반려동물 사진 처리 방식
          </h2>
          <div className="card p-4 space-y-2">
            <p>
              &#128274; 업로드된 반려동물 사진은 다음과 같이 처리됩니다:
            </p>
            <ol className="list-decimal ml-4 space-y-1">
              <li>브라우저에서 이미지를 메모리상 데이터로 변환</li>
              <li>암호화된 HTTPS 연결로 분석 서버에 전송</li>
              <li>AI 관상 분석 API 호출 (텍스트 해석 생성)</li>
              <li>
                <strong className="text-pet-apricot">
                  분석 완료 즉시 이미지 데이터 삭제
                </strong>
              </li>
              <li>텍스트 결과만 사용자에게 반환</li>
            </ol>
            <p className="text-pet-apricot/80 font-bold mt-2">
              전 과정에서 이미지가 디스크, 데이터베이스, 클라우드 스토리지에
              저장되는 순간은 없습니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base text-pet-light font-bold mb-2">
            3. 분석 결과 보관
          </h2>
          <p>
            분석 결과 텍스트는 사용자의 브라우저 세션에서만 존재하며,
            페이지를 닫거나 새로고침하면 소멸됩니다.
            서버에 분석 이력을 저장하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base text-pet-light font-bold mb-2">
            4. 제3자 제공
          </h2>
          <ul className="list-disc ml-4 space-y-1">
            <li>
              AI 분석을 위해 Anthropic Claude API에 반려동물 사진과 정보를
              일시적으로 전달합니다. Anthropic의{" "}
              <a
                href="https://www.anthropic.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pet-apricot hover:underline"
              >
                개인정보 정책
              </a>
              에 따라 처리됩니다.
            </li>
            <li>
              카카오 AdFit, 쿠팡 파트너스 광고 표시를 위해 쿠키가 사용될 수 있습니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base text-pet-light font-bold mb-2">
            5. 면책사항
          </h2>
          <p className="card p-3 text-pet-cream/60">
            본 서비스는 엔터테인먼트 목적으로 제공됩니다.
            AI 관상 분석은 과학적 근거에 기반하지 않으며,
            수의학적 진단이나 건강 관련 조언을 대체하지 않습니다.
            반려동물의 건강 관련 사항은 반드시 수의사와 상담하세요.
          </p>
        </section>

        <section>
          <h2 className="text-base text-pet-light font-bold mb-2">
            6. 문의
          </h2>
          <p>
            개인정보 관련 문의사항이 있으시면 서비스 내 문의 기능을
            이용해주세요.
          </p>
        </section>
      </div>

      <p className="text-xs text-pet-cream/30 mt-8 text-center">
        최종 업데이트: 2026년 2월
      </p>
    </main>
  );
}
