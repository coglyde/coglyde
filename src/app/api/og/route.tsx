import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

// Branded Open Graph image: the Coglyde logo on a black backdrop with a soft
// violet glow, matching the site's look. The logo is fetched from the same
// origin that serves this route.
export async function GET(request: Request) {
  const { origin } = new URL(request.url);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#050506",
          position: "relative",
        }}
      >
        {/* soft violet glow */}
        <div
          style={{
            position: "absolute",
            top: "-160px",
            width: "760px",
            height: "760px",
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(120,124,255,0.40) 0%, rgba(120,124,255,0) 70%)",
          }}
        />
        {/* subtle starfield-ish bottom fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 80% at 50% 120%, rgba(99,102,241,0.18) 0%, rgba(0,0,0,0) 60%)",
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${origin}/coglyde-logo.png`}
          width={640}
          height={186}
          alt="Coglyde"
          style={{ position: "relative" }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            marginTop: "40px",
            fontSize: "32px",
            letterSpacing: "0.02em",
            color: "rgba(255,255,255,0.62)",
          }}
        >
          Web design &amp; digital marketing studio
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
