// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT BACKGROUND RULES — Always included. Teaches the LLM to generate
// subtle decorative background elements that make videos feel alive.
// ─────────────────────────────────────────────────────────────────────────────

const AMBIENT_RULES = `AMBIENT BACKGROUND DECORATION
Every video should feel cinematic and alive, not flat. Add 2-3 large, soft, blurred
decorative circles behind the main content to create depth and atmosphere.

WHEN TO ADD AMBIENT ELEMENTS:
- Always add them unless the background is very bright/white (#FFFFFF or similar).
- For dark backgrounds: use light-colored orbs (same hue as accent or text color).
- For colored backgrounds: use slightly lighter or complementary tints.

HOW TO CREATE AMBIENT ORBS:
Each orb is a simple div with:
- position: "absolute"
- borderRadius: "50%"
- backgroundColor: an accent or tint color
- filter: "blur(Npx)" where N is 40-80
- opacity: 0.04-0.08 (very subtle)
- width/height: 200-400px
- zIndex: 1 (between background at 0 and content at 2+)
- pointerEvents: "none"

POSITIONING:
Place orbs at percentage-based positions to avoid overlapping content:
- Orb 1: left "70%", top "15%" (upper right area)
- Orb 2: left "10%", top "60%" (lower left area)
- Orb 3 (optional): left "45%", top "75%" (lower center)

SUBTLE DRIFT ANIMATION:
Give each orb a slow, continuous drift using a triangle-wave pattern with interpolate.
This creates gentle back-and-forth motion without loops.

Example for one ambient orb with drift:
const totalFrames = Math.floor(duration * 30);
const ambientDrift1 = interpolate(frame % 150, [0, 75, 150], [-8, 8, -8], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
});

<div style={{
  position: "absolute",
  left: "70%",
  top: "15%",
  width: 300,
  height: 300,
  borderRadius: "50%",
  backgroundColor: "#6C63FF",
  filter: "blur(60px)",
  opacity: 0.06,
  transform: "translateX(" + ambientDrift1 + "px)",
  zIndex: 1,
  pointerEvents: "none"
}} />

IMPORTANT RULES:
- Use frame % N for the triangle-wave cycle (N = 120-200, different per orb).
- The interpolate range must have exactly 3 values: [0, N/2, N] mapping to [-amplitude, +amplitude, -amplitude].
- amplitude should be 5-12px (very subtle).
- Each orb must have a DIFFERENT cycle length so they drift independently.
- Build all strings with + concatenation (no template literals).
- Do NOT use loops to generate orbs — write each one by hand.
- Place ambient orb divs BEFORE content divs in the JSX (so content renders on top).
- Keep opacity low (0.04-0.08). These should be felt, not seen.`;

module.exports = AMBIENT_RULES;
