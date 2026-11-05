import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Akila Shashimantha — Systems Architect & Lead Full-Stack Engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#F6F4F0",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          border: "16px solid #EFECE6",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "16px", height: "16px", background: "#C84B31" }} />
            <span
              style={{
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "3px",
                color: "#161615",
                textTransform: "uppercase",
              }}
            >
              AKILA SHASHIMANTHA
            </span>
          </div>
          <span
            style={{
              fontSize: "16px",
              letterSpacing: "2px",
              color: "#63605A",
              textTransform: "uppercase",
            }}
          >
            PORTFOLIO // VOL. 2026
          </span>
        </div>

        {/* Center Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "58px",
              fontWeight: 700,
              color: "#161615",
              lineHeight: 1.12,
              letterSpacing: "-1px",
            }}
          >
            Systems Architect &amp; Lead Full-Stack Engineer
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#63605A",
              maxWidth: "920px",
              lineHeight: 1.4,
            }}
          >
            Architecting resilient digital platforms, high-throughput microservices, and precision editorial experiences.
          </div>
        </div>

        {/* Bottom Ledger */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #DCD8CF",
            paddingTop: "24px",
            fontSize: "18px",
            color: "#63605A",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          <span>Colombo, Sri Lanka // UTC+05:30</span>
          <span style={{ color: "#C84B31", fontWeight: 700 }}>
            AVAILABLE FOR PROJECTS &amp; ADVISORY
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
