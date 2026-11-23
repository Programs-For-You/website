# Programs For You: Brand Guide

## Who we are
Programs For You makes free, simple apps that save students time. We're a small team of students. Everything is free, with no email or account needed to download. Don't name team members, schools, grades, or towns on the site unless that person has said it's OK.

## Voice
- Plain, friendly, and short. Write the way a student would explain it to a friend.
- Say what the app does and how much time or stress it saves. Avoid corporate and marketing buzzwords.
- Simple words, short sentences. No hype, no jargon.
- Call it "Programs For You" (not "PFY"). Apps: School Schedule, Email Assistant, Screen Assistant, TI-84 Evo Games.

## Look and feel
Dark, warm, calm: deep teal-black surfaces, cream text, and one bright lime accent. Rounded sheets, notched buttons, and smooth scroll-driven motion. Source of truth: `src/app.css`.

### Colors
| Token | Value | Use |
|---|---|---|
| `bg` | `#0b1110` | Page background |
| `bg-soft` | `#101918` | Alternate sections |
| `surface` | `#151f1e` | Cards |
| `surface-2` | `#1d2b29` | Raised surfaces |
| `ink` (text) | `#f1f1ec` | Body text |
| `muted` | `#a3bab6` | Secondary text |
| `accent` / `lime` | `#a7e26e` | The one accent: links, labels, tags |
| `warn` | `#f2c46d` | Warnings |
| `danger` | `#ff8f85` | Errors |

Use lime sparingly. Don't add other accent colors. Per-person avatar gradients on the team page are the exception.

App icons follow the logo: the dark teal rounded tile (#16231f → #0b1110) with the logo's two greens (#34d27b → #139a52 and #c4f08a → #7fd35a). No blue, purple, or pink.

### Type
- **Aspekta** (variable) for everything.
- **Roboto Mono**, uppercase, for labels, eyebrows, and tags.
- Tight tracking (about -0.02em) on headings. Sizes scale fluidly: `text-display`, `text-heading`, `text-subheading`, `text-title`, `text-lead`, `text-body`, `text-mono`.

### Shape and motion
- Radii: 8px, 12px, 20px (cards), 40px (sheets).
- Easing: `ease-out-expo` and `ease-in-out-quart`. Respect reduced motion.

## Ownership and legal
- Programs For You, Email Assistant and Screen Assistant are © 2026 Programs For You. All rights reserved.
- School Schedule, Email Assistant, and Screen Assistant all come in one Mac app, Programs For You (in the app, School Schedule is the School Calendar tab).
- Not affiliated with Apple Inc.
