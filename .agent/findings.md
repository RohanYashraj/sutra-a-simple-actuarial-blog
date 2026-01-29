# Findings

## Project Context
- **Framework**: Next.js 16.1.1 (App Router)
- **Styling**: Tailwind CSS 3.3.0
- **Fonts**: Cormorant Garamond (Serif), Outfit (Sans)
- **Current State**: Minimalist "zinc" theme. Simple static header.
- **Goal**: Add GSAP animations, make it "stand apart".

## Typography & Spacing Optimization
- **Phase 2 (Extreme Compactness)**:
  - Reduced `line-height` from 1.6 to 1.5.
  - Reduced `margin-bottom` on paragraphs from 1rem to 0.75rem.
  - Reduced section gaps on HomePage from `gap-12` to `gap-8`.
  - Compacted Hero section: Reduced vertical padding from `min-h-[40vh]` to `min-h-[30vh]` and tightened font sizes/margins.
- **Phase 1 Optimization**:
  - Reduced `line-height` from 1.75 to 1.6.
  - Set `max-width: 68ch` for readability.
