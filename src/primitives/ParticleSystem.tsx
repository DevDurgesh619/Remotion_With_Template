import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { FrameRange } from "./animations";

const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ── Deterministic Seeding ────────────────────────────────────────────────

/** Deterministic pseudo-random number from seed (0-1 range). */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ── Particle Types ───────────────────────────────────────────────────────

interface Particle {
  startX: number;
  startY: number;
  velocityX: number;
  velocityY: number;
  size: number;
  lifespan: number; // 0-1, fraction of total range
  delay: number; // 0-1, fraction of total range before appearing
  color: string;
  opacity: number;
}

// ── Particle Presets ─────────────────────────────────────────────────────

function generateExplodeParticles(
  count: number,
  centerX: number,
  centerY: number,
  color: string,
  spreadRadius: number = 300
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = seededRandom(i * 7 + 1) * Math.PI * 2;
    const speed = 50 + seededRandom(i * 13 + 3) * spreadRadius;
    particles.push({
      startX: centerX,
      startY: centerY,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed,
      size: 2 + seededRandom(i * 17 + 5) * 6,
      lifespan: 0.5 + seededRandom(i * 23 + 7) * 0.5,
      delay: seededRandom(i * 29 + 11) * 0.1,
      color,
      opacity: 0.6 + seededRandom(i * 31 + 13) * 0.4,
    });
  }
  return particles;
}

function generateFireworkParticles(
  count: number,
  centerX: number,
  centerY: number,
  colors: string[],
  gravity: number = 150
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = seededRandom(i * 11 + 1) * Math.PI * 2;
    const speed = 100 + seededRandom(i * 19 + 3) * 200;
    const colorIdx = Math.floor(seededRandom(i * 37 + 9) * colors.length);
    particles.push({
      startX: centerX,
      startY: centerY,
      velocityX: Math.cos(angle) * speed,
      velocityY: Math.sin(angle) * speed - gravity, // upward bias
      size: 2 + seededRandom(i * 23 + 5) * 4,
      lifespan: 0.4 + seededRandom(i * 29 + 7) * 0.4,
      delay: 0,
      color: colors[colorIdx],
      opacity: 0.8 + seededRandom(i * 41 + 11) * 0.2,
    });
  }
  return particles;
}

// ── Main Component ───────────────────────────────────────────────────────

interface ParticleSystemProps {
  preset: "explode" | "fireworks" | "scatter";
  range: FrameRange;
  centerX?: number;
  centerY?: number;
  particleCount?: number;
  color?: string;
  colors?: string[];
  spreadRadius?: number;
  style?: React.CSSProperties;
}

/**
 * Renders a deterministic particle system.
 * All trajectories are computed from frame number — no randomness.
 */
export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  preset,
  range,
  centerX = 50, // percentage
  centerY = 50,
  particleCount = 40,
  color = "#FFFFFF",
  colors = ["#FF0000", "#FFD700", "#FF6B35", "#FFFFFF"],
  spreadRadius = 300,
  style,
}) => {
  const frame = useCurrentFrame();

  const particles = React.useMemo(() => {
    switch (preset) {
      case "explode":
      case "scatter":
        return generateExplodeParticles(particleCount, centerX, centerY, color, spreadRadius);
      case "fireworks":
        return generateFireworkParticles(particleCount, centerX, centerY, colors);
      default:
        return [];
    }
  }, [preset, particleCount, centerX, centerY, color, colors, spreadRadius]);

  const totalDur = range.endFrame - range.startFrame;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        ...style,
      }}
    >
      {particles.map((p, i) => {
        const delayFrames = Math.round(p.delay * totalDur);
        const lifespanFrames = Math.round(p.lifespan * totalDur);
        const particleStart = range.startFrame + delayFrames;
        const particleEnd = particleStart + lifespanFrames;

        if (frame < particleStart || frame > particleEnd) return null;

        const t = interpolate(frame, [particleStart, particleEnd], [0, 1], CLAMP);

        // Position with gravity for fireworks
        const gravity = preset === "fireworks" ? 400 : 0;
        const x = p.startX + p.velocityX * t;
        const y = p.startY + p.velocityY * t + 0.5 * gravity * t * t;

        // Fade out near end of life
        const opacity = interpolate(
          frame,
          [particleStart, particleEnd - Math.round(lifespanFrames * 0.3), particleEnd],
          [p.opacity, p.opacity, 0],
          CLAMP
        );

        // Scale down as particle dies
        const scale = interpolate(
          frame,
          [particleStart, particleEnd],
          [1, preset === "scatter" ? 0 : 0.3],
          CLAMP
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: p.size + "px",
              height: p.size + "px",
              borderRadius: "50%",
              backgroundColor: p.color,
              opacity,
              transform: `scale(${scale})`,
            }}
          />
        );
      })}
    </div>
  );
};

// ── Pixelate Effect ──────────────────────────────────────────────────────

interface PixelateOverlayProps {
  range: FrameRange;
  color?: string;
  gridSize?: number;
  direction?: "cover" | "uncover";
  style?: React.CSSProperties;
}

/**
 * Renders a grid of squares that progressively cover or uncover the content.
 * Simulates pixelation/digital dissolve.
 */
export const PixelateOverlay: React.FC<PixelateOverlayProps> = ({
  range,
  color = "#000000",
  gridSize = 20,
  direction = "cover",
  style,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [range.startFrame, range.endFrame],
    direction === "cover" ? [0, 1] : [1, 0],
    CLAMP
  );

  // Generate a deterministic grid of cells
  const cols = Math.ceil(1920 / gridSize);
  const rows = Math.ceil(1080 / gridSize);
  const totalCells = cols * rows;
  const visibleCount = Math.round(progress * totalCells);

  // Build cells with deterministic ordering
  const cells = React.useMemo(() => {
    const order: { col: number; row: number; priority: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        order.push({
          col: c,
          row: r,
          priority: seededRandom(r * 1000 + c),
        });
      }
    }
    order.sort((a, b) => a.priority - b.priority);
    return order;
  }, [cols, rows]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        ...style,
      }}
    >
      {cells.slice(0, visibleCount).map((cell, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: cell.col * gridSize + "px",
            top: cell.row * gridSize + "px",
            width: gridSize + "px",
            height: gridSize + "px",
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
};
