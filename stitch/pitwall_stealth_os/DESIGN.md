# Design System Strategy: The Stealth Engineering Aesthetic

## 1. Overview & Creative North Star: "The Digital Telemetry"
This design system is built to transform complex F1 data into split-second executive decisions. The Creative North Star is **The Digital Telemetry**—an aesthetic that prioritizes high-velocity data density with the refined, aggressive minimalism of a carbon-fiber cockpit. 

We break the "standard SaaS" template by rejecting generic white-space and soft rounded corners. Instead, we utilize **Intentional Asymmetry** and **Tonal Depth**. The UI should feel like a heads-up display (HUD) projected onto a matte obsidian surface: lethal, precise, and devoid of non-functional decoration.

## 2. Colors & Surface Logic
The palette is rooted in the `surface_dim` (#131315), moving away from pure black to allow for a sophisticated play of shadows and light.

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for layout sectioning. Hierarchy must be established through **Background Shifting**. To separate a sidebar from a main feed, transition from `surface` to `surface_container_low`. Use the `surface_container` tiers to create a logical "nesting" of information without cluttering the user’s cognitive load with lines.

### Surface Hierarchy & Nesting
*   **Base Layer:** `surface_dim` (#131315) – The track.
*   **Primary Containers:** `surface_container_low` (#1c1b1e) – The pit wall consoles.
*   **Active Elements:** `surface_container_high` (#2a2a2c) – Live telemetry widgets.
*   **Floating/Critical Overlays:** `surface_bright` (#39393b) – Pop-over strategy adjustments.

### The "Glass & Gradient" Rule
To achieve the "Stealth" look, use `surface_container_highest` at 60% opacity with a `12px` backdrop blur for all modal and dropdown elements. Main Action CTAs (Action Red) should utilize a subtle linear gradient from `primary` to `on_primary_container` (e.g., #ffb4a8 to #ee190b) at a 45-degree angle to simulate the sheen of high-performance automotive paint.

## 3. Typography: The Precision Scale
We employ a dual-type system to distinguish between "System Interface" and "Live Data."

*   **UI Labels & Navigation (Inter):** Used for human-centric interaction. `body-md` and `label-sm` provide a clean, neutral voice that stays out of the way of the data.
*   **Data & Terminal (JetBrains Mono):** Used for lap times, tire degradation percentages, and AI logic streams. The monospaced nature ensures that columns of numbers align perfectly, allowing the eye to scan for deltas vertically without friction.
*   **Headline Scale:** We use `spaceGrotesk` for `display` and `headline` levels. This adds a "high-octane" editorial feel, with its wider apertures and technical curves suggesting engineering precision.

## 4. Elevation & Depth: Tonal Layering
In this system, depth is a function of light, not physics.

*   **The Layering Principle:** Place a `surface_container_lowest` (#0e0e10) card within a `surface_container` (#201f22) region to create an "inset" look, appearing as if a screen is recessed into a dashboard.
*   **Ambient Shadows:** Floating elements (like the 'Pit Strategy' modal) use a signature shadow: `0 0 20px rgba(225, 6, 0, 0.1)`. This is not a "drop shadow" but a "glow shadow," suggesting the heat and energy of the Action Red palette.
*   **The Ghost Border Fallback:** If a boundary is required for accessibility on a complex chart, use a `1px` stroke of `outline_variant` at **15% opacity**. It should be felt, not seen.

## 5. Components & Primitive Styling

### Buttons (The "Actuators")
*   **Primary:** Background: `on_primary_container` (#ee190b); Typography: `title-sm` (Inter Bold); Radius: `sm` (0.125rem) for a sharp, technical finish.
*   **Secondary (Active Systems):** Background: Transparent; Border: `1px` `secondary` (#c7fff0); Text: `secondary`.
*   **Tertiary:** `surface_container_highest` with no border.

### Chips & Status Indicators
*   **Telemetry Chips:** Use `secondary_container` (#00f2d1) with `on_secondary` (#00382f) text for "Active" states. These should use `JetBrains Mono` at `label-md` size.
*   **Alert Chips:** Use `error_container` (#93000a) with a pulsing animation for critical engine failures or safety cars.

### Input Fields & Data Entry
*   **Base State:** `surface_container_lowest` background, no border, `0.9rem` (spacing 4) padding.
*   **Focus State:** A `1px` "Ghost Border" using `secondary` (#c7fff0) at 40% opacity. 
*   **Data Inputs:** Always use `JetBrains Mono` for numeric input to ensure alignment with the rest of the strategy OS.

### Forbid the Divider
Standard horizontal rules (`<hr>`) are banned. To separate list items in a "Driver Standings" view, use a `0.4rem` (spacing 2) vertical gap and a subtle background shift on hover to `surface_container_high`.

### Specialized Component: The "Strategy Heatmap"
A custom container using a gradient background of `surface_dim` to `surface_container_low`. Data points are rendered as `Data Mint` dots with a `4px` blur to simulate a thermal camera.

## 6. Do's and Don'ts

### Do:
*   **Maintain Asymmetry:** Align primary navigation to the left, but keep telemetry widgets floating and varied in width to avoid a "bootstrap" look.
*   **Use Data Mint for Success:** Only use `#00F5D4` for active, healthy systems. 
*   **Respect the Blur:** Ensure `12px` backdrop-blur is applied to every glass layer to maintain legibility against the complex data underneath.

### Don't:
*   **Don't Use Large Radius:** Never exceed the `lg` (0.5rem) roundedness scale. This OS should feel like a piece of machined hardware, not a consumer social app.
*   **Don't Use Pure White:** High-contrast white (#FFFFFF) is too jarring against Matte Obsidian. Use `on_surface_variant` (#c8c5cb) for a muted, pro-grade feel.
*   **Don't Over-Glow:** Red shadows are for critical "floating" elements only. Overusing them will make the UI look like a "gamer" aesthetic rather than a "Professional OS."