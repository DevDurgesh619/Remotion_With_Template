import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import type { FrameRange } from "./animations";

const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ── Outline Stroke (Draw Path Animation) ────────────────────────────────

interface OutlineStrokeProps {
  text: string;
  range: FrameRange;
  fontSize: number;
  color: string;
  fillColor?: string;
  strokeWidth?: number;
  fontFamily?: string;
  fontWeight?: number | string;
  style?: React.CSSProperties;
}

/**
 * Renders text as SVG with animated stroke-dashoffset (draw-on effect).
 * The stroke draws on progressively, then optionally fills.
 */
export const OutlineStroke: React.FC<OutlineStrokeProps> = ({
  text,
  range,
  fontSize,
  color,
  fillColor,
  strokeWidth = 2,
  fontFamily = "Arial, Helvetica, sans-serif",
  fontWeight = 700,
  style,
}) => {
  const frame = useCurrentFrame();
  const dur = range.endFrame - range.startFrame;

  // Estimate path length based on text length and font size
  const estimatedPathLength = text.length * fontSize * 0.7;

  // Stroke draws during first 70% of range
  const strokeEnd = range.startFrame + Math.round(dur * 0.7);
  const dashOffset = interpolate(
    frame,
    [range.startFrame, strokeEnd],
    [estimatedPathLength, 0],
    CLAMP
  );

  // Fill fades in during last 40% of range
  const fillStart = range.startFrame + Math.round(dur * 0.6);
  const fillOpacity = fillColor
    ? interpolate(frame, [fillStart, range.endFrame], [0, 1], CLAMP)
    : 0;

  const svgWidth = text.length * fontSize * 0.65;
  const svgHeight = fontSize * 1.4;

  return (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stroke layer */}
        <text
          x="0"
          y={fontSize}
          fontSize={fontSize}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={estimatedPathLength}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {text}
        </text>

        {/* Fill layer */}
        {fillColor && (
          <text
            x="0"
            y={fontSize}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fontWeight={fontWeight}
            fill={fillColor}
            opacity={fillOpacity}
          >
            {text}
          </text>
        )}
      </svg>
    </div>
  );
};

// ── Liquify / Melt Effect ────────────────────────────────────────────────

interface LiquifyTextProps {
  children: React.ReactNode;
  range: FrameRange;
  direction?: "melt-down" | "melt-up";
  maxScale?: number;
  style?: React.CSSProperties;
}

/**
 * Applies SVG feTurbulence + feDisplacementMap to melt/liquify content.
 * The displacement scale animates from 0 (normal) to maxScale (melted).
 */
export const LiquifyText: React.FC<LiquifyTextProps> = ({
  children,
  range,
  direction = "melt-down",
  maxScale = 30,
  style,
}) => {
  const frame = useCurrentFrame();

  const displacementScale = interpolate(
    frame,
    [range.startFrame, range.endFrame],
    direction === "melt-down" ? [0, maxScale] : [maxScale, 0],
    CLAMP
  );

  const seed = 42; // Fixed for determinism
  const filterId = `liquify-${seed}-${range.startFrame}`;

  return (
    <div style={{ position: "relative", ...style }}>
      <svg
        style={{ position: "absolute", width: 0, height: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="3"
              seed={seed}
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale={displacementScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div style={{ filter: `url(#${filterId})` }}>{children}</div>
    </div>
  );
};

// ── Ink Bleed Effect ─────────────────────────────────────────────────────

interface InkBleedTextProps {
  children: React.ReactNode;
  range: FrameRange;
  maxRadius?: number;
  blurAmount?: number;
  style?: React.CSSProperties;
}

/**
 * Applies SVG feMorphology (dilate) + feGaussianBlur for ink bleed spread.
 * The dilate radius grows from 0 to maxRadius over the range.
 */
export const InkBleedText: React.FC<InkBleedTextProps> = ({
  children,
  range,
  maxRadius = 3,
  blurAmount = 1.5,
  style,
}) => {
  const frame = useCurrentFrame();

  const radius = interpolate(
    frame,
    [range.startFrame, range.endFrame],
    [0, maxRadius],
    CLAMP
  );

  const blur = interpolate(
    frame,
    [range.startFrame, range.endFrame],
    [0, blurAmount],
    CLAMP
  );

  const filterId = `ink-bleed-${range.startFrame}`;

  return (
    <div style={{ position: "relative", ...style }}>
      <svg
        style={{ position: "absolute", width: 0, height: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feMorphology
              operator="dilate"
              radius={radius}
              in="SourceGraphic"
              result="dilated"
            />
            <feGaussianBlur in="dilated" stdDeviation={blur} result="blurred" />
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <div style={{ filter: `url(#${filterId})` }}>{children}</div>
    </div>
  );
};
