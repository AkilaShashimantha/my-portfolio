import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#161615",
          borderRadius: "36px",
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: "110px",
            color: "#F6F4F0",
            fontWeight: "700",
            fontFamily: "serif",
            lineHeight: "1",
            marginTop: "-10px",
          }}
        >
          A
        </span>
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            right: "24px",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "#C84B31",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
