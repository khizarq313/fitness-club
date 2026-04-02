# Design System Document: Kinetic Vault Refined

## 1. Overview & Creative North Star: "The Brutalist Sanctuary"
This design system is built on the intersection of high-performance athletics and premium editorial luxury. The Creative North Star is **"The Brutalist Sanctuary."** It rejects the soft, approachable "friendly" UI of the last decade in favor of something more authoritative, precise, and uncompromising. 

We achieve a signature look by leaning into **Aggressive Precision**. By utilizing a `border-radius: 0px` constraint across all elements, we create a sense of structural integrity. We break the "template" look through intentional asymmetry—using massive, faded watermark typography that bleeds off the canvas and high-contrast grayscale-to-color transitions that reward user interaction. This is not just a fitness app; it is a premium digital vault.

---

## 2. Colors: Tonal Depth & The Gold Standard
The palette is rooted in cold, "true" darks. We strictly prohibit "warm" grays or browns. The hierarchy is built on a foundation of `#0A0A0A` to ensure the deepest possible blacks for OLED displays.

### The "No-Line" Rule
Traditional 1px borders are strictly prohibited for sectioning. Boundaries are defined solely through background color shifts.
- **Surface Layering:** Use `surface_container_lowest` (#0E0E0E) for the global background. 
- **Sectioning:** Use `surface_container` (#201F1F) or `surface_container_high` (#2A2A2A) to define content blocks.
- **The Gold Standard:** The `primary_container` (#F5A623) is our "Gold." It must be used sparingly (less than 5% of the total UI) to highlight high-value actions or critical status indicators.

### Signature Textures
To prevent the UI from feeling "flat" or "sterile," apply a **4% Grain Texture Overlay** across the entire viewport. This adds a cinematic, film-like quality. For primary CTAs, use a subtle linear gradient from `primary` (#FFC880) to `primary_container` (#F5A623) at a 135-degree angle to provide a metallic, premium luster.

---

## 3. Typography: The Editorial Scale
We use three distinct typefaces to create a clear communicative hierarchy: Authority, Structure, and Utility.

- **Display (Bebas Neue):** Used for massive, high-impact messaging. These should often be used as "watermark" elements—low opacity (5-10%), large scale (display-lg), and occasionally rotated -90 degrees or bleeding off-screen.
- **Headlines (Oswald):** Used for section headers and card titles. Its condensed nature allows for high-density information without losing the "premium" feel.
- **Body & Labels (Inter):** Our workhorse. Inter provides the technical, Apple-esque clarity required for workout data and fine print.

| Level | Token | Font | Size | Case |
| :--- | :--- | :--- | :--- | :--- |
| Display | display-lg | Bebas Neue | 3.5rem | ALL CAPS |
| Headline | headline-lg | Oswald | 2.0rem | ALL CAPS |
| Title | title-lg | Inter | 1.375rem | Sentence |
| Body | body-md | Inter | 0.875rem | Sentence |

---

## 4. Elevation & Depth: Tonal Layering
In this design system, elevation is not about "height" but about "density." 

- **The Layering Principle:** Instead of drop shadows, stack tiers. Place a `surface_container_highest` (#353534) card on top of a `surface_container_low` (#1C1B1B) section. This creates a natural, sophisticated lift.
- **Ambient Shadows:** Shadows are a last resort. If required for a floating Modal, use a massive blur (40px+) at 8% opacity using the `surface_container_lowest` color. 
- **The Ghost Border:** If an element requires a container but a background shift is too heavy, use the `outline_variant` at **15% opacity**. This creates a "barely-there" frame that feels architectural.
- **Glassmorphism:** For top navigation bars or floating action buttons, use `surface` (#141414) at 70% opacity with a `20px backdrop-blur`.

---

## 5. Components: Sharp-Edge Architecture

### Buttons
- **Primary:** `primary_container` (#F5A623) background, `on_primary` (#452B00) text. Sharp 0px corners. Height: 56px (approx. `spacing-16`).
- **Secondary:** Ghost style. `outline` color for the border (at 20% opacity) with `on_surface` white text. 
- **State Transition:** On hover/active, the button should "glow"—add a subtle outer shadow using the `primary` color at 20% opacity.

### Cards & Lists
- **Rule:** Absolute prohibition of divider lines. 
- **Separation:** Use `spacing-8` (2.75rem) to separate list items. 
- **Image Treatment:** All card imagery must be grayscale by default. On hover/focus, the image transitions to full color over 400ms.

### Input Fields
- **Style:** Bottom-border only (2px `outline`). No 4-sided boxes.
- **Focus State:** Border color shifts to `primary` (#F5A623). Label moves from `body-md` to `label-sm` above the input.

### Signature Component: The "Vault Meter"
A custom progress visualization for fitness goals using a segmented bar. Each segment is a sharp-edged rectangle (`spacing-px` width) utilizing the `primary` gold for "achieved" and `surface_variant` for "remaining."

---

## 6. Do’s and Don’ts

### Do:
- **Do** embrace the void. Use large areas of `surface_container_lowest` to let the content breathe.
- **Do** use "Extreme Scale." Make headers much larger than you think they should be, and body text tight and controlled.
- **Do** use the Spacing Scale strictly. Every gap should be a multiple of our defined tokens (e.g., `spacing-4`, `spacing-10`).

### Don't:
- **Don't** use a border-radius. Ever. Even 1px is a violation of this system's DNA.
- **Don't** use blue, red, or green for anything other than critical semantic errors. Status should be conveyed through Gold (`primary`) or Grayscale intensity.
- **Don't** use standard transitions. Use `cubic-bezier(0.16, 1, 0.3, 1)` for all movements to create a "snappy" yet smooth high-end feel.
- **Don't** use warm blacks. If the hex code looks "brownish" or "earthy" in the shadows, it is incorrect. Stick to the provided `surface` tokens.