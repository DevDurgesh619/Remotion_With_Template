import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

export const GeneratedMotion = () => {
const frame = useCurrentFrame();
const canvasW = 1920;
const canvasH = 1080;
const halfW = canvasW / 2;
const halfH = canvasH / 2;

// Timeline frames
const fadeInStart = 0;
const fadeInEnd = 15; // 0.5s * 30
const rotateStart = 15; // 0.5s * 30
const rotateEnd = 105; // 3.5s * 30
const fadeOutStart = 150; // 5s * 30
const fadeOutEnd = 180; // 6s * 30

// Opacity segments
const opacityIn = interpolate(frame, [fadeInStart, fadeInEnd], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.ease)
});
const opacityOut = interpolate(frame, [fadeOutStart, fadeOutEnd], [1, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.in(Easing.ease)
});
// Combined opacity: fades in, stays, then fades out
const textOpacity = opacityIn * opacityOut;

// 3D rotation Y
const rotateY = interpolate(frame, [rotateStart, rotateEnd], [-90, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
});

// Ambient orbs drift (triangle-wave patterns)
const cycle1 = 150;
const mod1 = frame % cycle1;
const drift1 = interpolate(mod1, [0, 75, 150], [-8, 8, -8], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
});

const cycle2 = 170;
const mod2 = frame % cycle2;
const drift2 = interpolate(mod2, [0, 85, 170], [-6, 6, -6], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
});

const cycle3 = 190;
const mod3 = frame % cycle3;
const drift3 = interpolate(mod3, [0, 95, 190], [-10, 10, -10], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
});

// Text object properties
const posX = 0;
const posY = 0;
const textColor = "#39FF14";
const fontSize = 48;
const fontWeight = "bold";
const fontFamily = "Arial";
const textAlign = "center";
const lineHeight = "1";
const letterSpacing = 0;
const textTransform = "none";

return (
  <AbsoluteFill style={{ backgroundColor: "#0F0F23", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />

    <div style={{
      position: "absolute",
      left: "70%",
      top: "15%",
      width: 320,
      height: 320,
      borderRadius: "50%",
      backgroundColor: "#39FF14",
      filter: "blur(60px)",
      opacity: 0.06,
      transform: "translateX(" + drift1 + "px)",
      zIndex: 1,
      pointerEvents: "none"
    }} />

    <div style={{
      position: "absolute",
      left: "10%",
      top: "60%",
      width: 260,
      height: 260,
      borderRadius: "50%",
      backgroundColor: "#4BFF5A",
      filter: "blur(50px)",
      opacity: 0.05,
      transform: "translateX(" + drift2 + "px)",
      zIndex: 1,
      pointerEvents: "none"
    }} />

    <div style={{
      position: "absolute",
      left: "45%",
      top: "75%",
      width: 340,
      height: 340,
      borderRadius: "50%",
      backgroundColor: "#2EFF9A",
      filter: "blur(70px)",
      opacity: 0.04,
      transform: "translateX(" + drift3 + "px)",
      zIndex: 1,
      pointerEvents: "none"
    }} />

    <div style={{ position: "absolute", left: "50%", top: "50%", perspective: "800px", zIndex: 2 }}>
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%) translateX(" + posX + "px) translateY(" + posY + "px) rotateY(" + rotateY + "deg)",
        color: textColor,
        fontSize: fontSize + "px",
        fontWeight: fontWeight,
        fontFamily: fontFamily,
        whiteSpace: "nowrap",
        lineHeight: lineHeight,
        letterSpacing: letterSpacing + "px",
        textAlign: textAlign,
        textTransform: textTransform,
        userSelect: "none",
        pointerEvents: "none",
        opacity: textOpacity,
        zIndex: 3
      }}>
        {"Welcome to the Future"}
      </div>
    </div>
  </AbsoluteFill>
);
};
