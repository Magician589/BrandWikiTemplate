/* Brand Wiki — client-side markdown renderer.
 * Loads .md files from /wiki, renders them in Wikipedia MoS layout.
 * Routing: hash-based. #/wiki/<path-without-.md>, #/about, #/random.
 */

(function () {
  "use strict";

  const WIKI_ROOT = "wiki";
  const DEFAULT_PAGE = "wiki/index";

  const state = {
    index: null,        // parsed index: [{title, path, category, confidence, sources, updated, hook}]
    slugMap: new Map(), // slug -> path (without .md)
    pageCache: new Map() // path -> raw markdown
  };

  // ---------- Utilities ----------

  function $(sel) { return document.querySelector(sel); }

  function slugify(s) {
    return String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  async function fetchText(path) {
    if (state.pageCache.has(path)) return state.pageCache.get(path);
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
    const text = await res.text();
    state.pageCache.set(path, text);
    return text;
  }

  // ---------- Frontmatter ----------

  function parseFrontmatter(md) {
    const m = md.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!m) return { data: {}, body: md };
    let data = {};
    try {
      data = window.jsyaml ? window.jsyaml.load(m[1]) : {};
    } catch (e) {
      data = {};
    }
    return { data: data || {}, body: md.slice(m[0].length) };
  }

  // ---------- Markdown setup ----------

  function configureMarked() {
    const renderer = new marked.Renderer();

    // Override link rendering to handle internal paths and wikilinks
    const baseLink = renderer.link.bind(renderer);
    renderer.link = function (href, title, text) {
      if (!href) return baseLink(href, title, text);

      // External URL
      if (/^(https?:)?\/\//i.test(href) || /^mailto:/i.test(href)) {
        return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener"${title ? ` title="${escapeHtml(title)}"` : ""}>${text}</a>`;
      }

      // Hash links
      if (href.startsWith("#")) {
        return `<a href="${escapeHtml(href)}">${text}</a>`;
      }

      // Relative markdown link — rewrite to hash route
      const hashHref = resolveLinkHref(href);
      return `<a href="${escapeHtml(hashHref)}"${title ? ` title="${escapeHtml(title)}"` : ""}>${text}</a>`;
    };

    marked.use({ renderer, gfm: true, breaks: false, headerIds: false, mangle: false });
  }

  // Convert a relative .md href found inside a page into our hash route.
  function resolveLinkHref(href) {
    // Strip ./, leading slashes
    let h = href.replace(/^\.\//, "");
    // If non-md (image, css, html), leave as is (but make relative work)
    if (!/\.md(\#|$)/i.test(h)) {
      return h;
    }
    // Drop .md extension and keep optional hash
    const [path, frag] = h.split("#");
    const cleaned = path.replace(/\.md$/i, "");
    // If link goes up out of wiki (e.g. ../CLAUDE.md), still route through hash
    // Resolve relative to current page directory
    const currentDir = currentPagePath().split("/").slice(0, -1).join("/");
    const absolute = normalizePath(currentDir ? currentDir + "/" + cleaned : cleaned);
    return "#/" + absolute + (frag ? "#" + frag : "");
  }

  function normalizePath(p) {
    const parts = p.split("/");
    const out = [];
    for (const part of parts) {
      if (part === "" || part === ".") continue;
      if (part === "..") out.pop();
      else out.push(part);
    }
    return out.join("/");
  }

  // ---------- Preprocessors ----------

  // Convert [[slug]] wikilinks → markdown links with looked-up paths.
  function expandWikilinks(md) {
    return md.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, slug, label) => {
      const trimmed = slug.trim();
      const text = (label || trimmed).trim();
      const path = state.slugMap.get(trimmed);
      if (path) {
        return `[${text}](#/${path})`;
      }
      // Broken link
      return `<a class="broken" href="#/wiki/${encodeURIComponent(trimmed)}" title="Page not found">${escapeHtml(text)}</a>`;
    });
  }

  // Convert [Citation needed] and [To be defined] markers into styled tags.
  function expandTags(md) {
    return md
      .replace(/\[Citation needed\]/gi, '<sup class="cite-needed"></sup>')
      .replace(/\[To be defined\]/gi, '<sup class="tbd">To be defined</sup>');
  }

  // ---------- Page rendering ----------

  function currentPagePath() {
    const h = (location.hash || "").replace(/^#\/?/, "");
    if (!h || h.startsWith("about") || h.startsWith("random")) return DEFAULT_PAGE;
    return h.split("#")[0];
  }

  function renderInfobox(meta, articleTitle) {
    if (!meta || Object.keys(meta).length === 0) return "";
    const rows = [];
    const order = ["title", "category", "confidence", "sources", "updated"];
    const seen = new Set();
    for (const key of order) {
      if (key === "title") { seen.add(key); continue; }
      if (meta[key] === undefined) continue;
      seen.add(key);
      let value = meta[key];
      if (key === "confidence") {
        value = `<span class="badge badge--${escapeHtml(String(value))}">${escapeHtml(String(value))}</span>`;
      } else if (key === "sources") {
        value = `${escapeHtml(String(value))} source${value == 1 ? "" : "s"}`;
      } else {
        value = escapeHtml(String(value));
      }
      rows.push(`<tr><th>${escapeHtml(key)}</th><td>${value}</td></tr>`);
    }
    for (const [k, v] of Object.entries(meta)) {
      if (seen.has(k)) continue;
      rows.push(`<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(String(v))}</td></tr>`);
    }
    if (!rows.length) return "";
    return `
      <aside class="infobox" aria-label="Article metadata">
        <div class="infobox__title">${escapeHtml(meta.title || articleTitle || "Article")}</div>
        <table><tbody>${rows.join("")}</tbody></table>
      </aside>`;
  }

  // After marked rendering, post-process the HTML DOM:
  // - extract the first h1 as page title
  // - upgrade the first blockquote (lead description) to a styled subtitle
  // - add ids to headings for TOC + deep-linking
  function postProcessArticle(htmlString, meta) {
    const wrap = document.createElement("div");
    wrap.innerHTML = htmlString;

    // Extract first H1 as page title
    const firstH1 = wrap.querySelector("h1");
    let pageTitle = meta.title || (firstH1 ? firstH1.textContent : "Untitled");
    if (firstH1) firstH1.remove();

    // Lead blockquote (first blockquote before any h2)
    const firstChild = wrap.firstElementChild;
    if (firstChild && firstChild.tagName === "BLOCKQUOTE") {
      firstChild.classList.add("lead-blockquote");
    }

    // Add ids to headings
    const headings = wrap.querySelectorAll("h2, h3, h4");
    const tocItems = [];
    const slugCounts = {};
    headings.forEach(h => {
      const base = slugify(h.textContent) || "section";
      slugCounts[base] = (slugCounts[base] || 0) + 1;
      const id = slugCounts[base] === 1 ? base : `${base}-${slugCounts[base]}`;
      h.id = id;
      tocItems.push({ level: parseInt(h.tagName[1], 10), id, text: h.textContent });
    });

    return {
      title: pageTitle,
      bodyHtml: wrap.innerHTML,
      tocItems
    };
  }

  function renderToc(items) {
    const toc = $("#toc");
    if (!items.length) {
      toc.innerHTML = "";
      toc.style.display = "none";
      return;
    }
    toc.style.display = "";
    // Build a nested ordered list from h2/h3/h4
    let html = '<h4>Contents</h4><ol>';
    let stack = [2];
    items.forEach(it => {
      while (it.level > stack[stack.length - 1]) {
        html += "<ol>";
        stack.push(stack[stack.length - 1] + 1);
      }
      while (it.level < stack[stack.length - 1]) {
        html += "</ol>";
        stack.pop();
      }
      html += `<li><a href="#${it.id}">${escapeHtml(it.text)}</a></li>`;
    });
    while (stack.length > 1) { html += "</ol>"; stack.pop(); }
    html += "</ol>";
    toc.innerHTML = html;
  }

  function renderMetaLine(meta) {
    if (!meta || !Object.keys(meta).length) return "";
    const parts = [];
    if (meta.category) parts.push(`Category: <strong>${escapeHtml(meta.category)}</strong>`);
    if (meta.updated) parts.push(`Updated ${escapeHtml(meta.updated)}`);
    if (meta.sources !== undefined) parts.push(`${escapeHtml(String(meta.sources))} source${meta.sources == 1 ? "" : "s"}`);
    if (meta.confidence) parts.push(`Confidence: ${escapeHtml(meta.confidence)}`);
    return parts.length ? `<div class="meta-line">${parts.join(" · ")}</div>` : "";
  }

  async function renderPage(path) {
    const contentEl = $("#content");
    contentEl.scrollTop = 0;
    contentEl.innerHTML = '<article class="article"><p class="loading">Loading…</p></article>';
    $("#toc").innerHTML = "";

    try {
      const md = await fetchText(path + ".md");
      const { data: meta, body } = parseFrontmatter(md);
      let processed = expandWikilinks(body);
      processed = expandTags(processed);
      const rawHtml = marked.parse(processed);
      const { title, bodyHtml, tocItems } = postProcessArticle(rawHtml, meta);
      document.title = `${title} — Brand Wiki`;

      const infobox = renderInfobox(meta, title);
      const metaLine = renderMetaLine(meta);

      contentEl.innerHTML = `
        <article class="article">
          ${infobox}
          <h1 class="page-title">${escapeHtml(title)}</h1>
          ${metaLine}
          ${bodyHtml}
        </article>`;

      renderToc(tocItems);

      // Anchor scroll if a fragment was requested
      const frag = (location.hash.split("#")[2] || "").trim();
      if (frag) {
        const el = document.getElementById(frag);
        if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    } catch (err) {
      contentEl.innerHTML = `
        <article class="article">
          <h1 class="page-title">Page not found</h1>
          <div class="notice">
            Could not load <code>${escapeHtml(path)}.md</code>.<br>
            ${escapeHtml(err.message || "")}
          </div>
          <p>If you are opening this file directly from disk, the browser blocks <code>fetch()</code> on <code>file://</code> URLs. Start a tiny local server from this directory:</p>
          <pre><code>python3 -m http.server 8000
# then visit http://localhost:8000/</code></pre>
          <p>Or return to the <a href="#/wiki/index">main index</a>.</p>
        </article>`;
      $("#toc").innerHTML = "";
    }
  }

  // ---------- Index loading & sidebar ----------

  async function loadIndex() {
    const md = await fetchText("wiki/index.md");
    const entries = [];
    const lineRe = /^- \[([^\]]+)\]\(([^)]+)\)\s*—\s*(.+)$/;
    let currentCategory = null;

    md.split("\n").forEach(line => {
      const h2 = line.match(/^##\s+(.+?)\s*$/);
      if (h2) { currentCategory = h2[1]; return; }
      const m = line.match(lineRe);
      if (!m) return;
      const [, title, href, rest] = m;
      const path = "wiki/" + href.replace(/\.md$/, "");
      const slug = href.split("/").pop().replace(/\.md$/, "");
      const parts = rest.split("·").map(s => s.trim());
      // parts: category · confidence · N srcs · date · hook
      const entry = {
        title,
        slug,
        path,
        category: (parts[0] || currentCategory || "").toLowerCase(),
        confidence: parts[1] || "",
        sources: (parts[2] || "").replace(/\s*srcs?$/, ""),
        updated: parts[3] || "",
        hook: parts.slice(4).join(" · ") || ""
      };
      entries.push(entry);
    });

    state.index = entries;
    state.slugMap.clear();
    entries.forEach(e => state.slugMap.set(e.slug, e.path));
    return entries;
  }

  function renderSidebar() {
    const host = $("#sidebar-categories");
    if (!state.index || !state.index.length) {
      host.innerHTML = "<h3>Categories</h3><div class='sidebar__loading'>No entries.</div>";
      return;
    }
    const byCat = {};
    state.index.forEach(e => {
      const k = e.category || "uncategorized";
      (byCat[k] = byCat[k] || []).push(e);
    });
    const cats = Object.keys(byCat).sort();
    let html = "<h3>Categories</h3>";
    cats.forEach(cat => {
      html += `<div class="sidebar__cat"><div class="sidebar__cat-title">${escapeHtml(cat)}</div><ul>`;
      byCat[cat].forEach(e => {
        html += `<li><a href="#/${escapeHtml(e.path)}">${escapeHtml(e.title)}</a></li>`;
      });
      html += "</ul></div>";
    });
    host.innerHTML = html;
  }

  // ---------- Special pages ----------

  function renderAbout() {
    const html = `
      <article class="article">
        <h1 class="page-title">About this wiki</h1>
        <div class="page-subtitle">A private brand knowledge base rendered from markdown.</div>
        <p>This site is a Wikipedia-style frontend over the markdown files in <code>/wiki</code>. Articles are stored as plain <code>.md</code> with YAML frontmatter; this page renders them client-side using <a href="https://marked.js.org" target="_blank" rel="noopener">marked.js</a>.</p>

        <h2>Conventions</h2>
        <ul>
          <li>Every article opens with an H1 title and a one-sentence blockquote description.</li>
          <li>Sections follow the standard layout: Overview, Background, Main concept, Strategic relevance, Usage, Related pages, References, External links.</li>
          <li>Internal links use <code>[[slug]]</code>. Missing pages render in red.</li>
          <li>YAML frontmatter (<code>title, category, confidence, sources, updated</code>) appears in the infobox.</li>
        </ul>

        <h2>Running locally</h2>
        <p>Open a terminal in this directory and run:</p>
        <pre><code>python3 -m http.server 8000</code></pre>
        <p>Then visit <code>http://localhost:8000/</code>.</p>

        <h2>See also</h2>
        <ul>
          <li><a href="#/wiki/index">Index</a></li>
          <li><a href="#/wiki/log">Activity log</a></li>
          <li><a href="CLAUDE.md">Schema (CLAUDE.md)</a></li>
        </ul>
      </article>`;
    $("#content").innerHTML = html;
    $("#toc").innerHTML = "";
    document.title = "About — Brand Wiki";
  }

  // Custom render for the index page: replace its simple list with a card layout.
  function renderIndexPageEnhancement() {
    // Only enhance if we're actually on the index page
    if (currentPagePath() !== "wiki/index") return;
    const article = $("#content .article");
    if (!article || !state.index) return;

    const byCat = {};
    state.index.forEach(e => {
      const k = e.category || "uncategorized";
      (byCat[k] = byCat[k] || []).push(e);
    });

    let html = '<div class="index-categories">';
    Object.keys(byCat).sort().forEach(cat => {
      html += `<div class="index-card"><h3>${escapeHtml(cat)}</h3><ul>`;
      byCat[cat].forEach(e => {
        html += `<li><a href="#/${escapeHtml(e.path)}">${escapeHtml(e.title)}</a>`;
        if (e.hook) html += ` — <span style="color:var(--c-text-muted)">${escapeHtml(e.hook)}</span>`;
        html += `</li>`;
      });
      html += "</ul></div>";
    });
    html += "</div>";

    // Append after existing rendered index content
    const inject = document.createElement("div");
    inject.innerHTML = `<h2 id="catalog">Catalog</h2>${html}`;
    article.appendChild(inject);
  }

  async function gotoRandom() {
    if (!state.index || !state.index.length) await loadIndex();
    if (!state.index.length) return;
    const pick = state.index[Math.floor(Math.random() * state.index.length)];
    location.hash = "#/" + pick.path;
  }

  // ---------- Search ----------

  async function search(query) {
    const q = (query || "").trim().toLowerCase();
    const host = $("#search-results");
    if (!q) { host.hidden = true; host.innerHTML = ""; return; }
    if (!state.index) await loadIndex();

    // Fetch all articles in parallel (cached after first load)
    const hits = [];
    await Promise.all(state.index.map(async e => {
      try {
        const md = await fetchText(e.path + ".md");
        const idx = md.toLowerCase().indexOf(q);
        const titleMatch = e.title.toLowerCase().includes(q);
        if (idx === -1 && !titleMatch) return;
        let snippet = "";
        if (idx !== -1) {
          const start = Math.max(0, idx - 40);
          const end = Math.min(md.length, idx + q.length + 60);
          snippet = (start > 0 ? "…" : "") + md.slice(start, end).replace(/\n+/g, " ") + (end < md.length ? "…" : "");
        }
        hits.push({ entry: e, snippet, titleMatch });
      } catch (_) { /* skip */ }
    }));

    hits.sort((a, b) => Number(b.titleMatch) - Number(a.titleMatch));

    if (!hits.length) {
      host.innerHTML = `
        <div class="search-results__head">
          <span>No results for "${escapeHtml(q)}"</span>
          <button onclick="document.getElementById('search-results').hidden=true">×</button>
        </div>`;
      host.hidden = false;
      return;
    }

    host.innerHTML = `
      <div class="search-results__head">
        <span>${hits.length} result${hits.length === 1 ? "" : "s"} for "${escapeHtml(q)}"</span>
        <button onclick="document.getElementById('search-results').hidden=true">×</button>
      </div>
      <ul>
        ${hits.map(h => `
          <li>
            <a href="#/${escapeHtml(h.entry.path)}" onclick="document.getElementById('search-results').hidden=true">${escapeHtml(h.entry.title)}</a>
            ${h.snippet ? `<span class="snippet">${escapeHtml(h.snippet)}</span>` : ""}
          </li>`).join("")}
      </ul>`;
    host.hidden = false;
  }

  // ---------- Router ----------

  async function handleRoute() {
    const raw = (location.hash || "").replace(/^#\/?/, "");
    if (!raw) {
      location.replace("#/" + DEFAULT_PAGE);
      return;
    }
    if (raw.startsWith("about")) {
      renderAbout();
      return;
    }
    if (raw.startsWith("random")) {
      await gotoRandom();
      return;
    }

    const path = raw.split("#")[0];
    await renderPage(path);

    if (path === "wiki/index") {
      renderIndexPageEnhancement();
    }
  }

  // ---------- Boot ----------

  document.addEventListener("DOMContentLoaded", async () => {
    configureMarked();

    try {
      await loadIndex();
      renderSidebar();
    } catch (err) {
      $("#sidebar-categories").innerHTML =
        `<h3>Categories</h3><div class="sidebar__loading">Index unavailable.</div>`;
    }

    await handleRoute();
    window.addEventListener("hashchange", handleRoute);
  });

  // Public API for inline handlers
  window.BrandWiki = { search };
})();
