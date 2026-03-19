import type { FrameRange } from "./animations";
import {
  breathe, driftX, gentleRotate, microFloat,
  skewOscillate, continuousRotate, stretchSquash, shadowDance,
  waveMotion,
} from "./animations";
import type { SecondaryMotion } from "../templates/types";

export interface SecondaryMotionResult {
  scale: number;
  x: number;
  y: number;
  rotation: number;
  skewX: number;
  scaleX: number;
  scaleY: number;
  shadowX: number;
  shadowY: number;
}

const INTENSITY_MAP: Record<string, { amplitude: number; period: number }> = {
  subtle:  { amplitude: 0.010, period: 120 },
  medium:  { amplitude: 0.020, period: 90  },
  strong:  { amplitude: 0.035, period: 70  },
};

const DRIFT_INTENSITY: Record<string, { amplitude: number; period: number }> = {
  subtle:  { amplitude: 2,  period: 130 },
  medium:  { amplitude: 4,  period: 100 },
  strong:  { amplitude: 7,  period: 80  },
};

const ROTATE_INTENSITY: Record<string, { maxDeg: number; period: number }> = {
  subtle:  { maxDeg: 1.0, period: 150 },
  medium:  { maxDeg: 2.0, period: 110 },
  strong:  { maxDeg: 3.5, period: 85  },
};

const FLOAT_INTENSITY: Record<string, { amplitude: number; period: number }> = {
  subtle:  { amplitude: 1.5, period: 80  },
  medium:  { amplitude: 3,   period: 60  },
  strong:  { amplitude: 5,   period: 45  },
};

const SKEW_INTENSITY: Record<string, { maxDeg: number; period: number }> = {
  subtle:  { maxDeg: 3,   period: 120 },
  medium:  { maxDeg: 6,   period: 90  },
  strong:  { maxDeg: 10,  period: 70  },
};

const CONTINUOUS_ROTATE_INTENSITY: Record<string, { period: number }> = {
  subtle:  { period: 180 },
  medium:  { period: 90  },
  strong:  { period: 45  },
};

const STRETCH_SQUASH_INTENSITY: Record<string, { amplitude: number; period: number }> = {
  subtle:  { amplitude: 0.04, period: 100 },
  medium:  { amplitude: 0.08, period: 70  },
  strong:  { amplitude: 0.14, period: 50  },
};

const SHADOW_DANCE_INTENSITY: Record<string, { maxOffset: number; periodX: number; periodY: number }> = {
  subtle:  { maxOffset: 3,  periodX: 120, periodY: 160 },
  medium:  { maxOffset: 6,  periodX: 80,  periodY: 110 },
  strong:  { maxOffset: 10, periodX: 60,  periodY: 80  },
};

const IDENTITY: SecondaryMotionResult = {
  scale: 1, x: 0, y: 0, rotation: 0,
  skewX: 0, scaleX: 1, scaleY: 1, shadowX: 0, shadowY: 0,
};

/**
 * Resolve a SecondaryMotion config into concrete transform values for a given frame.
 * Returns identity (no-op) transforms when secondaryMotion is undefined or type is "none".
 */
export function resolveSecondaryMotion(
  frame: number,
  range: FrameRange,
  secondaryMotion?: SecondaryMotion,
): SecondaryMotionResult {
  if (!secondaryMotion || secondaryMotion.type === "none") return IDENTITY;

  const intensity = secondaryMotion.intensity ?? "subtle";

  switch (secondaryMotion.type) {
    case "breathe": {
      const cfg = INTENSITY_MAP[intensity] ?? INTENSITY_MAP.subtle;
      const { scale } = breathe(frame, range, cfg.amplitude, cfg.period);
      return { ...IDENTITY, scale };
    }
    case "float": {
      const cfg = FLOAT_INTENSITY[intensity] ?? FLOAT_INTENSITY.subtle;
      const { y } = microFloat(frame, cfg.amplitude, cfg.period);
      return { ...IDENTITY, y };
    }
    case "drift": {
      const cfg = DRIFT_INTENSITY[intensity] ?? DRIFT_INTENSITY.subtle;
      const { x } = driftX(frame, range, cfg.amplitude, cfg.period);
      return { ...IDENTITY, x };
    }
    case "rotate": {
      const cfg = ROTATE_INTENSITY[intensity] ?? ROTATE_INTENSITY.subtle;
      const { rotation } = gentleRotate(frame, range, cfg.maxDeg, cfg.period);
      return { ...IDENTITY, rotation };
    }
    case "skew": {
      const cfg = SKEW_INTENSITY[intensity] ?? SKEW_INTENSITY.subtle;
      const { skewX } = skewOscillate(frame, range, cfg.maxDeg, cfg.period);
      return { ...IDENTITY, skewX };
    }
    case "continuous-rotate": {
      const cfg = CONTINUOUS_ROTATE_INTENSITY[intensity] ?? CONTINUOUS_ROTATE_INTENSITY.subtle;
      const { rotation } = continuousRotate(frame, range, 360, cfg.period);
      return { ...IDENTITY, rotation };
    }
    case "stretch-squash": {
      const cfg = STRETCH_SQUASH_INTENSITY[intensity] ?? STRETCH_SQUASH_INTENSITY.subtle;
      const { scaleX, scaleY } = stretchSquash(frame, range, cfg.amplitude, cfg.period);
      return { ...IDENTITY, scaleX, scaleY };
    }
    case "shadow-dance": {
      const cfg = SHADOW_DANCE_INTENSITY[intensity] ?? SHADOW_DANCE_INTENSITY.subtle;
      const { shadowX, shadowY } = shadowDance(frame, range, cfg.maxOffset, cfg.periodX, cfg.periodY);
      return { ...IDENTITY, shadowX, shadowY };
    }
    case "wave": {
      // Whole-element wave: uses charIndex=0 for a single oscillation
      const ampMap = { subtle: 3, medium: 6, strong: 10 };
      const { y } = waveMotion(frame, 0, 1, ampMap[intensity] ?? 3, 60, 0);
      return { ...IDENTITY, y };
    }
    case "glitch": {
      // Whole-element glitch: deterministic jitter on the container
      const intMap = { subtle: 0.5, medium: 1, strong: 2 };
      const glitchIntensity = intMap[intensity] ?? 0.5;
      const jitterCycle = 8;
      const jitterFrame = Math.floor(frame / jitterCycle);
      const hash = (jitterFrame * 7) % 37;
      const isGlitching = hash < (glitchIntensity > 1 ? 12 : 6);
      const x = isGlitching ? ((hash % 5) - 2) * glitchIntensity : 0;
      const splitAmt = isGlitching ? 2 * glitchIntensity : 0.5 * glitchIntensity;
      return {
        ...IDENTITY,
        x,
        shadowX: splitAmt,
        shadowY: 0,
      };
    }
    default:
      return IDENTITY;
  }
}
