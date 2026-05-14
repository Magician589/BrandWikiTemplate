# Brand Wiki

A pattern for building living brand intelligence using LLMs.

This is an idea file, it is designed to be copy pasted to your own LLM Agent (e.g. Claude Code, OpenAI Codex, or etc.). Its goal is to communicate the high level idea, but your agent will build out the specifics in collaboration with you.

## The core idea

Most people's experience with brand strategy looks like this: you hire a consultant, fill in a questionnaire, do a workshop, and receive a PDF brand guide. It sits in a folder. Six months later it's outdated. Your offers have changed, your positioning has evolved, your best client stories aren't in it. Nobody updates it because the maintenance burden is too high. So every time you ask AI to write something for your brand, you start from scratch — pasting in fragments of context, hoping it sounds like you, spending twenty minutes fixing the output.

The idea here is different. Instead of a static brand guide, the LLM **incrementally builds and maintains a persistent wiki** — a structured, interlinked collection of markdown files that represents everything about your brand. When you add a new source (a sales call transcript, a client testimonial, a piece of market research, your own notes), the LLM doesn't just store it. It reads it, extracts the intelligence, and integrates it into the existing wiki — updating your ICP profile, adding to the voice guide, noting where new information contradicts old claims, strengthening the proof stack, filing the insight wherever it belongs. A single coaching call transcript might touch ten wiki articles simultaneously.

This is the key difference: **the wiki is a persistent, compounding artifact.** The cross-references are already there. The contradictions have already been flagged. The synthesis already reflects everything you've ever said, sold, and delivered. The wiki keeps getting richer with every call you take and every question you ask.

You never (or rarely) write the wiki yourself — the LLM writes and maintains all of it. You're in charge of sourcing, reviewing, and asking the right questions. The LLM does all the grunt work — the summarizing, cross-referencing, filing, and bookkeeping that makes brand intelligence actually useful over time.

This applies across different business contexts:

* **Coaches and consultants**: compiling your methodology, your client language, your proof points, your voice — from call transcripts, testimonials, and your own notes. Every coaching call makes the wiki smarter.
* **Service businesses**: building a living record of your positioning, case studies, competitive landscape, and offer architecture. Every project you deliver adds to the proof stack.
* **Agencies**: maintaining client-specific wikis — each client gets their own brand encyclopedia that informs all creative output.
* **Personal brands**: tracking your evolving story, frameworks, audience, and authority signals across platforms.
* **Teams**: an internal brand wiki maintained by LLMs, fed by meeting transcripts, client calls, and strategic documents. The wiki stays current because the LLM does the maintenance that no one on the team wants to do.

## Architecture

There are three layers:

**Raw sources** — your curated collection of source material. Call transcripts, client testimonials, published content, market research, competitor analysis, your own notes and brain dumps. These are immutable — the LLM reads from them but never modifies them. This is your source of truth.

**The wiki** — a directory of LLM-generated markdown files. ICP profiles, voice guides, positioning statements, offer architecture, case studies, framework documentation, competitive landscape, content strategy. The LLM owns this layer entirely. It creates articles, updates them when new sources arrive, maintains cross-references, and keeps everything consistent. You read it; the LLM writes it.

**The schema** — a document (e.g. CLAUDE.md or AGENTS.md) that tells the LLM how the wiki is structured, what the conventions are, and what workflows to follow when ingesting sources, answering questions, or maintaining the wiki. This is the key configuration file — it's what makes the LLM a disciplined brand analyst rather than a generic chatbot. You and the LLM co-evolve this over time.

A suggested starting structure for the wiki layer:

```
wiki/
  identity/        — origin story, founder profile, positioning, values
  audience/         — ICP profiles, language patterns, objections, success stories
  offers/           — offer architecture, pricing, individual product pages
  voice/            — voice guide, signature phrases, banned phrases, writing samples
  proof/            — testimonials, case studies, metrics
  market/           — competitive landscape, trends, content gaps
  strategy/         — content strategy, funnel architecture, growth thesis
  frameworks/       — your proprietary methods and teaching frameworks
```

This is a starting scaffold, not a ceiling. The LLM has full autonomy to create new articles, new categories, and reorganize the structure based on what it finds in the data. If something appears more than twice across different sources, it probably deserves its own article. The directory structure serves the knowledge, not the other way around.

## Operations

**First read on every session.** Before answering a query, ingesting a source, or making any change to the wiki, the LLM should read three files in order: `index.md` (the catalog of all articles with summaries), the schema file (the rulebook), and `log.md` (recent activity). These three files give the LLM the full picture of the wiki in under a minute, without having to crawl every article. Only after reading them should the LLM open individual articles relevant to the task at hand. This pattern keeps the wiki fast to work with even as it grows past a hundred articles — the LLM never has to scan the whole architecture, it just consults the index and drills in.

**Ingest.** You drop a new source into the raw collection and tell the LLM to process it. An example flow: the LLM reads a sales call transcript, extracts ICP language (how the prospect described their problem), voice data (how you explained your offer), proof points (results you mentioned), and objection patterns (what held them back). It updates the relevant wiki articles, adds cross-references, and logs what changed. A single source might touch 10-15 wiki articles. Coaching calls are typically the richest source — they contain ICP data, voice data, framework explanations, proof points, and content signals all at once.

**Classify before extracting.** When ingesting a new transcript or source, don't rely on the filename or any auto-generated title to determine what it is. Read the first few minutes of content and classify it yourself. The most useful classifications for a brand wiki are: *sales calls* (prospect conversations, discovery calls, pitches), *coaching calls* (working sessions with existing clients), *client delivery calls* (project work, status updates), *team meetings* (internal strategy and operations), and *interviews or content recordings* (podcasts, videos, brand-building conversations). Each type contributes different intelligence to the wiki — sales calls are the primary source for objection patterns and buying triggers, coaching calls are the richest source for ICP language and proof points, client calls reveal delivery patterns, team meetings capture strategic decisions. File the source under the correct type before extracting intelligence from it. If the source is mislabeled or ambiguous, the classification should be based on the actual content, not the metadata.

**Weight recent sources more heavily.** When compiling or updating wiki articles, weight recent sources more heavily than older ones. Brands evolve — offers change, positioning sharpens, ICPs shift, tooling gets replaced. Where an older source and a newer source disagree about something current — pricing, audience, offers, positioning, voice — the newer source represents the brand's current reality and should win. Older material remains valuable for origin story context, founder history, and voice consistency, but the sections of the wiki that describe what the brand *is and sells now* (ICP, offer architecture, positioning, tools, pricing) should prioritize what's being said in the most recent sources. As a rough rule, sources from the past twelve months should be treated as primary, and sources older than that should be treated as historical context. Flag contradictions between old and new sources in the log and resolve them in favor of the newer material.

If you don't have existing source material, the LLM can interview you. Tell it to ask you questions about your business, your clients, your story, and your methodology — one at a time. It compiles your answers into wiki articles as you go. You talk; it structures.

If you've been working with an AI partner (Claude, ChatGPT) for months, that AI probably knows your brand better than you can articulate. Ask it to compile what it knows into a source document, then feed that document to your wiki agent.

**Query.** You ask questions against the wiki. The LLM reads the relevant articles and synthesizes an answer with context. But the important insight: **good answers can be filed back into the wiki as new articles.** A sales page you generated, an analysis of what's working in your content, a comparison of your offer against competitors — these are valuable and shouldn't disappear into chat history. This way your explorations compound in the wiki just like ingested sources do.

Queries can take different forms beyond markdown pages. Ask the LLM to generate a sales page from your wiki. A design brief. An email sequence. A content calendar. A client proposal. All of these are just different output formats reading from the same compiled brand intelligence.

**Lint.** Periodically, ask the LLM to health-check the wiki. Look for: contradictions between articles (does your ICP say one thing while your testimonials show another?), stale claims that newer sources have superseded, orphan articles with no inbound links, important concepts mentioned across multiple articles but lacking their own page, offers without supporting proof points, voice guide patterns that don't match how you actually speak on recent calls. The LLM generates a health score and specific fix recommendations. This keeps the wiki honest as it grows.

## Indexing and logging

Two special files help the LLM (and you) navigate the wiki.

**index.md** is content-oriented. A catalog of every article with a link, a one-line summary, and metadata (category, confidence level, source count, last updated). The index is the LLM's entry point on every session — it's how the agent gets the full picture of the wiki without having to crawl every article. Keep it dense, current, and small enough to read in one pass: one line per article, with enough metadata for the LLM to decide whether the article is relevant without opening it. This works well at moderate scale — a brand wiki of 30-100 articles doesn't need embedding-based search.

**Regenerate the index on every change.** A stale index is worse than no index, because the LLM trusts it. Whenever an article is created, updated, or deleted — whether by an ingest, a lint pass, or a manual edit — the index should be regenerated as part of the same operation. Same goes for the log: every change gets an entry, in the same pass that made the change. Treat index and log freshness as part of the operation, not a separate housekeeping task.

**log.md** is chronological. An append-only record of what happened and when — ingests, queries, lint passes. Entries like `## [2026-04-05] ingest | Coaching call April 2 | Updated: icp-primary, voice-guide, anna-profile`. The log gives you a timeline of the wiki's evolution and lets the LLM see what's changed recently without re-reading every article.

## Exports

The wiki is the comprehensive knowledge base, but downstream tools often need a condensed version. Generate export files:

**brand-context.md** — a single 3,000-5,000 word summary drawn from the full wiki. This is what you paste into any AI conversation to give it instant brand context. It's also what goes into your CLAUDE.md or project configuration so your coding agents and content agents always have current brand intelligence.

You can also generate standalone exports for specific use cases — a voice-guide.md for content writers, an icp-brief.md for ad targeting, an offer-brief.md for sales page generation. These are derived from the wiki, not maintained separately. When the wiki updates, the exports regenerate.

## The filing loop

The wiki compounds from use. The pattern:

* New client call → transcript filed, ICP and proof articles updated
* New content published → filed, content strategy updated with what you covered
* New testimonial received → filed, proof stack updated
* Strategic decision made → notes filed, strategy articles updated
* Content performance data → filed, content strategy updated with what's working
* Market shift or competitor move → research filed, competitive landscape updated

You can do this manually (drop files, tell the LLM to compile) or automate it. If you have a call recorder with an API, the entire loop can run on a schedule — new calls get pulled, classified, compiled into the wiki, and exports regenerated automatically.

## Why this works

The tedious part of maintaining brand intelligence is not the thinking — it's the bookkeeping. Updating case studies when you get new results, keeping your ICP current as your client base evolves, noting when your positioning has drifted from what you actually say on calls, maintaining consistency across your website copy, your content, your sales materials. Humans abandon brand guides because the maintenance burden grows faster than the value. LLMs don't get bored, don't forget to update a cross-reference, and can touch fifteen articles in one pass. The wiki stays maintained because the cost of maintenance is near zero.

The human's job is to have conversations, deliver results, make strategic decisions, and review what the wiki produces. The LLM's job is everything else.

The result: every AI interaction with your brand gets better over time. Your content agent writes better articles because the wiki is richer. Your sales pages convert better because the proof stack is deeper. Your proposals land better because the positioning is sharper. And none of this required you to sit down and "work on your brand." It happened automatically, as a byproduct of running your business.

## Note

This document is intentionally abstract. It describes the pattern, not a specific implementation. The exact directory structure, the article formats, the schema conventions, the tooling — all of that will depend on your business, your sources, and your LLM of choice. Everything mentioned above is optional and modular. Your sources might be voice memos instead of transcripts. Your wiki might need categories this document doesn't mention. You might want different export formats.

The rules in the Operations and Indexing sections — first-read order, classification, temporal weighting, index freshness — are production-tested defaults learned from running this pattern at scale. They're worth keeping unless you have a specific reason to change them.

The right way to use this is to share it with your LLM agent and work together to build a version that fits your brand. This document's only job is to communicate the pattern. Your LLM can figure out the rest.
