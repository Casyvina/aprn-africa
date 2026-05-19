import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "APRN — African Pipeline Resource Network";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [logoData, bgData] = await Promise.all([
    readFile(join(process.cwd(), "public/images/logo.png")),
    readFile(join(process.cwd(), "public/images/pipeline-aerial.png")),
  ]);

  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;
  const bgSrc   = `data:image/png;base64,${bgData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "64px",
          position: "relative",
          backgroundColor: "#071B2A",
          backgroundImage: `url(${bgSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(7,27,42,0.97) 0%, rgba(7,27,42,0.75) 50%, rgba(7,27,42,0.35) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            width={160}
            height={44}
            alt="APRN"
            style={{ objectFit: "contain", objectPosition: "left" }}
          />

          {/* Gold rule */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "2px", backgroundColor: "#D4A017" }} />
            <div
              style={{
                fontSize: "13px",
                color: "#D4A017",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontFamily: "sans-serif",
              }}
            >
              African Pipeline Resource Network
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: "52px",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.15,
              fontFamily: "serif",
              maxWidth: "820px",
            }}
          >
            Anchoring Pipeline Technology in Africa
          </div>

          {/* Domain */}
          <div
            style={{
              fontSize: "14px",
              color: "#64748b",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
              marginTop: "4px",
            }}
          >
            aprn-africa.org
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
