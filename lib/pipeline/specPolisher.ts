/**
 * Spec Motion Polisher
 *
 * Sits after specValidator in the legacy pipeline.
 * Takes a semantically correct spec and refines the timeline
 * for better motion quality: overlapping phases, stagger,
 * easing variety, and rhythmic timing.
 *
 * Uses GPT-4o for high-quality motion choreography.
 * Falls back to original spec on any failure.
 */

import OpenAI from "openai";

const POLISHER_SYSTEM_PROMPT = `You are a senior motion choreographer for animated videos. You receive a Motion Spec JSON that is semantically correct but may have bland, mechanical timing. Your job is to POLISH the timeline for professional-quality motion.

You must ONLY modify the "timeline" array. NEVER touch "scene", "duration", "fps", "canvas", "bg", or "objects".

MOTION CHOREOGRAPHY RULES:

1. OVERLAPPING PHASES
   - If animations are strictly sequential (one ends exactly when the next begins), add 0.15–0.3s overlap.
   - Example: if object A fades in [0, 1.0] and object B fades in [1.0, 2.0], shift B to start at [0.8, 1.8].
   - This creates smoother visual flow instead of jarring stop-start transitions.
   - NEVER overlap the same object's same property (that would cause conflicts).

2. STAGGER MULTI-OBJECT ENTRIES
   - If multiple objects animate at the exact same time with the same animation, add slight stagger offsets (0.05–0.15s between each).
   - Example: 3 texts all fading in at [1.0, 2.0] → text_1 [1.0, 2.0], text_2 [1.1, 2.1], text_3 [1.2, 2.2].
   - This creates a cascade/wave effect instead of everything appearing at once.

3. EASING SELECTION
   Match easing to the motion type:
   - Entrance animations (fade in, scale up, slide in): "ease-out" — fast start, gentle landing
   - Exit animations (fade out, scale down, slide out): "ease-in" — gentle start, fast exit
   - Position movements (sliding, translating): "ease-in-out" — smooth acceleration and deceleration
   - Bouncy/playful entrances: "spring" — overshoot and settle
   - Dramatic impacts (text slam, shape drop): "bounce" — bounce on arrival
   - Subtle/ambient motion (breathing, floating): "ease-in-out"
   - If the spec already has a well-chosen non-linear easing, keep it.
   - Only change "linear" easings to something better.

4. ANTICIPATION AND FOLLOW-THROUGH
   - For scale-pop animations (scale [0, 1]), consider adding a two-phase approach:
     Phase 1: scale [0, 1.08] with "ease-out" (overshoot)
     Phase 2: scale [1.08, 1] with "ease-in-out" (settle back)
   - Only do this if it fits within the available time and doesn't conflict.

5. TIMING CONSTRAINTS
   - NEVER let any timeline entry's time[1] exceed the spec "duration".
   - NEVER let any timeline entry's time[0] go below 0.
   - Keep the total animation flow within the original duration.
   - Maintain at least 0.1s for any animation phase (no zero-length animations).

6. CONSERVATIVE APPROACH
   - Make targeted improvements, not wholesale rewrites.
   - If the timeline already has good variety and overlap, make minimal changes.
   - Preserve the original creative intent — you are polishing, not redesigning.
   - If you are unsure about a change, skip it.

OUTPUT FORMAT:
Return a JSON object with exactly two keys:
{
  "timeline": [<the polished timeline array>],
  "changes": [<array of strings describing each change made, empty if none>]
}

RULES:
- Return ONLY valid JSON. No markdown, no explanation outside the JSON.
- The timeline array must have the same targets and same animated properties as the input.
- You may split a single timeline entry into two entries (for anticipation/follow-through) but never remove entries entirely.
- You may reorder entries but all original targets must still be animated.`;

export interface SpecPolishResult {
  spec: object;
  changes: string[];
}

export async function polishSpecMotion(spec: object): Promise<SpecPolishResult> {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const specData = spec as Record<string, unknown>;

    // Only polish if there's a timeline to work with
    if (!Array.isArray(specData.timeline) || specData.timeline.length === 0) {
      return { spec, changes: [] };
    }

    const userMessage =
      "MOTION SPEC JSON:\n" + JSON.stringify(spec, null, 2) +
      "\n\nPolish the timeline for better motion quality. Return the improved timeline.";

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: POLISHER_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    const raw = response.choices[0].message.content ?? "";
    const parsed = JSON.parse(raw) as { timeline?: unknown[]; changes?: string[] };

    if (!Array.isArray(parsed.timeline) || parsed.timeline.length === 0) {
      console.warn("[specPolisher] LLM returned invalid timeline — using original");
      return { spec, changes: [] };
    }

    // Validate: every entry must have target and time
    const valid = parsed.timeline.every((entry: unknown) => {
      const e = entry as Record<string, unknown>;
      return (
        typeof e.target === "string" &&
        Array.isArray(e.time) &&
        (e.time as number[]).length === 2 &&
        (e.time as number[])[0] < (e.time as number[])[1]
      );
    });

    if (!valid) {
      console.warn("[specPolisher] Polished timeline has invalid entries — using original");
      return { spec, changes: [] };
    }

    // Validate: no timeline entry exceeds duration
    const duration = specData.duration as number;
    const withinBounds = parsed.timeline.every((entry: unknown) => {
      const e = entry as Record<string, unknown>;
      const time = e.time as number[];
      return time[0] >= 0 && time[1] <= duration + 0.01;
    });

    if (!withinBounds) {
      console.warn("[specPolisher] Polished timeline exceeds duration — using original");
      return { spec, changes: [] };
    }

    // Merge polished timeline back into spec
    const polishedSpec = { ...specData, timeline: parsed.timeline };
    const changes = Array.isArray(parsed.changes) ? parsed.changes : [];

    if (changes.length > 0) {
      console.log("[specPolisher] Applied " + changes.length + " polish(es):", changes.join("; "));
    } else {
      console.log("[specPolisher] No motion changes needed");
    }

    return { spec: polishedSpec, changes };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[specPolisher] Failed, using original spec:", msg.slice(0, 200));
    return { spec, changes: [] };
  }
}
