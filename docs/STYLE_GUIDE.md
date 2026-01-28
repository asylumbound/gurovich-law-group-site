# Gurovich Law Group — Style Guide

This document defines the visual design system for the Gurovich Law Group website. All components and pages must adhere to these specifications to maintain brand consistency.

---

## 1. Brand Identity

**Firm Name:** Gurovich Law Group  
**Tagline:** Vigorous Advocacy for Life's Most Serious Legal Challenges  
**Tone:** Professional, authoritative, trustworthy, approachable

---

## 2. Color Palette

### Primary Colors

| Token | OKLCH Value | Hex Equivalent | Usage |
|-------|-------------|----------------|-------|
| `--primary` | `oklch(0.45 0.18 25)` | #C41E3A | Primary buttons, accents, links, dividers |
| `--primary-foreground` | `oklch(0.98 0 0)` | #FFFFFF | Text on primary backgrounds |
| `--secondary` | `oklch(0.25 0.02 250)` | #1E2A38 | Top bar, dark sections, footer |
| `--secondary-foreground` | `oklch(0.98 0 0)` | #FFFFFF | Text on secondary backgrounds |

### Neutral Colors

| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `--background` | `oklch(0.99 0 0)` | Page background (off-white) |
| `--foreground` | `oklch(0.20 0.02 250)` | Primary body text (dark navy) |
| `--card` | `oklch(1 0 0)` | Card backgrounds (pure white) |
| `--muted` | `oklch(0.96 0.005 250)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.45 0.02 250)` | Secondary text, captions |
| `--border` | `oklch(0.90 0.005 250)` | Borders, dividers |

### Semantic Colors

| Token | Usage |
|-------|-------|
| `--accent` | Same as primary — accent elements |
| `--destructive` | Error states, warnings |
| `--ring` | Focus rings (matches primary) |

---

## 3. Typography

### Font Families

| Role | Font | CSS Variable | Usage |
|------|------|--------------|-------|
| Display | Playfair Display | `--font-display` | Hero headlines, large titles |
| Heading | Montserrat | `--font-heading` | Section headings, navigation, buttons |
| Body | Lato | `--font-body` | Body text, paragraphs, captions |

### Type Scale

| Element | Desktop Size | Mobile Size | Weight | Font |
|---------|--------------|-------------|--------|------|
| Hero H1 | 3.75rem (60px) | 1.875rem (30px) | Bold (700) | Display |
| Hero Subhead | 1.125rem (18px) | 0.75rem (12px) | Regular (400) | Heading |
| Section H2 | 2.25rem (36px) | 1.5rem (24px) | Bold (700) | Heading |
| Section Subhead | 0.875rem (14px) | 0.75rem (12px) | Semibold (600) | Heading |
| Body Text | 1rem (16px) | 0.875rem (14px) | Regular (400) | Body |
| Small/Caption | 0.875rem (14px) | 0.75rem (12px) | Regular (400) | Body |
| Button Text | 1rem (16px) | 0.875rem (14px) | Semibold (600) | Heading |
| Nav Links | 0.875rem (14px) | 1rem (16px) | Medium (500) | Heading |

### Letter Spacing

- Hero subheadline: `tracking-[0.18em]` (wide)
- Section labels: `tracking-widest`
- Navigation: Default
- Body text: Default

---

## 4. Spacing System

Based on Tailwind's default scale:

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 0.25rem (4px) | Tight gaps |
| `space-2` | 0.5rem (8px) | Small gaps |
| `space-3` | 0.75rem (12px) | Icon gaps |
| `space-4` | 1rem (16px) | Standard padding |
| `space-6` | 1.5rem (24px) | Section internal spacing |
| `space-8` | 2rem (32px) | Between elements |
| `space-12` | 3rem (48px) | Section padding (mobile) |
| `space-16` | 4rem (64px) | Section padding (tablet) |
| `space-20` | 5rem (80px) | Section padding (desktop) |

### Container

- Max width: 1280px
- Padding: 1rem (mobile), 1.5rem (sm), 2rem (lg)
- Auto-centered with `mx-auto`

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | 0.5rem (8px) | Default radius |
| `--radius-sm` | 0.25rem (4px) | Small elements |
| `--radius-md` | 0.375rem (6px) | Medium elements |
| `--radius-lg` | 0.5rem (8px) | Cards, buttons |
| `--radius-xl` | 0.75rem (12px) | Large cards |

---

## 6. Shadows

| Level | Class | Usage |
|-------|-------|-------|
| Subtle | `shadow-sm` | Navigation bar |
| Default | `shadow` | Cards on hover |
| Medium | `shadow-md` | Elevated cards |
| Large | `shadow-lg` | Buttons, modals |

---

## 7. Component Patterns

### Buttons

**Primary Button:**
```
bg-primary hover:bg-primary/90 text-primary-foreground
font-heading font-semibold px-6 py-3 rounded-lg shadow-lg
```

**Outline Button:**
```
border-2 border-white text-white hover:bg-white/10
font-heading font-semibold px-6 py-3 rounded-lg
```

**Secondary Button:**
```
bg-secondary hover:bg-secondary/90 text-secondary-foreground
font-heading font-semibold px-6 py-3 rounded-lg
```

### Cards

```
bg-card rounded-lg shadow-sm border border-border
hover:shadow-md transition-shadow duration-300
p-6
```

### Section Headers

```html
<div class="text-center mb-12">
  <span class="text-primary font-heading text-sm font-semibold tracking-widest uppercase">
    Section Label
  </span>
  <h2 class="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">
    Section Title
  </h2>
</div>
```

### Navigation Links

```
font-heading text-sm font-medium transition-colors
hover:text-primary
Active: text-primary
Inactive: text-foreground
```

---

## 8. Layout Patterns

### Hero Section

- 2-column CSS Grid: `grid-cols-[55%_45%]` on desktop
- Stacked on mobile
- Min height: 70vh (mobile), 80vh (desktop)
- 5-layer z-index stack (see Hero component documentation)

### Content Sections

- Alternating background colors (white / muted)
- Vertical padding: `py-12` (mobile), `py-16` (tablet), `py-20` (desktop)
- Container-constrained content

### Footer

- Dark background (`bg-secondary`)
- Multi-column grid layout
- Contact info, practice areas, quick links, social icons

---

## 9. Animation & Transitions

### Default Transition

```
transition-colors duration-300
transition-shadow duration-300
transition-all duration-300
```

### Framer Motion Patterns

**Fade In Up:**
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

**Stagger Children:**
```tsx
transition={{ duration: 0.6, delay: index * 0.1 }}
```

**Scale In:**
```tsx
initial={{ opacity: 0, scaleX: 0 }}
animate={{ opacity: 1, scaleX: 1 }}
transition={{ duration: 0.6 }}
```

---

## 10. Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Extra large |

### Key Responsive Rules

- Navigation: Hamburger menu below `lg` (1024px)
- Hero: 2-column above `md` (768px), stacked below
- Cards: Grid columns reduce at smaller breakpoints
- Typography: Scale down at mobile breakpoints

---

## 11. Accessibility

### Focus States

- All interactive elements must have visible focus rings
- Focus ring color: `--ring` (matches primary)
- Use `outline-ring/50` for subtle focus indication

### Color Contrast

- Text on dark backgrounds: White (`#FFFFFF`)
- Text on light backgrounds: Dark navy (`--foreground`)
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Logical tab order
- Skip links for main content

---

## 12. Image Guidelines

### Hero Images

- Format: PNG with transparency for overlays
- Statue: Large, prominent, anchored bottom-left
- Background: LA skyline at dusk

### Practice Area Icons

- Style: Lucide icons
- Size: `h-8 w-8` or `h-12 w-12`
- Color: Primary on light backgrounds

### Team Photos

- Aspect ratio: 1:1 (square) or 3:4 (portrait)
- Style: Professional headshots
- Treatment: Rounded corners

---

## 13. Blog-Specific Styles

### Blog Card

```
bg-card rounded-lg overflow-hidden shadow-sm border border-border
hover:shadow-md transition-shadow duration-300
```

### Blog Card Image

```
aspect-video object-cover w-full
```

### Blog Card Content

```
p-6
```

### Blog Title (Card)

```
font-heading text-xl font-bold text-foreground
hover:text-primary transition-colors
line-clamp-2
```

### Blog Excerpt

```
font-body text-muted-foreground text-sm
line-clamp-3 mt-2
```

### Blog Meta

```
font-body text-xs text-muted-foreground
flex items-center gap-2
```

### Blog Post Page

- Max width: 768px (prose width)
- Typography: Larger body text (1.125rem)
- Headings: Clear hierarchy with spacing
- Images: Full width within container

---

## 14. File Structure

```
client/
  src/
    components/
      ui/           # shadcn/ui primitives
      Header.tsx    # Global navigation
      Footer.tsx    # Global footer
      Hero.tsx      # Homepage hero
      ...
    pages/
      Home.tsx
      Blog.tsx      # Blog listing
      BlogPost.tsx  # Individual post
      ...
    index.css       # Global styles & tokens
```

---

## 15. Usage Notes

1. **Always use CSS variables** for colors, not hardcoded values
2. **Use semantic class names** from the design system
3. **Maintain consistent spacing** using the spacing scale
4. **Test at all breakpoints** before deployment
5. **Ensure accessibility** with proper contrast and focus states

---

*Last Updated: January 2026*  
*Version: 1.0*
