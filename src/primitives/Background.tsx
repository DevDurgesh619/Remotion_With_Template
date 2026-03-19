import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type { BackgroundConfig } from "../templates/types";

const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const DENSITY_MAP: Record<string, number> = {
  sparse: 40,
  normal: 20,
  dense: 10,
};

function gradientDirection(dir: string): string {
  const map: Record<string, string> = {
    "to-bottom": "to bottom",
    "to-right": "to right",
    "to-bottom-right": "to bottom right",
    "to-top": "to top",
    "to-left": "to left",
  };
  return map[dir] ?? "to bottom";
}

/** Convert direction string to base angle for animation */
function directionToAngle(dir: string): number {
  const map: Record<string, number> = {
    "to-bottom": 180,
    "to-right": 90,
    "to-bottom-right": 135,
    "to-top": 0,
    "to-left": 270,
  };
  return map[dir] ?? 180;
}

/** Deterministic triangle wave: oscillates 0→1→0 over `period` frames */
function triangleWave(frame: number, period: number): number {
  const halfPeriod = period / 2;
  const posInCycle = frame % period;
  return posInCycle < halfPeriod
    ? interpolate(posInCycle, [0, halfPeriod], [0, 1], CLAMP)
    : interpolate(posInCycle, [halfPeriod, period], [1, 0], CLAMP);
}

export const Background: React.FC<{ config: BackgroundConfig; frame?: number }> = ({
  config,
  frame,
}) => {
  const isAnimated = frame !== undefined;

  // ── Solid ──────────────────────────────────────────────────────────────
  if (config.type === "solid") {
    // Animated: subtle pulsing radial vignette overlay
    if (isAnimated) {
      const vignetteOpacity = 0.06 + triangleWave(frame, 150) * 0.08;
      return (
        <AbsoluteFill style={{ backgroundColor: config.color, overflow: "hidden" }}>
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${vignetteOpacity}) 100%)`,
            }}
          />
        </AbsoluteFill>
      );
    }
    return (
      <AbsoluteFill style={{ backgroundColor: config.color, overflow: "hidden" }} />
    );
  }

  // ── Gradient ───────────────────────────────────────────────────────────
  if (config.type === "gradient") {
    if (isAnimated && config.direction !== "radial") {
      // Slow angle sway: ±8° around the base direction
      const baseAngle = directionToAngle(config.direction);
      const sway = (triangleWave(frame, 200) - 0.5) * 16; // -8 to +8 degrees
      const angle = baseAngle + sway;
      const bg = `linear-gradient(${angle}deg, ${config.from}, ${config.to})`;
      return <AbsoluteFill style={{ background: bg, overflow: "hidden" }} />;
    }
    if (isAnimated && config.direction === "radial") {
      // Radial: slowly shift center point
      const cx = 50 + (triangleWave(frame, 240) - 0.5) * 8; // 46%-54%
      const cy = 50 + (triangleWave(frame + 60, 180) - 0.5) * 6; // 47%-53%
      const bg = `radial-gradient(circle at ${cx}% ${cy}%, ${config.from}, ${config.to})`;
      return <AbsoluteFill style={{ background: bg, overflow: "hidden" }} />;
    }
    // Static fallback
    const bg =
      config.direction === "radial"
        ? `radial-gradient(circle at center, ${config.from}, ${config.to})`
        : `linear-gradient(${gradientDirection(config.direction)}, ${config.from}, ${config.to})`;
    return <AbsoluteFill style={{ background: bg, overflow: "hidden" }} />;
  }

  // ── Stripe ─────────────────────────────────────────────────────────────
  if (config.type === "stripe") {
    const gap = DENSITY_MAP[config.density] ?? 20;
    const stripeW = Math.max(1, Math.round(gap * 0.3));
    const bg =
      "repeating-linear-gradient(" +
      config.angle +
      "deg, " +
      config.stripeColor +
      " 0px, " +
      config.stripeColor +
      " " +
      stripeW +
      "px, transparent " +
      stripeW +
      "px, transparent " +
      gap +
      "px)";

    // Animated: slow stripe crawl
    const offset = isAnimated ? frame * 0.3 : 0;
    return (
      <AbsoluteFill style={{ backgroundColor: config.baseColor, overflow: "hidden" }}>
        <AbsoluteFill
          style={{
            background: bg,
            opacity: 0.15,
            backgroundPosition: `${offset}px ${offset}px`,
          }}
        />
      </AbsoluteFill>
    );
  }

  // ── Grain ──────────────────────────────────────────────────────────────
  if (config.type === "grain") {
    // Animated: vary seed every 3 frames for film grain flicker
    const seed = isAnimated ? 42 + Math.floor(frame / 3) : 42;
    const filterId = `grain-filter-${seed}`;
    return (
      <AbsoluteFill style={{ backgroundColor: config.baseColor, overflow: "hidden" }}>
        <AbsoluteFill style={{ opacity: config.grainOpacity }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id={filterId}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                seed={seed}
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${filterId})`} />
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ── Conic Gradient ────────────────────────────────────────────────────
  if (config.type === "conic") {
    const colorStops = config.colors.join(", ");
    const angleOffset = isAnimated ? triangleWave(frame, 300) * 360 : 0;
    const bg = `conic-gradient(from ${angleOffset}deg at ${config.centerX}% ${config.centerY}%, ${colorStops})`;
    return <AbsoluteFill style={{ background: bg, overflow: "hidden" }} />;
  }

  // ── Mesh Gradient (approximated with layered radials) ────────────────
  if (config.type === "mesh") {
    const positions = [
      [25, 25], [75, 25], [25, 75], [75, 75],
    ];
    return (
      <AbsoluteFill style={{ backgroundColor: config.baseColor, overflow: "hidden" }}>
        {config.colors.map((color, i) => {
          const [baseX, baseY] = positions[i % positions.length];
          const dx = isAnimated ? (triangleWave(frame + i * 40, 200 + i * 30) - 0.5) * 20 : 0;
          const dy = isAnimated ? (triangleWave(frame + i * 60, 180 + i * 40) - 0.5) * 20 : 0;
          return (
            <AbsoluteFill
              key={i}
              style={{
                background: `radial-gradient(circle at ${baseX + dx}% ${baseY + dy}%, ${color}, transparent 70%)`,
                mixBlendMode: "screen",
                opacity: 0.8,
              }}
            />
          );
        })}
      </AbsoluteFill>
    );
  }

  // ── Geometric Grid ───────────────────────────────────────────────────
  if (config.type === "grid") {
    const size = config.cellSize;
    const lw = config.lineWidth;
    const offset = isAnimated ? frame * 0.2 : 0;
    const gridBg =
      `repeating-linear-gradient(0deg, ${config.lineColor} 0px, ${config.lineColor} ${lw}px, transparent ${lw}px, transparent ${size}px), ` +
      `repeating-linear-gradient(90deg, ${config.lineColor} 0px, ${config.lineColor} ${lw}px, transparent ${lw}px, transparent ${size}px)`;
    return (
      <AbsoluteFill style={{ backgroundColor: config.baseColor, overflow: "hidden" }}>
        <AbsoluteFill
          style={{
            background: gridBg,
            opacity: 0.3,
            backgroundPosition: `${offset}px ${offset}px`,
          }}
        />
      </AbsoluteFill>
    );
  }

  // ── Wave Distortion ──────────────────────────────────────────────────
  if (config.type === "wave") {
    const seed = isAnimated ? 10 + Math.floor(frame / 2) : 10;
    const filterId = `wave-filter-${seed}`;
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <AbsoluteFill
          style={{
            background: `linear-gradient(to bottom, ${config.baseFrom}, ${config.baseTo})`,
          }}
        />
        <AbsoluteFill style={{ opacity: 0.6 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id={filterId}>
              <feTurbulence
                type="turbulence"
                baseFrequency="0.015"
                numOctaves="3"
                seed={seed}
                stitchTiles="stitch"
              />
              <feDisplacementMap
                in="SourceGraphic"
                scale={config.intensity}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <rect
              width="100%"
              height="100%"
              fill={`url(#wave-grad-${seed})`}
              filter={`url(#${filterId})`}
            />
            <defs>
              <linearGradient id={`wave-grad-${seed}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.baseFrom} stopOpacity="0.3" />
                <stop offset="100%" stopColor={config.baseTo} stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ── Marble ────────────────────────────────────────────────────────────
  if (config.type === "marble") {
    const seed = 42;
    const filterId = `marble-${seed}`;
    return (
      <AbsoluteFill style={{ backgroundColor: config.baseColor, overflow: "hidden" }}>
        <AbsoluteFill style={{ opacity: config.veinOpacity }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id={filterId}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.02"
                numOctaves="5"
                seed={seed}
                stitchTiles="stitch"
              />
              <feColorMatrix
                type="saturate"
                values="0"
              />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${filterId})`} opacity="0.5" />
          </svg>
        </AbsoluteFill>
        {/* Vein streaks via layered radial gradients */}
        <AbsoluteFill
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, ${config.veinColor}33 0%, transparent 50%),
              radial-gradient(ellipse at 70% 60%, ${config.veinColor}22 0%, transparent 60%),
              radial-gradient(ellipse at 45% 80%, ${config.veinColor}28 0%, transparent 45%)
            `,
          }}
        />
      </AbsoluteFill>
    );
  }

  // ── Circuit Board (PCB) ──────────────────────────────────────────────
  if (config.type === "circuit") {
    const densityMap = { sparse: 80, normal: 50, dense: 30 };
    const gap = densityMap[config.density] ?? 50;
    const lw = 1;
    const offset = isAnimated ? frame * 0.15 : 0;
    // Grid lines + dots at intersections
    const gridBg =
      `repeating-linear-gradient(0deg, ${config.lineColor}40 0px, ${config.lineColor}40 ${lw}px, transparent ${lw}px, transparent ${gap}px), ` +
      `repeating-linear-gradient(90deg, ${config.lineColor}40 0px, ${config.lineColor}40 ${lw}px, transparent ${lw}px, transparent ${gap}px)`;
    // Dot pattern at intersections
    const dotBg =
      `radial-gradient(circle ${Math.round(gap * 0.05)}px at ${gap}px ${gap}px, ${config.dotColor} 100%, transparent 100%)`;
    return (
      <AbsoluteFill style={{ backgroundColor: config.baseColor, overflow: "hidden" }}>
        <AbsoluteFill
          style={{
            background: gridBg,
            backgroundPosition: `${offset}px ${offset}px`,
          }}
        />
        <AbsoluteFill
          style={{
            backgroundImage: dotBg,
            backgroundSize: `${gap}px ${gap}px`,
            backgroundPosition: `${offset}px ${offset}px`,
            opacity: 0.8,
          }}
        />
      </AbsoluteFill>
    );
  }

  // ── Paper Texture ────────────────────────────────────────────────────
  if (config.type === "paper") {
    const seed = isAnimated ? 100 + Math.floor(frame / 6) : 100;
    const filterId = `paper-${seed}`;
    return (
      <AbsoluteFill style={{ backgroundColor: config.baseColor, overflow: "hidden" }}>
        <AbsoluteFill style={{ opacity: 0.15 + config.warmth * 0.1 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id={filterId}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.4"
                numOctaves="5"
                seed={seed}
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${filterId})`} />
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ── Wood Grain ───────────────────────────────────────────────────────
  if (config.type === "wood") {
    const densityMap = { fine: 6, medium: 12, coarse: 20 };
    const grainSize = densityMap[config.grainDensity] ?? 12;
    const grainBg =
      `repeating-linear-gradient(2deg, ` +
      `${config.grainColor}15 0px, transparent ${grainSize}px, ` +
      `${config.grainColor}10 ${grainSize * 2}px, transparent ${grainSize * 3}px)`;
    const seed = 55;
    const filterId = `wood-warp-${seed}`;
    return (
      <AbsoluteFill style={{ backgroundColor: config.baseColor, overflow: "hidden" }}>
        <AbsoluteFill style={{ background: grainBg }} />
        <AbsoluteFill style={{ opacity: 0.1 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id={filterId}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.03"
                numOctaves="2"
                seed={seed}
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${filterId})`} />
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ── Concrete ─────────────────────────────────────────────────────────
  if (config.type === "concrete") {
    const seed = 77;
    const filterId = `concrete-${seed}`;
    return (
      <AbsoluteFill style={{ backgroundColor: config.baseColor, overflow: "hidden" }}>
        <AbsoluteFill style={{ opacity: 0.08 + config.roughness * 0.12 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id={filterId}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency={0.5 + config.roughness * 0.3}
                numOctaves={4}
                seed={seed}
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${filterId})`} />
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // Fallback: treat as solid white
  return <AbsoluteFill style={{ backgroundColor: "#FFFFFF", overflow: "hidden" }} />;
};
