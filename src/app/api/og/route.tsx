import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #0a0e27 0%, #0f1629 50%, #0a0a1f 100%)",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background orbital accent */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            border: "1px solid rgba(16, 185, 129, 0.15)",
          }}
        />

        {/* Top right orbit */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "60px",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            border: "1px solid rgba(59, 130, 246, 0.1)",
          }}
        />

        {/* Corner accent gradient */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background: "radial-gradient(circle at top-left, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
          }}
        />

        {/* Header with status dot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 12px rgba(16, 185, 129, 0.6)",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            Web Design & Digital Marketing
          </span>
        </div>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "900px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h1
            style={{
              fontSize: "72px",
              fontWeight: 900,
              letterSpacing: "-1px",
              background: "linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.95) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "#ffffff",
              margin: 0,
              marginBottom: "24px",
              textTransform: "uppercase",
            }}
          >
            COGLYDE
          </h1>

          <p
            style={{
              fontSize: "32px",
              fontWeight: 300,
              lineHeight: 1.4,
              color: "rgba(255, 255, 255, 0.85)",
              letterSpacing: "-0.3px",
              margin: 0,
              marginBottom: "32px",
              maxWidth: "800px",
            }}
          >
            Building sites that glide past the competition
          </p>

          <div
            style={{
              width: "120px",
              height: "3px",
              background: "linear-gradient(90deg, #10b981 0%, rgba(16, 185, 129, 0) 100%)",
              borderRadius: "2px",
            }}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "13px",
            color: "rgba(255, 255, 255, 0.5)",
            letterSpacing: "0.02em",
            position: "relative",
            zIndex: 1,
          }}
        >
          <span>Vancouver-based design studio</span>
          <span
            style={{
              fontFamily: "Monaco, Courier New, monospace",
              fontSize: "12px",
              color: "rgba(16, 185, 129, 0.8)",
            }}
          >
            coglyde.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
