# AgencyOS Design Direction

## Three initial stylistic approaches

### Theme Name: Editorial Brutalism
Very high-contrast, print-inspired operations UI with hard rules, oversized typography, ink-like borders, and a warm paper canvas. It makes agency work feel tangible, decisive, and fast.
**Probability:** 0.07

### Theme Name: Soft Industrial
A restrained industrial dashboard with cool grey panels, utility labels, and quiet depth. It feels dependable and systems-oriented without becoming sterile.
**Probability:** 0.03

### Theme Name: Citrus Signal
A kinetic, dark command center with sharp chartreuse accents and warning-label details. It feels urgent and campaign-driven, reserved for a more theatrical agency personality.
**Probability:** 0.08

## Selected approach: Editorial Brutalism

### Design Movement
Neo-Brutalism fused with Swiss editorial information design and early desktop publishing interfaces.

### Core Principles
1. **Visible structure:** borders, offsets, labels, and dividers show how the operation is organized.
2. **Tactile urgency:** solid fills and offset shadows make important actions feel physical and immediate.
3. **Editorial hierarchy:** oversized condensed headlines, compact metadata, and asymmetric content blocks create fast scanning.
4. **Useful friction:** controls are direct and unambiguous; no decorative glassmorphism or hidden complexity.

### Color Philosophy
A warm paper base keeps the command center human and editorial. Near-black ink provides authority; safety orange signals action and change; electric cobalt anchors active navigation; acid lime highlights on-track outcomes. The ownable brand color is **Agency Orange #FF5A36**.

### Layout Paradigm
A persistent left rail acts as a printed margin and operational index. The workspace is a staggered canvas of unequal cards: a wide command header, a slim signal strip, then two-column operational modules. Avoid a centered hero; make the dashboard feel like a live desk covered with clearly arranged working sheets.

### Signature Elements
- Offset black shadows behind primary cards and buttons.
- Small uppercase filing labels with numeric prefixes.
- Diagonal corner ticks and thick divider rules used to mark urgency and section changes.

### Interaction Philosophy
Every interactive control should communicate state through a visible shift: buttons lift or press, cards nudge on hover, tabs invert fills, and pending items get a clear signal color. Placeholder modules use a small toast rather than dead links.

### Animation
Use short 140–220ms ease-out transitions. Cards enter with a 12px upward settle and opacity shift; hover states change only transform, border, and shadow. Toasts slide in from the bottom-right. Respect prefers-reduced-motion.

### Typography System
Display: **Space Grotesk**, 700–800 for page titles and metrics. Body: **DM Sans**, 450–650 for labels and copy. Filing metadata uses Space Grotesk at 10–11px uppercase with 0.12em tracking. Headlines are tight and left-aligned, never center-stacked.

### Brand Essence
AgencyOS is the operating desk for ambitious modern agencies—built for teams turning attention into organized momentum.
**Personality:** decisive, editorial, kinetic.

### Brand Voice
Headlines are concise and operational. CTAs sound like clear next moves, not generic onboarding copy.
- “Keep the whole machine in view.”
- “Send the next approval forward.”

### Wordmark & Logo
Use a bold abstract **AO monogram** built from two interlocking rectangular strokes: one orange, one black, forming a small forward arrow at their join. The wordmark is set in a custom-spaced Space Grotesk lockup, never plain default text alone.

### Signature Brand Color
**Agency Orange #FF5A36** — a warm, high-energy orange that reads like a stamped action mark on paper.
