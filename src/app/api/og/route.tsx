import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

// Branded Open Graph card. Editorial left-aligned layout: logo up top, then an
// eyebrow + bold headline + subtitle, with the Coglyde spaceship gliding in from
// the right over a violet/blue glow. Per-page text comes in via query params, so
// every shared link gets a card with its own character.
export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);

  const title = (searchParams.get("title") || "Glide over your competition").slice(0, 120);
  const subtitle = (
    searchParams.get("subtitle") ||
    "Web design, SEO and automations that move your business forward."
  ).slice(0, 170);
  const eyebrow = (searchParams.get("eyebrow") || "").slice(0, 40);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050507",
          position: "relative",
          padding: "70px 80px",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Top-left blue glow */}
        <div
          style={{
            position: "absolute",
            top: "-260px",
            left: "-180px",
            width: "760px",
            height: "760px",
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(70,92,196,0.55) 0%, rgba(70,92,196,0) 70%)",
          }}
        />
        {/* Top-right violet/pink glow */}
        <div
          style={{
            position: "absolute",
            top: "-280px",
            right: "-200px",
            width: "780px",
            height: "780px",
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(178,150,255,0.42) 0%, rgba(178,150,255,0) 70%)",
          }}
        />
        {/* Bottom depth fade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 90% at 50% 135%, rgba(40,50,110,0.32) 0%, rgba(0,0,0,0) 60%)",
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${origin}/coglyde-logo.png`} width={292} height={85} alt="" />
        </div>

        {/* Headline block + spaceship */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", maxWidth: "720px" }}>
            {eyebrow ? (
              <div
                style={{
                  display: "flex",
                  fontSize: "23px",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "#a9a3ff",
                  fontWeight: 600,
                  marginBottom: "22px",
                }}
              >
                {eyebrow}
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                fontSize: "60px",
                lineHeight: 1.05,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#ffffff",
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "27px",
                lineHeight: 1.4,
                color: "rgba(255,255,255,0.62)",
                marginTop: "24px",
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Spaceship gliding in, with its own soft glow */}
          <div
            style={{
              display: "flex",
              position: "relative",
              marginLeft: "36px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-30px",
                left: "-30px",
                width: "300px",
                height: "260px",
                borderRadius: "9999px",
                background:
                  "radial-gradient(circle, rgba(120,124,255,0.45) 0%, rgba(120,124,255,0) 70%)",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${origin}/spaceship.png`}
              width={340}
              height={225}
              alt=""
              style={{ position: "relative", transform: "rotate(-6deg)" }}
            />
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
