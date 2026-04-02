# Design System Strategy: The Kinetic Vault

## 1. Overview & Creative North Star
This design system is anchored by a Creative North Star we call **"The Kinetic Vault."** It is designed to feel like a high-end, private sanctuary for elite performance—a space where the heavy, architectural permanence of "Equinox" meets the digital precision of "Apple" and the raw energy of "Nike."

We are moving away from "template-based" design. To achieve a signature visual identity, this system rejects the standard centered grid in favor of **Intentional Asymmetry**. We utilize dramatic scale shifts, overlapping editorial typography, and high-contrast tonal depth. The goal is to make every screen feel like a curated spread in a premium fitness journal rather than a utility app.

## 2. Colors: Depth & Intent
Our palette is rooted in the absence of light, using "Surface Black" to create a sense of infinite space.

*   **Primary Logic:** We lead with **Gold Primary (#F5A623)**, but it is never used flat. It should be treated as a source of light. Use the transition from `primary` (#FFC880) to `primary_container` (#F5A623) to create "Liquid Gold" gradients for CTAs and focus states.
*   **The "No-Line" Rule:** Standard 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined through **Background Color Shifts**. For example, a section using `surface_container_low` (#1C1B1B) should sit directly against the `surface` (#131313) background to create a subtle, sophisticated edge.
*   **Surface Hierarchy & Nesting:** Treat the UI as a series of physical layers. 
    *   Use `surface_container_lowest` (#0E0E0E) for the deepest background layers (the "Vault").
    *   Use `surface_container_highest` (#353534) for foreground elements that need to pop.
*   **Glass & Gradient Rule:** For all floating interactive elements, use **Glassmorphism**. Apply a backdrop-blur (15px-30px) to a container filled with a semi-transparent `surface_variant` (#353534 at 60% opacity). This allows the "glow" of background photography to bleed through, creating a premium, integrated feel.

## 3. Typography: The Editorial Voice
Our typography is a hierarchy of power. We use three distinct voices to guide the user’s journey.

*   **Display & Hero (Bebas Neue):** Map this to the `display-lg` and `display-md` scales. This is our "Pillar" font. It must always be **Uppercase** with a slight tracking increase (0.05em). Use it for high-impact motivation and large hero headers.
*   **Headlines (Oswald):** Map this to the `headline` scales. Oswald provides a technical, authoritative tone for section titles. It bridges the gap between the raw power of Bebas and the utility of Inter.
*   **Body & Labels (Inter):** Map this to `body-md` and `label-sm`. Inter is our "Utility" font. It must remain clean and highly legible. Use `on_surface_variant` (#D7C3AE) for secondary body text to maintain a warm, golden-grey tonal harmony.

## 4. Elevation & Depth: Tonal Layering
In this design system, depth is not a shadow—it is a light state.

*   **The Layering Principle:** Achieve lift by stacking surface tiers. A card using `surface_container_high` (#2A2A2A) placed on a `surface` (#131313) background provides enough natural contrast to eliminate the need for harsh shadows.
*   **Ambient Shadows:** If an element must float (e.g., a modal), use an **Extra-Diffused Shadow**. Use the `spacing.20` value for blur and set the color to a 10% opacity version of `surface_container_lowest`. It should feel like an ambient occlusion, not a "drop shadow."
*   **The "Ghost Border" Accent:** While structural borders are forbidden, we utilize a "Signature Edge" for luxury. Use a 1px border on `xl` (12px) radius cards using the `outline_variant` (#524534) at 40% opacity. This creates a "glint" effect reminiscent of machined metal.
*   **Signature Texture:** Apply a 3% opacity noise/grain texture overlay across the entire `background` layer. This breaks the "digital flatness" and introduces a tactile, filmic quality.

## 5. Components: Elite Utility

### Buttons (The Kinetic Trigger)
*   **Primary:** A "Golden Glow" variant. Use a linear gradient (`primary` to `primary_container`). Apply a drop-shadow glow using the `primary` color at 20% opacity. 
*   **Secondary:** Ghost style. No fill, `xl` (12px) radius, with a `px` width border using the `outline` token.
*   **States:** On hover, the golden glow should expand (increase shadow spread) to mimic a light source getting brighter.

### Glass Cards (The Display Case)
*   **Styling:** Radius set to `xl` (12px). Fill is `surface_container` at 70% opacity with a `backdrop-blur`. 
*   **Constraint:** Forbid the use of divider lines within cards. Separate content using `spacing.4` (1.4rem) of vertical white space or a subtle `surface_bright` (#3A3939) sub-container.

### Inputs & Selection
*   **Fields:** Background should be `surface_container_lowest`. On focus, the border transitions to a 1px `primary` (Gold) glint.
*   **Chips:** Selection chips use `surface_container_highest` for unselected and a full `primary` fill for selected states. No rounded-full; use `md` (0.375rem) for a more architectural, "Nike-tech" feel.

### Specialized Components
*   **Performance Progress Bar:** Use a `surface_container_highest` track with a `primary` to `tertiary` (#F6CF00) gradient fill to indicate intensity.
*   **The "Vigor" Overlay:** A partial transparent overlay of Bebas Neue text (at 5% opacity) that sits behind photography, creating an editorial, layered depth.

## 6. Do's and Don'ts

*   **DO:** Use intentional white space. If a section feels crowded, jump two levels up the `spacing` scale (e.g., from `spacing.8` to `spacing.12`).
*   **DO:** Use high-contrast photography (deep blacks, bright highlights).
*   **DON'T:** Use pure white (#FFFFFF). Always use `on_surface` (#E5E2E1) or `primary_fixed` (#FFDDB4) for text to maintain the luxury warmth.
*   **DON'T:** Use standard "Material" shadows. If you can't see the depth through color shifts, your layout isn't layered enough.
*   **DO:** Align text to a rigorous grid but allow images and decorative typography to break the margins for an editorial feel.