---
title: Offer Architecture
category: offers
confidence: high
sources: 5
updated: 2026-05-14
---

# Offer Architecture

> WikiCreator sells a single SaaS product on three flat tiers, with no per-generation credits.

WikiCreator's offer is deliberately simple: one product, three tiers, monthly or annual billing. The strategic choice is to avoid usage-based pricing — credits and metered generations create anxiety that conflicts with the core promise of "make me look credible by Friday." Flat pricing aligns the buying experience with the brand's positioning around speed and confidence. See [[positioning]].

The free tier exists as a top-of-funnel acquisition surface, not as a sustainable product. Free users generate one site, hit the publish wall, and convert at a measured rate of 11–14%.

## Tiers

| Tier | Price (USD/mo) | Sites | Custom domain | Code export | Team seats |
|---|---|---|---|---|---|
| **Free** | $0 | 1 | — | — | 1 |
| **Solo** | $29 | 3 | Yes | — | 1 |
| **Studio** | $89 | 10 | Yes | Yes (HTML/CSS) | 3 |
| **Agency** | $249 | Unlimited | Yes | Yes (React) | 10 |

Annual billing is offered at a 20% discount. The Agency tier is the white-label entry point for the secondary ICP — see [[icp-primary]] and [[growth-thesis]].

## What is included in every tier

- Full design-system generation per brand (see [[design-first-generation]]).
- Post-generation visual editor.
- Hosting on WikiCreator's CDN.
- Image generation and library.
- Mobile-responsive output.

## What is intentionally excluded

- E-commerce. WikiCreator does not sell store functionality. Users wanting commerce are routed to Shopify integrations.
- Blogging CMS. A lightweight content surface exists, but WikiCreator is not a publishing platform.
- Multi-language sites. On the 2026 H2 roadmap, not currently shipped.

## Pricing rationale

- **Flat over metered.** Per-generation credits would surface every iteration as a cost, eroding the willingness to iterate — which is where users discover the product's quality.
- **$29 anchor.** Below the psychological threshold where buyers comparison-shop. Squarespace starts at $16, Framer at $15. WikiCreator's premium is justified by output quality and time saved.
- **No discounting at point of sale.** Discounts are reserved for annual billing only. Sales team is not authorized to negotiate tier prices. This protects the brand's premium positioning.

## Related
- [[positioning]]
- [[icp-primary]]
- [[growth-thesis]]
- [[design-first-generation]]

## Sources
- raw/2026-01-pricing-experiment-results.md — 2026-01-30
- raw/2026-03-mira-investor-deck.md — 2026-03-08
- raw/2026-04-pricing-decision-memo.md — 2026-04-11
- raw/2026-04-sales-call-finn-and-co.md — 2026-04-19
- raw/2026-05-coaching-mira.md — 2026-05-10
