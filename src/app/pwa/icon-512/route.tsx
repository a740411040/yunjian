import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: 140,
          background:
            "linear-gradient(145deg, #fff9ef 0%, #f4ede2 42%, #e8f2ec 100%)",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 18%, rgba(192,72,81,0.18), transparent 34%), radial-gradient(circle at 86% 16%, rgba(123,207,166,0.2), transparent 32%), radial-gradient(circle at 50% 88%, rgba(36,52,71,0.12), transparent 36%)"
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24
          }}
        >
          <div
            style={{
              width: 264,
              height: 264,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 72,
              background: "#c04851",
              color: "#fff7f2",
              fontSize: 142,
              fontWeight: 800,
              boxShadow: "0 28px 62px rgba(192,72,81,0.28)"
            }}
          >
            笺
          </div>
          <div
            style={{
              fontSize: 52,
              letterSpacing: 24,
              color: "#5b616a",
              fontWeight: 700
            }}
          >
            YUN JIAN
          </div>
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
