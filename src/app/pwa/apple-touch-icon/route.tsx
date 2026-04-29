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
          borderRadius: 52,
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
              "radial-gradient(circle at 18% 18%, rgba(192,72,81,0.18), transparent 34%), radial-gradient(circle at 86% 16%, rgba(123,207,166,0.2), transparent 32%)"
          }}
        />
        <div
          style={{
            width: 108,
            height: 108,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            background: "#c04851",
            color: "#fff7f2",
            fontSize: 64,
            fontWeight: 800,
            boxShadow: "0 20px 40px rgba(192,72,81,0.28)"
          }}
        >
          笺
        </div>
      </div>
    ),
    { width: 180, height: 180 }
  );
}
