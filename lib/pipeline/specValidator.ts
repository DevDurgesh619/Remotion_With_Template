/**
 * Spec Semantic Validator + Motion Polisher (combined single LLM call)
 *
 * Sits after specGenerator in the legacy pipeline.
 * Takes the detailed prompt + generated spec, compares them semantically,
 * fixes any semantic errors, AND polishes the timeline for better motion.
 *
 * Uses GPT-4o for high-accuracy semantic comparison + motion choreography.
 * Falls back to original spec on any failure.
 */

import OpenAI from "openai";

const VALIDATOR_SYSTEM_PROMPT = `You are a QA validator AND motion choreographer for a motion graphics spec system. You receive a DETAILED PROMPT describing an animation and the GENERATED SPEC JSON produced from that prompt.

Your job has TWO phases:

═══════════════════════════════════════════
PHASE 1: SEMANTIC VALIDATION
═══════════════════════════════════════════

Compare the prompt and spec. Fix any semantic errors:

1. OBJECT COMPLETENESS
   - Every shape, text element, or asset described in the prompt MUST exist in spec.objects.
   - Count objects in prompt vs spec. If any are missing, add them.
   - Each object must have: id, shape, pos, and relevant style props (color, fontSize, diameter, etc.).

2. COLOR ACCURACY
   - Every hex color mentioned in the prompt must appear exactly in the spec.
   - Check background (bg), object colors, and text colors.
   - Do NOT approximate colors — use the exact hex from the prompt.

3. POSITION SEMANTICS
   - The coordinate system is CENTER-RELATIVE: [0,0] = center of canvas.
   - "center" = [0,0], "top" = negative Y, "bottom" = positive Y, "left" = negative X, "right" = positive X.
   - For a 1920x1080 canvas: full width range is roughly [-960, 960], full height [-540, 540].
   - Verify positions match the spatial descriptions in the prompt.

4. TIMELINE COVERAGE
   - Every animation phase described in the prompt must have corresponding timeline entries.
   - If the prompt says "fades in over 1s, holds for 2s, slides out over 1s", there must be timeline entries for fade-in AND slide-out (hold needs no entry).
   - Check that ALL objects that should animate have timeline entries.

5. DURATION CONSISTENCY
   - No timeline entry's time[1] should exceed spec.duration.
   - Timeline phases should add up logically to the total duration.

6. PROPERTY ACCURACY
   - If prompt says "scales up", the timeline entry should have "scale", not just "opacity".
   - If prompt says "slides left to right", timeline should have "x" animation.
   - Match the animation type to the described motion.

7. BACKGROUND
   - If prompt describes a gradient, bg should be an object with type/from/to/direction, not a plain color string.
   - If prompt describes a glow, bg should include a glow field.

═══════════════════════════════════════════
PHASE 2: MOTION POLISH (after fixing errors)
═══════════════════════════════════════════

Now polish the timeline for professional-quality motion:

1. OVERLAPPING PHASES
   - If animations are strictly sequential (one ends exactly when next begins), add 0.15–0.3s overlap.
   - This creates smoother visual flow instead of jarring stop-start transitions.
   - NEVER overlap the same object's same property.

2. STAGGER MULTI-OBJECT ENTRIES
   - If multiple objects animate at the exact same time with the same animation, add slight stagger (0.05–0.15s between each).
   - Creates a cascade/wave effect instead of everything appearing at once.

3. EASING SELECTION
   Match easing to the motion type:
   - Entrance animations (fade in, scale up, slide in): "ease-out"
   - Exit animations (fade out, scale down, slide out): "ease-in"
   - Position movements (sliding, translating): "ease-in-out"
   - Bouncy/playful entrances: "spring"
   - Dramatic impacts (text slam, shape drop): "bounce"
   - Subtle/ambient motion (breathing, floating): "ease-in-out"
   - Only change "linear" easings to something better. Keep well-chosen non-linear easings.

4. TIMING CONSTRAINTS
   - NEVER let any timeline entry's time[1] exceed the spec "duration".
   - NEVER let any timeline entry's time[0] go below 0.
   - Maintain at least 0.1s for any animation phase.

OUTPUT FORMAT:
Return a JSON object with exactly two keys:
{
  "spec": <the corrected AND polished spec JSON>,
  "changes": [<array of strings describing each fix/polish made, empty if none>]
}

RULES:
- Do NOT add objects or animations not described in the prompt.
- Do NOT change the scene name, duration, fps, or canvas unless they are clearly wrong.
- Do NOT remove objects that are correctly present.
- Preserve the exact JSON structure (scene, duration, fps, canvas, bg, objects, timeline).
- If the spec is already correct and well-choreographed, return it unchanged.
- Return ONLY valid JSON. No markdown, no explanation outside the JSON.`;

export interface SpecValidationResult {
  spec: object;
  changes: string[];
}

export async function validateAndFixSpec(
  detailedPrompt: string,
  spec: object
): Promise<SpecValidationResult> {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const userMessage =
      "DETAILED PROMPT:\n" +
      detailedPrompt +
      "\n\n---\n\nGENERATED SPEC JSON:\n" +
      JSON.stringify(spec, null, 2);

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: VALIDATOR_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    const raw = response.choices[0].message.content ?? "";
    const parsed = JSON.parse(raw) as { spec?: object; changes?: string[] };

    if (!parsed.spec || typeof parsed.spec !== "object") {
      console.warn("[specValidator] LLM returned invalid structure — using original spec");
      return { spec, changes: [] };
    }

    // Sanity check: the returned spec must still have required fields
    const s = parsed.spec as Record<string, unknown>;
    if (!s.scene || !s.objects || !s.timeline || !s.duration) {
      console.warn("[specValidator] Returned spec missing required fields — using original spec");
      return { spec, changes: [] };
    }

    // Validate: every timeline entry must have target and valid time
    if (Array.isArray(s.timeline)) {
      const timelineValid = (s.timeline as unknown[]).every((entry: unknown) => {
        const e = entry as Record<string, unknown>;
        return (
          typeof e.target === "string" &&
          Array.isArray(e.time) &&
          (e.time as number[]).length === 2 &&
          (e.time as number[])[0] < (e.time as number[])[1]
        );
      });

      if (!timelineValid) {
        console.warn("[specValidator] Polished timeline has invalid entries — using original spec");
        return { spec, changes: [] };
      }

      // Validate: no timeline entry exceeds duration
      const duration = s.duration as number;
      const withinBounds = (s.timeline as unknown[]).every((entry: unknown) => {
        const e = entry as Record<string, unknown>;
        const time = e.time as number[];
        return time[0] >= 0 && time[1] <= duration + 0.01;
      });

      if (!withinBounds) {
        console.warn("[specValidator] Timeline exceeds duration — using original spec");
        return { spec, changes: [] };
      }
    }

    const changes = Array.isArray(parsed.changes) ? parsed.changes : [];
    if (changes.length > 0) {
      console.log("[specValidator] Applied " + changes.length + " fix(es):", changes.join("; "));
    } else {
      console.log("[specValidator] Spec validated — no changes needed");
    }

    return { spec: parsed.spec, changes };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[specValidator] Failed, using original spec:", msg.slice(0, 200));
    return { spec, changes: [] };
  }
}
