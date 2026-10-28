import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS home-screen icon.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4f46e5, #7c3aed 50%, #c026d3)",
          color: "white",
          fontWeight: 800,
        }}
      >
        <div style={{ fontSize: 64, letterSpacing: -2 }}>Y8</div>
        <div style={{ fontSize: 22, fontWeight: 700, opacity: 0.9 }}>MATHS</div>
      </div>
    ),
    size,
  );
}
