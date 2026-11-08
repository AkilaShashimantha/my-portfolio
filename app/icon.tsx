import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "6px",
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            color: "#F6F4F0",
            fontWeight: "700",
            fontFamily: "serif",
            lineHeight: "1",
            marginTop: "-2px",
          }}
        >
          A
        </span>
        <div
          style={{
            position: "absolute",
            bottom: "3px",
            right: "3px",
            width: "5px",
            height: "5px",
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
