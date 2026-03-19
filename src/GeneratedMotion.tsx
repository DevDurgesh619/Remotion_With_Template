import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

export const GeneratedMotion = () => {
const frame = useCurrentFrame();
const canvasW = 1920;
const canvasH = 1080;
const halfW = canvasW / 2;
const halfH = canvasH / 2;
const posX_text_1 = 0;
const posY_text_1 = 0;
// Opacity timeline: 0s-1s -> frames 0-30
const opacity_start = 0;
const opacity_end = 30;
const opacity = interpolate(frame, [opacity_start, opacity_end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.ease) });
// Scale timeline segments (frames)
const s1_start = 30;
const s1_end = 75;
const s2_start = 75;
const s2_end = 120;
const s3_start = 120;
const s3_end = 165;
const s4_start = 165;
const s4_end = 210;
const s5_start = 210;
const s5_end = 240;
let scale_text_1 = 1;
if (frame >= s1_start && frame < s1_end) {
  scale_text_1 = interpolate(frame, [s1_start, s1_end], [1, 1.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) });
} else if (frame >= s2_start && frame < s2_end) {
  scale_text_1 = interpolate(frame, [s2_start, s2_end], [1.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) });
} else if (frame >= s3_start && frame < s3_end) {
  scale_text_1 = interpolate(frame, [s3_start, s3_end], [1, 1.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) });
} else if (frame >= s4_start && frame < s4_end) {
  scale_text_1 = interpolate(frame, [s4_start, s4_end], [1.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) });
} else if (frame >= s5_start && frame <= s5_end) {
  scale_text_1 = interpolate(frame, [s5_start, s5_end], [1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}
return (
  <AbsoluteFill style={{ backgroundColor: "#FFFFFF", overflow: "hidden" }}>
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform:
          "translate(-50%, -50%) translateX(" +
          posX_text_1 +
          "px) translateY(" +
          posY_text_1 +
          "px) scale(" +
          scale_text_1 +
          ")",
        color: "#E53935",
        fontSize: "48px",
        fontWeight: "bold",
        fontFamily: "Arial",
        whiteSpace: "nowrap",
        lineHeight: "1",
        letterSpacing: "0px",
        textAlign: "center",
        textTransform: "none",
        userSelect: "none",
        pointerEvents: "none",
        opacity: opacity
      }}
    >
      Next Level
    </div>
  </AbsoluteFill>
);
};
