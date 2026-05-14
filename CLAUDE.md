# Brand Wiki — Schema

This file is the rulebook for the brand wiki in this directory. The pattern is described in [Brand Wiki.md](Brand%20Wiki.md). This file is the operational version: what to do, in what order, with what conventions.

## Layers

- **`raw/`** — immutable source material (transcripts, testimonials, notes, research). Read-only. Never modified.
- **`wiki/`** — LLM-maintained markdown articles. Fully owned by the agent.
- **`wiki/exports/`** — condensed derivatives generated from the wiki (e.g. `brand-context.md`, `voice-guide.md`).
- **`CLAUDE.md`** — this file.

## First read on every session

Before answering any query, ingesting a source, or modifying the wiki, read in this order:

1. [wiki/index.md](wiki/index.md) — the catalog of all articles.
2. This file (`CLAUDE.md`) — the rulebook.
3. [wiki/log.md](wiki/log.md) — recent activity.

Only after these three should individual articles be opened. Do not crawl the wiki.

## Ingest workflow

When a new source is dropped in `raw/`:

1. **Classify by content, not filename.** Read the first portion and classify as one of: `sales-call`, `coaching-call`, `client-call`, `team-meeting`, `interview-or-content`, `testimonial`, `research`, `note`, `published-content`. If ambiguous, classify by what the content actually is.
2. **Extract intelligence.** Pull ICP language, voice patterns, proof points, objections, framework explanations, strategic decisions, competitive signals — whichever apply.
3. **Update every relevant article.** A single source may touch 10–15 articles. Create new articles when a concept appears in more than two sources and lacks its own page.
4. **Cross-reference.** Add internal links between related articles.
5. **Regenerate `index.md` and append to `log.md` in the same pass.** Treat freshness as part of the operation, not a separate task.

## Temporal weighting

Sources from the last 12 months are **primary**. Older sources are **historical context**. For anything describing what the brand currently *is and sells* — ICP, offer architecture, positioning, pricing, tools, voice — newer sources win when they contradict older ones. Older sources retain authority for origin story, founder history, and long-term voice consistency. Flag contradictions in `log.md` and resolve them in favor of the newer source.

## Article format

Every wiki article uses this header:

```markdown
---
title: <Article title>
category: <identity|audience|offers|voice|proof|market|strategy|frameworks>
confidence: <low|medium|high>
sources: <count>
updated: <YYYY-MM-DD>
---

# <Article title>

> One-sentence description.

<lead — 1–3 paragraphs>

## <sections as appropriate>

## Related
- [[other-article]]

## Sources
- raw/<filename> — <YYYY-MM-DD>
```

Use `[[slug]]` for internal links between wiki articles. Use standard markdown links for everything else.

## Index format (`wiki/index.md`)

One line per article. Dense and current. Format:

```
- [Title](category/slug.md) — <category> · <confidence> · <sources> srcs · <YYYY-MM-DD> · <one-line hook>
```

**Regenerate the whole index** on every change. A stale index is worse than no index.

## Log format (`wiki/log.md`)

Append-only. One entry per operation:

```
## [YYYY-MM-DD] <ingest|query|lint|edit> | <source or topic> | Updated: <slug1>, <slug2>, ...
<optional one-line note — contradictions resolved, new article created, etc.>
```

## Query workflow

When the user asks a question:

1. Do the first-read.
2. Open only the articles needed to answer.
3. Synthesize.
4. **If the answer is substantive and reusable** (e.g. a generated sales page, a competitive analysis, a positioning draft), offer to file it back into the wiki as a new article. Do not file silently — confirm with the user first.

## Lint workflow

When asked to health-check:

- Contradictions between articles.
- Stale claims superseded by newer sources.
- Orphan articles (no inbound `[[links]]`).
- Recurring concepts across multiple articles that lack their own page.
- Offers without proof points.
- Voice guide patterns not reflected in recent calls.
- Articles where `updated` lags the most recent source by >90 days.

Produce a health score and a specific fix list. Apply fixes only after the user approves.

## Exports

`wiki/exports/brand-context.md` is the canonical condensed brief — 3,000–5,000 words drawn from the full wiki, intended to be pasted into any AI tool for instant brand context. Regenerate after major ingests. Other exports (`voice-guide.md`, `icp-brief.md`, `offer-brief.md`) are derived on demand from the wiki, not maintained independently.

## Autonomy

The agent has full autonomy to create new articles, new categories, and reorganize structure based on what the data warrants. The starting category set is a scaffold, not a ceiling. The directory structure serves the knowledge, not the other way around.
