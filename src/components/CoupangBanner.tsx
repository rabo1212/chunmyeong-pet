"use client";

export default function CoupangBanner() {
  return (
    <div className="flex justify-center">
      <iframe
        src="/coupang-ad.html"
        width="320"
        height="120"
        style={{ border: "none", overflow: "hidden", background: "transparent" }}
        scrolling="no"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
      />
    </div>
  );
}
