# Hero Image Fix Notes

## Issue
Hero images are not visible on pages - only the dark slate-900 background shows. The hero section has:
- `relative` positioning on section
- `absolute inset-0 z-0` on image container
- `relative z-10` on content

The image exists at `/images/team-hero-bg.jpg` (41KB) but is not rendering visibly.

## Possible causes:
1. Image opacity too low (opacity-20 = 20% visible)
2. Gradient overlay too opaque
3. Image path incorrect
4. Image file corrupted or too small

## Solution:
- Increase image opacity from `opacity-20` to `opacity-30` or `opacity-40`
- Adjust gradient overlay to be less opaque
