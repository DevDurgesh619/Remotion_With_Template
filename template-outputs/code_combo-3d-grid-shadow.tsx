import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Asset } from "./assets/Asset";

export const GeneratedMotion = () => {
const frame = useCurrentFrame();
const canvasW = 1920;
const canvasH = 1080;
const halfW = canvasW / 2;
const halfH = canvasH / 2;

// Ambient orbs (dark background -> light tints)
const cycle1 = 150;
const amp1 = 8;
const orb1Phase = frame % cycle1;
const orb1Drift = interpolate(orb1Phase, [0, cycle1 / 2, cycle1], [-amp1, amp1, -amp1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
});

const cycle2 = 170;
const amp2 = 6;
const orb2Phase = frame % cycle2;
const orb2Drift = interpolate(orb2Phase, [0, cycle2 / 2, cycle2], [-amp2, amp2, -amp2], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
});

const cycle3 = 190;
const amp3 = 10;
const orb3Phase = frame % cycle3;
const orb3Drift = interpolate(orb3Phase, [0, cycle3 / 2, cycle3], [-amp3, amp3, -amp3], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
});

// Grid asset opacity animation (0s - 1s)
const gridStart = 0;
const gridEnd = 1 * 30;
const gridOpacity = interpolate(frame, [gridStart, gridEnd], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.ease)
});

// Timeline frames for rotates and fades
// old_way_1 rotateY 1s-3s (-90 -> 0)
const old1_r_start = 1 * 30;
const old1_r_end = 3 * 30;
const old1_rotateY = interpolate(frame, [old1_r_start, old1_r_end], [-90, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.inOut(Easing.ease)
});
// old_way_2 rotateY 1.5s-3.5s
const old2_r_start = 1.5 * 30;
const old2_r_end = 3.5 * 30;
const old2_rotateY = interpolate(frame, [old2_r_start, old2_r_end], [-90, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.inOut(Easing.ease)
});
// old_way_3 rotateY 2s-4s
const old3_r_start = 2 * 30;
const old3_r_end = 4 * 30;
const old3_rotateY = interpolate(frame, [old3_r_start, old3_r_end], [-90, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.inOut(Easing.ease)
});

// new_way_1 rotateY 3s-5s (90 -> 0)
const new1_r_start = 3 * 30;
const new1_r_end = 5 * 30;
const new1_rotateY = interpolate(frame, [new1_r_start, new1_r_end], [90, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.inOut(Easing.ease)
});
// new_way_2 rotateY 3.5s-5.5s
const new2_r_start = 3.5 * 30;
const new2_r_end = 5.5 * 30;
const new2_rotateY = interpolate(frame, [new2_r_start, new2_r_end], [90, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.inOut(Easing.ease)
});
// new_way_3 rotateY 4s-6s
const new3_r_start = 4 * 30;
const new3_r_end = 6 * 30;
const new3_rotateY = interpolate(frame, [new3_r_start, new3_r_end], [90, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.inOut(Easing.ease)
});

// Shadow animation for all text objects 5s-11s (offsetX, offsetY, blur, spread)
const shStart = 5 * 30;
const shEnd = 11 * 30;
// from [2,2,4,0,#333333] to [3,3,5,0,#333333]
const sh_from_offX = 2;
const sh_to_offX = 3;
const sh_from_offY = 2;
const sh_to_offY = 3;
const sh_from_blur = 4;
const sh_to_blur = 5;
const sh_from_spread = 0;
const sh_to_spread = 0;
const shadowOffX = interpolate(frame, [shStart, shEnd], [sh_from_offX, sh_to_offX], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
});
const shadowOffY = interpolate(frame, [shStart, shEnd], [sh_from_offY, sh_to_offY], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
});
const shadowBlur = interpolate(frame, [shStart, shEnd], [sh_from_blur, sh_to_blur], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
});
const shadowSpread = interpolate(frame, [shStart, shEnd], [sh_from_spread, sh_to_spread], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp"
});
const shadowColor = "#333333";
const boxShadowStr = shadowOffX + "px " + shadowOffY + "px " + shadowBlur + "px " + shadowSpread + "px " + shadowColor;

// Opacity fade out for all text 11s-12s (1 -> 0) easing ease-in
const fadeStart = 11 * 30;
const fadeEnd = 12 * 30;
const fadeEase = Easing.in(Easing.ease);
const old1_opacity = interpolate(frame, [fadeStart, fadeEnd], [1, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: fadeEase
});
const old2_opacity = interpolate(frame, [fadeStart, fadeEnd], [1, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: fadeEase
});
const old3_opacity = interpolate(frame, [fadeStart, fadeEnd], [1, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: fadeEase
});
const new1_opacity = interpolate(frame, [fadeStart, fadeEnd], [1, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: fadeEase
});
const new2_opacity = interpolate(frame, [fadeStart, fadeEnd], [1, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: fadeEase
});
const new3_opacity = interpolate(frame, [fadeStart, fadeEnd], [1, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: fadeEase
});

// Positions from spec
const old1_posX = -480;
const old1_posY = -150;
const old2_posX = -480;
const old2_posY = 0;
const old3_posX = -480;
const old3_posY = 150;

const new1_posX = 480;
const new1_posY = -150;
const new2_posX = 480;
const new2_posY = 0;
const new3_posX = 480;
const new3_posY = 150;

// Text style common defaults
const txtLineHeight = "1";
const txtLetterSpacing = 0;
const txtTextAlign = "left";
const txtTransform = "none";

// Perspective value (added to enable proper 3D rotateY)
const perspectiveValue = 800;

return (
  <AbsoluteFill style={{ backgroundColor: "#1A1A2E", overflow: "hidden" }}>
    {/* Ambient orbs (behind content) */}
    <div style={{
      position: "absolute",
      left: "70%",
      top: "15%",
      width: 320,
      height: 320,
      borderRadius: "50%",
      backgroundColor: "#2E3AFF",
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
      backgroundColor: "#FF6B6B",
      filter: "blur(50px)",
      opacity: 0.05,
      transform: "translateX(" + orb2Drift + "px)",
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
      backgroundColor: "#4DD0E1",
      filter: "blur(70px)",
      opacity: 0.05,
      transform: "translateX(" + orb3Drift + "px)",
      zIndex: 1,
      pointerEvents: "none"
    }} />

    {/* Grid asset (background) */}
    <Asset id={"grid"} width={1920} height={1080} color={undefined}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        opacity: gridOpacity,
        zIndex: 0,
        pointerEvents: "none"
      }} />

    {/* Old Way 1 */}
    <div style={{ perspective: perspectiveValue + "px", position: "absolute", left: "50%", top: "50%", zIndex: 2 }}>
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%) translateX(" + old1_posX + "px) translateY(" + old1_posY + "px) rotateY(" + old1_rotateY + "deg)",
        color: "#E53935",
        fontSize: 48 + "px",
        fontWeight: "bold",
        fontFamily: "Arial",
        whiteSpace: "nowrap",
        lineHeight: txtLineHeight,
        letterSpacing: txtLetterSpacing + "px",
        textAlign: txtTextAlign,
        textTransform: txtTransform,
        userSelect: "none",
        pointerEvents: "none",
        boxShadow: boxShadowStr,
        opacity: old1_opacity
      }}>
        Old Way 1
      </div>
    </div>

    {/* Old Way 2 */}
    <div style={{ perspective: perspectiveValue + "px", position: "absolute", left: "50%", top: "50%", zIndex: 2 }}>
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%) translateX(" + old2_posX + "px) translateY(" + old2_posY + "px) rotateY(" + old2_rotateY + "deg)",
        color: "#E53935",
        fontSize: 48 + "px",
        fontWeight: "bold",
        fontFamily: "Arial",
        whiteSpace: "nowrap",
        lineHeight: txtLineHeight,
        letterSpacing: txtLetterSpacing + "px",
        textAlign: txtTextAlign,
        textTransform: txtTransform,
        userSelect: "none",
        pointerEvents: "none",
        boxShadow: boxShadowStr,
        opacity: old2_opacity
      }}>
        Old Way 2
      </div>
    </div>

    {/* Old Way 3 */}
    <div style={{ perspective: perspectiveValue + "px", position: "absolute", left: "50%", top: "50%", zIndex: 2 }}>
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%) translateX(" + old3_posX + "px) translateY(" + old3_posY + "px) rotateY(" + old3_rotateY + "deg)",
        color: "#E53935",
        fontSize: 48 + "px",
        fontWeight: "bold",
        fontFamily: "Arial",
        whiteSpace: "nowrap",
        lineHeight: txtLineHeight,
        letterSpacing: txtLetterSpacing + "px",
        textAlign: txtTextAlign,
        textTransform: txtTransform,
        userSelect: "none",
        pointerEvents: "none",
        boxShadow: boxShadowStr,
        opacity: old3_opacity
      }}>
        Old Way 3
      </div>
    </div>

    {/* New Way 1 */}
    <div style={{ perspective: perspectiveValue + "px", position: "absolute", left: "50%", top: "50%", zIndex: 2 }}>
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%) translateX(" + new1_posX + "px) translateY(" + new1_posY + "px) rotateY(" + new1_rotateY + "deg)",
        color: "#2196F3",
        fontSize: 48 + "px",
        fontWeight: "bold",
        fontFamily: "Arial",
        whiteSpace: "nowrap",
        lineHeight: txtLineHeight,
        letterSpacing: txtLetterSpacing + "px",
        textAlign: txtTextAlign,
        textTransform: txtTransform,
        userSelect: "none",
        pointerEvents: "none",
        boxShadow: boxShadowStr,
        opacity: new1_opacity
      }}>
        New Way 1
      </div>
    </div>

    {/* New Way 2 */}
    <div style={{ perspective: perspectiveValue + "px", position: "absolute", left: "50%", top: "50%", zIndex: 2 }}>
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%) translateX(" + new2_posX + "px) translateY(" + new2_posY + "px) rotateY(" + new2_rotateY + "deg)",
        color: "#2196F3",
        fontSize: 48 + "px",
        fontWeight: "bold",
        fontFamily: "Arial",
        whiteSpace: "nowrap",
        lineHeight: txtLineHeight,
        letterSpacing: txtLetterSpacing + "px",
        textAlign: txtTextAlign,
        textTransform: txtTransform,
        userSelect: "none",
        pointerEvents: "none",
        boxShadow: boxShadowStr,
        opacity: new2_opacity
      }}>
        New Way 2
      </div>
    </div>

    {/* New Way 3 */}
    <div style={{ perspective: perspectiveValue + "px", position: "absolute", left: "50%", top: "50%", zIndex: 2 }}>
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%) translateX(" + new3_posX + "px) translateY(" + new3_posY + "px) rotateY(" + new3_rotateY + "deg)",
        color: "#2196F3",
        fontSize: 48 + "px",
        fontWeight: "bold",
        fontFamily: "Arial",
        whiteSpace: "nowrap",
        lineHeight: txtLineHeight,
        letterSpacing: txtLetterSpacing + "px",
        textAlign: txtTextAlign,
        textTransform: txtTransform,
        userSelect: "none",
        pointerEvents: "none",
        boxShadow: boxShadowStr,
        opacity: new3_opacity
      }}>
        New Way 3
      </div>
    </div>
  </AbsoluteFill>
);
};
