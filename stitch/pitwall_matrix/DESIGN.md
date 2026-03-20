# Design System Strategy: PitWall AI Tactical Interface

## 1. Overview & Creative North Star: "The Kinetic Command"
The Creative North Star for this design system is **"The Kinetic Command."** We are not building a consumer app; we are building a high-stakes, mission-critical tactical environment. It sits at the intersection of a futuristic F1 strategy room and a high-frequency trading terminal. 

To move beyond a "generic dark mode" template, the system utilizes **Intentional Asymmetry** and **Tonal Depth**. We reject the "boxed" layout in favor of a modular, data-dense HUD (Heads-Up Display) feeling. Layouts should feel like they are "projected" rather than "printed," using high-contrast typography scales and overlapping telemetry modules to create a sense of urgency and technical precision.

---

## 2. Colors & Surface Architecture
The palette is rooted in `Carbon Black (#0D0405)`, but its depth is achieved through the sophisticated layering of the following tokens.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. Structural boundaries must be defined solely through background shifts. For example, a telemetry widget (using `surface_container_low`) sits directly on the `background` without a stroke. The contrast in value is the only separator allowed.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical, carbon-fiber layers. Use the `surface_container` tiers to create "nested" depth:
- **Base Layer:** `surface` (#1c1012) – The cockpit floor.
- **Sectioning:** `surface_container_low` (#25181a) – Large regional blocks.
- **Interactive Widgets:** `surface_container_high` (#352628) – Active data modules.
- **System Overlays:** `surface_container_highest` (#403133) – Modals and pop-overs.

### The "Glass & Gradient" Rule
To achieve the "Cyberpunk-Professional" look, use **Glassmorphism** for floating telemetry panels. 
- Apply `surface_variant` at 60% opacity with a `20px` backdrop blur.
- **Signature Texture:** Primary CTAs must use a subtle linear gradient from `primary` (#ffb4aa) to `primary_container` (#ae2c23) at a 135-degree angle. This mimics the directional sheen of high-end automotive paint.

---

## 3. Typography: Technical Precision
The type system balances the human readability of `Inter` with the machine-logic of `JetBrains Mono` (Space Grotesk in our display tokens).

- **The Narrative (Sans-Serif):** Use `Inter` for titles and body text. It provides a clean, neutral "Command" voice.
- **The Telemetry (Monospace):** Use `JetBrains Mono` for all data points, chat logs, and timestamps. Monospaced type communicates that the information is being pulled in real-time from a raw data stream.
- **Scale Contrast:** Leverage the `display-lg` (3.5rem) for critical lap times or race positions, set against `label-sm` (0.6875rem) for technical metadata. This massive delta in scale creates the "Bloomberg" professional density.

---

## 4. Elevation & Depth: Tonal Layering
We do not use standard material shadows. Depth is an atmospheric effect, not a lighting effect.

- **The Layering Principle:** Instead of a shadow, place a `surface_container_lowest` (#170b0c) element inside a `surface_container` (#2a1c1e) to create an "inset" technical look.
- **Ambient Glows:** When a panel requires "lift," use a shadow tinted with `primary` (#ffb4aa) at 5% opacity with a 40px blur. This creates a "CRT Glow" rather than a drop shadow.
- **The "Ghost Border" Fallback:** If a separator is required for accessibility, use the `outline_variant` token at 15% opacity. Never use 100% opaque lines; they break the immersion of the technical HUD.

---

## 5. Components

### Terminal-Style Inputs
- **Base:** No background. Use a `surface_container_highest` bottom-border only (2px).
- **Active State:** The bottom border shifts to `secondary` (Telemetry Green), accompanied by a subtle `primary` glow.
- **Font:** Always `JetBrains Mono` for input text to maintain the "Command Line" aesthetic.

### Data Widgets (Modular)
- **Structure:** Modular blocks with 0px border-radius (`roundedness: none`).
- **Header:** Use `label-md` in `on_surface_variant` for small, all-caps category headers (e.g., "TYRE DEGRADATION").
- **Visuals:** Forbid divider lines. Use `0.9rem` (spacing 4) vertical gaps to separate data rows.

### Status Indicators & Alerts
- **Success/Data:** `secondary` (#b9d164). Use for "In-Window" or "Green Sector."
- **Alert/Danger:** `primary_container` (#ae2c23). Use for "Pit Entry" or "Collision."
- **Glitch Effect:** On critical alerts, apply a 1px horizontal offset to the text layer in `tertiary` (#92cdfa) at 30% opacity to mimic signal interference.

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`). Sharp corners (0px).
- **Secondary:** Ghost style. No fill, `outline` border at 20% opacity. Text in `primary_fixed`.
- **Tertiary:** Text only, all-caps, `JetBrains Mono`.

---

## 6. Do's and Don'ts

### Do:
- **Embrace Density:** F1 engineers need data. Use the `spacing-1` and `spacing-2` tokens to keep information tight and professional.
- **Use "SpaceGrotesk" for Impact:** Reserve `display` scales for the most vital metrics (e.g., GAP TO LEADER).
- **Layer via Color:** Use `surface_container` increments to define UI zones.

### Don't:
- **No Rounded Corners:** This design system is built on precision. `0px` is the only acceptable radius.
- **No Gray Shadows:** If you need a shadow, it must be tinted with the brand’s red or green hues.
- **No Standard Borders:** Do not use `outline` at 100% opacity to "box in" content. Let the background shifts do the work.
- **No Traditional Dividers:** Never use a horizontal rule `<hr>` to separate list items. Use a background shift from `surface_container_low` to `surface_container_highest`.