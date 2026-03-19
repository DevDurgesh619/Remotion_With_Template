import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

export const GeneratedMotion = () => {
const frame = useCurrentFrame();
const w = 1920;
const h = 1080;
const halfW = w / 2;
const halfH = h / 2;

// Grid background opacity animation (0s -> 1s)
const gridStart = 0;
const gridEnd = 30;
const gridOpacity = interpolate(frame, [gridStart, gridEnd], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.ease)
});
const gridBg = "repeating-linear-gradient(0deg, rgba(76,175,80," + gridOpacity + "), rgba(76,175,80," + gridOpacity + ") 1px, transparent 1px, transparent 30px), " + "repeating-linear-gradient(90deg, rgba(76,175,80," + gridOpacity + "), rgba(76,175,80," + gridOpacity + ") 1px, transparent 1px, transparent 30px)";

// Ambient orbs (soft blurred decorative circles)
const orb1Cycle = 150;
const orb1Drift = interpolate(frame % orb1Cycle, [0, orb1Cycle / 2, orb1Cycle], [-8, 8, -8], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
});
const orb2Cycle = 170;
const orb2Drift = interpolate(frame % orb2Cycle, [0, orb2Cycle / 2, orb2Cycle], [-6, 6, -6], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
});
const orb3Cycle = 190;
const orb3Drift = interpolate(frame % orb3Cycle, [0, orb3Cycle / 2, orb3Cycle], [-10, 10, -10], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
});

// Uptime text typewriter (1s -> 4s) chars 0 -> 6
const uptimeCharsStart = 30;
const uptimeCharsEnd = 120;
const uptimeChars = interpolate(frame, [uptimeCharsStart, uptimeCharsEnd], [0, 6], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.ease)
});
const uptimeFull = "99.99%";
const uptimeVisible = uptimeFull.slice(0, Math.round(uptimeChars));
// Uptime fade out (7s -> 8s)
const fadeStart = 210;
const fadeEnd = 240;
const uptimeOpacity = interpolate(frame, [fadeStart, fadeEnd], [1, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.in(Easing.ease)
});

// Network Uptime text typewriter (4s -> 5s) chars 0 -> 14
const networkCharsStart = 120;
const networkCharsEnd = 150;
const networkChars = interpolate(frame, [networkCharsStart, networkCharsEnd], [0, 14], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.ease)
});
const networkFull = "Network Uptime";
const networkVisible = networkFull.slice(0, Math.round(networkChars));
// Network fade out (7s -> 8s)
const networkOpacity = interpolate(frame, [fadeStart, fadeEnd], [1, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.in(Easing.ease)
});

// Trend text typewriter (4s -> 5s) chars 0 -> 13
const trendCharsStart = 120;
const trendCharsEnd = 150;
const trendChars = interpolate(frame, [trendCharsStart, trendCharsEnd], [0, 13], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.ease)
});
const trendFull = "Trend: +0.03%";
const trendVisible = trendFull.slice(0, Math.round(trendChars));
// Trend fade out (7s -> 8s)
const trendOpacity = interpolate(frame, [fadeStart, fadeEnd], [1, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.in(Easing.ease)
});

return (
  <AbsoluteFill style={{ backgroundColor: "#0F0F23", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: gridBg, zIndex: 0, pointerEvents: "none" }} />

    <div style={{
      position: "absolute",
      left: "70%",
      top: "15%",
      width: 300,
      height: 300,
      borderRadius: "50%",
      backgroundColor: "#4CAF50",
      filter: "blur(60px)",
      opacity: 0.06,
      transform: "translateX(" + orb1Drift + "px)",
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
      backgroundColor: "#4CAF50",
      filter: "blur(70px)",
      opacity: 0.05,
      transform: "translateY(" + orb2Drift + "px)",
      zIndex: 1,
      pointerEvents: "none"
    }} />

    <div style={{
      position: "absolute",
      left: "45%",
      top: "75%",
      width: 220,
      height: 220,
      borderRadius: "50%",
      backgroundColor: "#66E07A",
      filter: "blur(50px)",
      opacity: 0.04,
      transform: "translateX(" + orb3Drift + "px)",
      zIndex: 1,
      pointerEvents: "none"
    }} />

    <div style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%) translateX(" + 0 + "px) translateY(" + -50 + "px)",
      color: "#4CAF50",
      fontSize: 96 + "px",
      fontWeight: "bold",
      fontFamily: "monospace",
      whiteSpace: "nowrap",
      lineHeight: "1",
      letterSpacing: 0 + "px",
      textAlign: "center",
      textTransform: "none",
      userSelect: "none",
      pointerEvents: "none",
      opacity: uptimeOpacity,
      zIndex: 2
    }}>
      {uptimeVisible}
    </div>

    <div style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%) translateX(" + 0 + "px) translateY(" + 50 + "px)",
      color: "#4CAF50",
      fontSize: 48 + "px",
      fontWeight: "normal",
      fontFamily: "monospace",
      whiteSpace: "nowrap",
      lineHeight: "1",
      letterSpacing: 0 + "px",
      textAlign: "center",
      textTransform: "none",
      userSelect: "none",
      pointerEvents: "none",
      opacity: networkOpacity,
      zIndex: 2
    }}>
      {networkVisible}
    </div>

    <div style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%) translateX(" + 0 + "px) translateY(" + 100 + "px)",
      color: "#4CAF50",
      fontSize: 36 + "px",
      fontWeight: "normal",
      fontFamily: "monospace",
      whiteSpace: "nowrap",
      lineHeight: "1",
      letterSpacing: 0 + "px",
      textAlign: "center",
      textTransform: "none",
      userSelect: "none",
      pointerEvents: "none",
      opacity: trendOpacity,
      zIndex: 2
    }}>
      {trendVisible}
    </div>
  </AbsoluteFill>
);
};
