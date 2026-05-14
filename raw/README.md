# Raw Sources

Drop source material here. The agent reads from this directory but never modifies it.

## What goes here

- Call transcripts (sales, coaching, client, team)
- Testimonials and client feedback
- Published content (articles, posts, scripts)
- Market and competitor research
- Your own notes, brain dumps, and voice memos
- Interview and podcast transcripts

## Conventions

- Use the date in the filename when known: `2026-05-14-coaching-call-anna.md`
- Don't rely on filenames for classification — the agent classifies by content.
- One source per file when possible.
- Plain markdown or text is preferred. PDFs and images work but are slower to ingest.

## After dropping a source

Tell the agent: _"Ingest the new file(s) in `raw/`."_ It will classify, extract, update the relevant wiki articles, refresh `wiki/index.md`, and append an entry to `wiki/log.md`.
