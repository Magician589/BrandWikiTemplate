---
title: Design-First Generation
category: frameworks
confidence: high
sources: 3
updated: 2026-05-14
---

# Design-First Generation

> WikiCreator's proprietary method: generate a design system before any markup, then express the system as a site.

Design-First Generation (DFG) is the technical and conceptual core of WikiCreator. It is the difference between the product and every competitor in the [[competitive-landscape]]. Where most AI web tools generate HTML or component code directly from a prompt, DFG inserts an intermediate step: the AI first generates a coherent design system — typography, color, spacing, motion, voice — and only then produces a site that expresses that system. The system is the artifact; the site is a view of it.

The framework is brand-load-bearing. It is the proof behind every "sites, not templates" claim, the justification for flat pricing, and the explanation for why outputs feel cohesive rather than collaged. See [[positioning]] and [[voice-guide]].

## The four stages

### 1. Brief

The user provides a short description of the business: what it does, who it serves, what tone it should hit. WikiCreator does not ask for design preferences. Asking for design preferences is a tell of a template builder. The brief is purposefully constrained — typically under 200 words.

### 2. System generation

The AI generates a design system before any layout exists:

- **Type scale.** A primary and secondary typeface, six size steps, line-height rules.
- **Color tokens.** Brand color, two supporting hues, neutrals, semantic states.
- **Spacing scale.** Eight steps following a consistent ratio.
- **Motion primitives.** Three named motion patterns the site will use.
- **Voice tokens.** A short style note: sentence length, formality, banned words.

The system is presented to the user before any page is rendered. This is the moment that earns the trust that the rest of the experience compounds.

### 3. Composition

Pages are composed by selecting from a library of section archetypes (hero, proof grid, offer slab, contact band, etc.) and rendering each with the generated design system. The library is curated, not infinite. Constraint is the feature.

### 4. Local edit

The user can edit any element with the visual editor, but edits are constrained to the design system. Changing the brand color updates every surface that uses it. Changing the type scale rescales the whole site. Users cannot break out of the system without explicitly switching to "code mode" (Studio and Agency tiers).

## Why it works

- **Coherence by construction.** A site cannot look "designed by committee" if every surface inherits from the same generated system.
- **Iteration without cost.** Changing the brief regenerates the system, which propagates across every page. No per-page rework.
- **Defensible quality bar.** Competitors generating page-by-page produce uneven output. DFG output is uniform within a site.
- **Explains the pricing.** Flat pricing is justifiable because the system is the unit of value, not the page.

## What DFG explicitly is not

- It is not a "style transfer" from existing sites. Every system is generated fresh.
- It is not a template library with AI-tuned parameters.
- It is not a wireframing tool. The output is a finished site, not a layout to be designed against.

## Internal model evolution

| Version | Shipped | Major change |
|---|---|---|
| DFG v1 | 2025-08 | Typography + color tokens only |
| DFG v2 | 2025-12 | Added spacing scale and section library |
| DFG v3 | 2026-04 | Added motion primitives and voice tokens |
| DFG v4 | 2026-Q3 (planned) | Multi-page system consistency, footer/nav system |

## Related
- [[positioning]]
- [[offer-architecture]]
- [[competitive-landscape]]
- [[voice-guide]]

## Sources
- raw/2026-02-dfg-v3-design-doc.md — 2026-02-08
- raw/2026-04-dfg-v3-launch-retrospective.md — 2026-04-25
- raw/2026-05-coaching-mira.md — 2026-05-10
