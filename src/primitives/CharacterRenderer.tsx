import React from "react";
import { useCurrentFrame } from "remotion";
import type { FrameRange } from "./animations";

export interface CharacterAnimationFn {
  (frame: number, index: number, total: number, range: FrameRange): React.CSSProperties;
}

interface CharacterRendererProps {
  text: string;
  splitMode: "character" | "word";
  animateFn: CharacterAnimationFn;
  range: FrameRange;
  style?: React.CSSProperties;
}

/**
 * Renders text split into individually-animated spans.
 * Each character/word gets its own CSS transforms computed per frame.
 */
export const CharacterRenderer: React.FC<CharacterRendererProps> = ({
  text,
  splitMode,
  animateFn,
  range,
  style,
}) => {
  const frame = useCurrentFrame();

  const segments =
    splitMode === "character"
      ? text.split("")
      : text.split(/(\s+)/); // split by whitespace, keeping spaces

  const nonSpaceSegments = segments.filter((s) => s.trim().length > 0);
  const totalAnimatable = nonSpaceSegments.length;

  let animIndex = 0;

  return (
    <span style={style}>
      {segments.map((segment, i) => {
        // Whitespace segments are rendered as-is without animation
        if (segment.trim().length === 0) {
          return (
            <span key={i} style={{ whiteSpace: "pre" }}>
              {segment}
            </span>
          );
        }

        const currentIndex = animIndex;
        animIndex++;

        const animStyle = animateFn(frame, currentIndex, totalAnimatable, range);

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              ...animStyle,
            }}
          >
            {segment}
          </span>
        );
      })}
    </span>
  );
};
