# AstroLLM Website

A single-page placeholder website for AstroLLM — a domain-specialized LLM for Astronomy & Astrophysics.

**URL**: astrollm.org (DNS pointed to GitHub Pages)
**Repo**: `astrollm-site` locally, `astrollm.github.io` on GitHub (under the `astrollm` org)
**Framework**: Astro
**Hosting**: GitHub Pages (static, free)
**Status**: Pre-launch placeholder — the model is in development, this site announces the project

---

## Design Direction

### Aesthetic: "Academic Observatory at Night"

The visual language bridges two inspirations:
- **Oratomic.com** — dark, minimal, grainy texture, subtle scroll animations, single-page gravity
- **AMI Labs (amilabs.xyz)** — academic research seriousness, restrained typography, intellectual clarity

The result should feel like a research institution's announcement — not a startup landing page and not a developer portfolio. It should feel like standing in an observatory control room: dark, purposeful, precise, with the faintest glow of instruments.

**Key principles:**
- Dark background with warm undertones (not cold/clinical black)
- Generous whitespace — let sections breathe
- Grainy/noise texture overlay (very subtle, 3-5% opacity)
- Minimal animation: fade-in on scroll, gentle parallax on hero, NO bouncing/spinning/flashy effects
- Typography does the heavy lifting — large, confident, well-spaced
- Accent color used sparingly, like starlight — not splashed everywhere
- No stock imagery. Use abstract SVG patterns, subtle constellation/grid lines, or pure typography
- No gradients except very subtle ones in the hero or section transitions

### Color Palette

```css
:root {
  /* Backgrounds */
  --bg-primary: #0E0E12;        /* Deep charcoal with slight blue undertone — night sky */
  --bg-surface: #16161C;        /* Elevated surface — cards, sections */
  --bg-elevated: #1E1E26;       /* Hover states, interactive elements */

  /* Text */
  --text-primary: #E8E5DF;      /* Warm off-white — like aged paper under moonlight */
  --text-secondary: #9A978F;    /* Muted — descriptions, secondary info */
  --text-tertiary: #5E5C57;     /* Very muted — labels, fine print */

  /* Accents */
  --accent-blue: #7B93C4;       /* Muted celestial blue — twilight, scholarly */
  --accent-amber: #C9A76C;      /* Warm amber/gold — starlight, used very sparingly */
  --accent-blue-dim: #4A5A7A;   /* Dimmer blue for borders and subtle elements */

  /* Borders */
  --border-subtle: #2A2A32;     /* Barely visible section dividers */
  --border-hover: #3A3A44;      /* Hover state borders */
}
```

**Usage rules:**
- `--accent-blue` is the primary accent: links, active states, highlighted text
- `--accent-amber` is used for maximum 2-3 elements on the entire page: the main CTA, a badge, or a single highlighted word. It's the "star" in the sky — rare and bright.
- Cards and sections use `--bg-surface` with `--border-subtle` borders — never thick borders
- No colored backgrounds for sections. Use spacing and typography hierarchy instead.

### Typography

Use Google Fonts loaded via Astro:

**Three fonts** (display + body + mono):

1. **Cormorant Garamond** (display) — weights 400, 500, 600 (regular + italic for 400)
   - Used for headings, section labels, and the hero wordmark
   - High-contrast display serif — elegant at large sizes
   - `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap`
2. **Source Serif 4** (body) — weights 400, 500 (regular + italic for 400)
   - Used for all body/prose text, descriptions, and secondary content
   - Thicker strokes than Cormorant — readable on dark backgrounds at body sizes
   - Optical size axis (`opsz`) auto-thickens at small sizes for legibility
   - `https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;1,8..60,400&display=swap`
3. **IBM Plex Mono** — weights 400, 500
   - `https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap`

Preload Cormorant Garamond 600 and Source Serif 4 400 (most used weights). Lazy-load IBM Plex Mono.

- **Display / Headings**: `"Cormorant Garamond"` — scholarly, elegant, strong academic identity
  - Hero headline: 56-72px, font-weight 600, letter-spacing: -0.02em
  - Section headings: 36-44px, font-weight 600
  - Sub-headings: 22-28px, font-weight 500
- **Body / Prose**: `"Source Serif 4"` — sturdy text serif optimized for screen reading
  - Body: 19px, font-weight 400, line-height 1.75
  - Descriptions and secondary text: 17-18px, font-weight 400
  - Designed to pair with display serifs — creates clear hierarchy
- **Labels / UI elements**: `"Cormorant Garamond"` at 14px, font-weight 600, letter-spacing 0.08em, uppercase
  - Section labels ("VISION", "MODELS", "DATA") use this treatment
- **Mono / Technical**: `"IBM Plex Mono"` — 15px, for model sizes, parameter counts, database stats, code references
  - Used for things like "7-8B", "Q4_K_M", "pgvector", "#0E0E12"
  - Color: `--accent-blue` or `--text-secondary` depending on context

**Typography hierarchy example:**
```
VISION                         ← 14px, Cormorant Garamond 600, uppercase, letter-spaced, --text-tertiary
Not a benchmark model.         ← 40px, Cormorant Garamond 600, --text-primary
A knowledge system.
                               
Supporting paragraph text      ← 19px, Source Serif 4 400, --text-secondary, line-height 1.75
that explains the vision in
a warm, readable voice.

15M+ papers                    ← 15px, IBM Plex Mono 400, --accent-blue (technical stats)
```

**Key rule**: Display headings use Cormorant Garamond for elegance. Body text uses Source Serif 4
for readability on dark backgrounds. Mono font for technical details. The display-vs-text serif
split creates natural hierarchy while keeping a cohesive scholarly feel.

### Texture & Atmosphere

**Grain overlay:**
Apply a subtle noise/grain texture over the entire page using CSS:
```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,..."); /* inline SVG noise pattern */
  /* Or use a tiny repeating noise PNG */
}
```
The grain should be barely perceptible — you notice it subconsciously, not consciously. 3-5% opacity max.

**Subtle decorative elements (optional, pick 1-2):**
- Very faint grid lines in the background (like graph paper at 2% opacity)
- A single thin horizontal line that spans the full viewport width between major sections
- Small dot/star scatter SVG in the hero area (not a literal star field — abstract dots)
- Thin geometric lines suggesting constellation patterns (very abstract, very faint)

### Animation

**Scroll-triggered fade-ins:**
- Each section fades in and translates up ~20px as it enters the viewport
- Use CSS `@keyframes` + Intersection Observer, or Astro's built-in `client:visible`
- Stagger child elements within a section by 100-150ms
- Duration: 600-800ms, easing: `cubic-bezier(0.25, 0.1, 0.25, 1)`

**Hero-specific:**
- Title text can have a gentle fade-in on load (no scroll needed)
- Optional: very subtle parallax on the hero background element (if any decorative SVG)

**What NOT to animate:**
- No hover animations on text
- No spinning loaders or pulsing dots
- No scroll-jacking or parallax that fights the user
- No particle effects or WebGL — this is an academic site

---

## Page Structure (Single Page, Scroll Sections)

### Section 1: Hero

**Layout**: Full viewport height, centered content

**Content:**
```
AstroLLM                                          ← Logo/wordmark, large
                                                   
A domain-specialized language model                ← Tagline, 22-24px, --text-secondary
for astronomy and astrophysics

15M+ papers  ·  20.5M objects  ·  5,700+ planets   ← Metric badges (IBM Plex Mono, --accent-blue)

[GitHub] [Follow updates]                          ← Two subtle links/buttons
```

**Design notes:**
- The wordmark "AstroLLM" is pure text, not a logo image (for now). Style the "LLM" portion in `--accent-blue` — subtle brand signal
- Tagline is one line, centered, understated, Cormorant Garamond 400
- **Metric badges** (inspired by PrismML's "14× less memory" pills): a row of three key numbers in IBM Plex Mono, separated by centered dots or thin vertical lines. These ground the project in real scale immediately. Displayed as inline text or very minimal pills with `--bg-surface` background.
- Below metrics, a one-sentence vision statement in `--text-secondary`, italic Cormorant Garamond 300
- Two minimal buttons/links: GitHub org link + a way to follow (Twitter/X, email, or GitHub watch). Buttons should be understated: text links with subtle underline or very thin-bordered pills
- Optional: a faint decorative element behind the text (abstract dot scatter suggesting a star field at very low opacity, or thin geometric lines)
- Scroll indicator at the bottom (a thin line or small chevron, very subtle, animated with gentle bounce)

### Section 2: Vision

**Label**: `VISION`
**Headline**: "Not a benchmark model. A knowledge system."

**Content** (from master plan, condensed):
> AstroLLM is building an open intelligence layer for astronomy — connecting the world's 
> astronomical literature, databases, and observations through specialized language models 
> that can retrieve, reason, cite, and teach.
>
> Existing astronomy LLMs optimize for benchmark scores. AstroLLM optimizes for the 
> workflows researchers actually use: finding papers, resolving objects, explaining evidence, 
> and teaching at the right level.

**Layout**: Left-aligned text block, max-width ~640px, generous padding

**3 key differentiators as a minimal feature list (NOT cards — just text with accent markers):**
- **Retrieval-grounded** — Every answer cites real papers from NASA ADS
- **Tool-integrated** — Queries SIMBAD, Exoplanet Archive, and astronomical databases live
- **Openly built** — Models, data, evaluation, and training pipeline are all open source

### Section 3: Architecture

**Label**: `HOW IT WORKS`
**Headline**: "Retrieve. Reason. Cite."

**Content**: A simplified version of the three-stage retrieval pipeline, presented as a clean vertical flow (not a complex diagram):

```
Query                    "What do we know about TRAPPIST-1e's atmosphere?"
  ↓
Retrieve                 Search 15M+ papers via NASA ADS
                         Resolve objects via SIMBAD (20.5M astronomical objects)
                         Cross-reference with NASA Exoplanet Archive
  ↓
Reason                   Fine-tuned astronomy model interprets evidence
                         Adapts explanation depth to your level
  ↓
Cite                     Every claim linked to source papers
                         ADS bibcodes trace back to the literature
```

**Design**: This should feel like a vertical timeline or process flow. Use thin lines connecting steps. Each step has a title in `--accent-blue` and a brief description. Keep it visually simple — NOT a complex architecture diagram.

### Section 4: Model Family

**Label**: `MODELS`
**Headline**: "From phone to cluster"

**Content**: The four-tier model family, presented as expandable cards (inspired by PrismML's
Bonsai model sections — each model has a title row with key stat, expandable to show details):

**Desktop**: Horizontal row of four slim cards
**Mobile**: Vertical stack

Each card shows:
```
┌─────────────────────────┐
│  Nano                   │
│  1-3B parameters        │  ← Title + key spec visible
│  ·····················  │
│  Runs everywhere        │  ← Expanded content (visible on hover/click)
│  2-4 GB RAM             │
│  Phone, laptop, RPi     │
└─────────────────────────┘
```

**Design notes:**
- **Core is visually highlighted**: border in `--accent-amber`, or a small "Building now" badge
  in IBM Plex Mono with `--accent-amber` color. This is the ONE amber accent in this section.
- Other tiers use `--border-subtle` and dimmer text (`--text-tertiary` for descriptions)
- Cards use `--bg-surface` background with subtle border
- On hover, cards lift slightly (translateY -2px) and border brightens to `--border-hover`
- Parameter counts ("1-3B", "7-8B") in IBM Plex Mono, `--accent-blue`
- The cards should feel like PrismML's model sections: clean, information-dense but not cluttered
- Optional: a thin connecting line between cards suggesting the distillation cascade

### Section 5: Data Sources

**Label**: `DATA`
**Headline**: "Built on the open astronomy ecosystem"

**"Built on" credibility bar** (inspired by PrismML's "Supported by" logo row):
A clean horizontal row of the major database names, styled in `--text-secondary` with subtle
spacing. These are recognizable institutions in the astronomy community and lend immediate credibility:

```
Built on:    NASA ADS  ·  SIMBAD  ·  NASA Exoplanet Archive  ·  NED  ·  PDS  ·  Gaia
```

Style: IBM Plex Mono, 13-14px, `--text-secondary`, separated by centered dots.
This row can also appear near the hero or at the bottom of the Vision section as a
secondary credibility signal — like PrismML places their "Supported by" logos mid-page.

**Detailed list below the bar** (the fuller description of each source):

```
NASA ADS              15M+ publications, citation graphs, co-readership
SIMBAD                20.5M astronomical objects, cross-identifications
Exoplanet Archive     5,700+ confirmed planets with full parameters
NED                   Extragalactic objects, galaxies, quasars, AGN
PDS                   NASA planetary mission data archives
Gaia                  1.7B stars with positions and distances
```

**Design**: Present as a minimal list with the database name in `--text-primary` (Cormorant Garamond 500)
and the description in `--text-secondary` (Cormorant Garamond 300). Each on its own line with generous
line-height. Like a bibliography or reference list — fitting the academic aesthetic.

Numbers/stats within descriptions can use IBM Plex Mono in `--accent-blue` for visual distinction.

**Below the list**, one line in italic:
> All data sources are free, open access, and publicly funded. AstroLLM stands on the shoulders of decades of open astronomical infrastructure.

### Section 6: Roadmap

**Label**: `ROADMAP`
**Headline**: "Building in the open"

**Content**: The four phases from the master plan, presented as a horizontal timeline or vertical milestone list:

```
Phase 1 (Now)        Retrieval-grounded copilot
                     ADS + SIMBAD + citations + first fine-tune

Phase 2              Expanded tools + serious model
                     NED, PDS, Gaia integration + DPO alignment

Phase 3              Scientific tool ecosystem
                     Model family + continuous learning + API

Phase 4+             Multimodal knowledge house
                     Spectra, images, light curves + AION-1 bridge
```

**Design**: 
- Phase 1 gets the `--accent-amber` treatment (active/current)
- Other phases are progressively dimmer
- Each phase has a short title and a one-line description
- Optional: thin connecting line between phases (vertical or horizontal)

### Section 7: Open Source & Follow

**Label**: `OPEN SOURCE`
**Headline**: "Follow the build"

**Content**:
> AstroLLM is built in the open. Models, training data, evaluation benchmarks, 
> and the complete training pipeline will be published as they're developed.

**Links** (presented as a clean row of minimal link items):
- GitHub: github.com/astrollm
- HuggingFace: huggingface.co/astrollm (when ready)
- Domain: astrollm.org

### Section 8: Footer

Minimal footer:
```
AstroLLM — Open-source astronomy intelligence
Built by Nandan | 2026
```

---

## Technical Implementation

### Astro Project Structure

```
astrollm-site/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.svg           # Simple "A" or star glyph
│   ├── og-image.png          # Social sharing image (1200x630)
│   └── noise.png             # Tiny grain texture tile (~200x200px)
├── src/
│   ├── layouts/
│   │   └── Layout.astro      # Base layout with head, fonts, grain overlay
│   ├── pages/
│   │   └── index.astro       # Single page, imports all sections
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── Vision.astro
│   │   ├── Architecture.astro
│   │   ├── Models.astro
│   │   ├── DataSources.astro
│   │   ├── Roadmap.astro
│   │   ├── OpenSource.astro
│   │   ├── Footer.astro
│   │   └── FadeIn.astro      # Reusable scroll-triggered fade-in wrapper
│   └── styles/
│       └── global.css        # Colors, typography, grain, base styles
├── .claude/
│   └── docs/
│       ├── astrollm-master-plan.md
│       ├── astrollm-v1-final-plan.md
│       ├── astrollm-architecture-v2.md
│       ├── astrollm-project-plan.md
│       └── astrollm-data-sources.md
└── .github/
    └── workflows/
        └── deploy.yml        # GitHub Actions for Pages deployment
```

### Astro Configuration

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://astrollm.org',  // Or https://astrollm.github.io if no custom domain yet
  output: 'static',
  build: {
    assets: '_assets'
  }
});
```

### GitHub Pages Deployment

Use GitHub Actions workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### Package Manager

Use **Bun** for the website — fast installs, native TypeScript support, and
consistent with the main AstroLLM project. GitHub Actions supports Bun via
`oven-sh/setup-bun`.

### SEO & Meta

```html
<title>AstroLLM — Domain-specialized LLM for Astronomy & Astrophysics</title>
<meta name="description" content="An open-source, retrieval-grounded language model for astronomy research, education, and discovery. Built on NASA ADS, SIMBAD, and the open astronomy ecosystem." />
<meta property="og:title" content="AstroLLM" />
<meta property="og:description" content="A domain-specialized language model for astronomy and astrophysics" />
<meta property="og:image" content="/og-image.png" />
<meta property="og:url" content="https://astrollm.org" />
<meta name="twitter:card" content="summary_large_image" />
```

### Performance

- Zero JavaScript frameworks in the client bundle (Astro's strength)
- Fonts: preload the display font, lazy-load the mono font
- Grain texture: tiny PNG tile (~2KB) repeated via CSS, not a large image
- No images in the initial placeholder — pure CSS + SVG + typography
- Total page weight target: under 100KB (excluding fonts)

---

## Content Source

All content for this website should be derived from the documents in `.claude/docs/`:
- Vision and taglines → from `astrollm-master-plan.md`
- Architecture details → from `astrollm-architecture-v2.md`
- Model family → from `astrollm-architecture-v2.md` and `astrollm-v1-final-plan.md`
- Data sources → from `astrollm-data-sources.md`
- Roadmap → from `astrollm-master-plan.md`

Keep all website copy concise. The documents are comprehensive references;
the website should be the elevator pitch, not the full paper.

---

## Future Additions (Not in v1 of the site)

- Blog/announcements section (Astro content collections)
- Interactive demo (when the model is ready)
- Benchmark results page
- Documentation section
- API reference
- Community/contributors page

These will be added as the project progresses. The site architecture should
make adding pages easy (Astro's file-based routing handles this naturally).

---

## Design Reference Summary

| Aspect | Inspiration | Adaptation for AstroLLM |
|--------|------------|------------------------|
| Overall darkness and grain | Oratomic | Same approach, slightly warmer tone |
| Academic text-heavy layout | AMI Labs | Similar restraint, full serif typography |
| Typographic unity (one family) | AMI Labs + Oratomic | Cormorant Garamond throughout |
| Metric badges in hero | PrismML | "15M+ papers · 20.5M objects · 5,700+ planets" |
| "Built on" credibility bar | PrismML ("Supported by") | Database names row: NASA ADS, SIMBAD, etc. |
| Model cards with key stats | PrismML (Bonsai sections) | Four-tier cards, Core highlighted with amber |
| Single-page scroll | Oratomic + AMI | Sections separated by generous whitespace |
| Animation | Oratomic | Fade-in on scroll only, no complex effects |
| Color restraint | All three | Dark + one blue accent + one amber "star" accent |
| Card hover micro-interaction | PrismML | Subtle lift + border brighten on model cards |