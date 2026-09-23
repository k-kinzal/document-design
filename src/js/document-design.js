/*
 * document-design — the optional behaviour layer.
 *
 * Everything the stylesheet describes works without this file. What is here is
 * the handful of behaviours that three separate generators had each written
 * for themselves: a theme toggle, a client-side search, sortable tables, copy
 * buttons, facets, a sidebar that opens on a phone, and a table of contents
 * that tracks the heading you are reading.
 *
 * It is driven entirely by data attributes, so there is no API to learn and
 * nothing to call. Add the attribute, get the behaviour.
 *
 * A classic script on purpose, not a module. These documents are opened from
 * disk as often as they are served, and a module script fails outright on
 * file:// because the origin is opaque. `defer` gives the same ordering
 * guarantee without that cost.
 *
 *   <script src="…/document-design.js" defer></script>
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var THEME_KEY = root.getAttribute("data-dd-theme-key") || "dd-theme";

  /* localStorage throws outright in a sandboxed frame and in some private
     modes — not merely returning null — so every access is guarded and the
     page is expected to work when it is unavailable. */
  function readStore(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function writeStore(key, value) {
    try {
      if (value === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, value);
    } catch (e) { /* not available; the setting simply does not persist */ }
  }

  function each(selector, fn, context) {
    var list = (context || document).querySelectorAll(selector);
    for (var i = 0; i < list.length; i++) fn(list[i], i);
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms);
    };
  }

  /* ---------------------------------------------------------------- theme */

  /*
   * Three states, not two. "auto" is a real answer — it means the document
   * follows the reader's system — and a toggle that only flips light/dark
   * takes that away from them the first time they touch it, with no way back.
   */
  var THEMES = ["auto", "light", "dark"];

  function applyTheme(theme) {
    if (theme === "auto") root.removeAttribute("data-dd-theme");
    else root.setAttribute("data-dd-theme", theme);
    each("[data-dd-theme-toggle]", function (btn) {
      btn.setAttribute("data-dd-theme-state", theme);
      btn.setAttribute("title", "Theme: " + theme);
      btn.setAttribute("aria-label", "Theme: " + theme);
    });
  }

  function currentTheme() {
    var stored = readStore(THEME_KEY);
    return THEMES.indexOf(stored) === -1 ? "auto" : stored;
  }

  function initTheme() {
    applyTheme(currentTheme());
    document.addEventListener("click", function (ev) {
      var btn = ev.target.closest && ev.target.closest("[data-dd-theme-toggle]");
      if (!btn) return;
      var next = THEMES[(THEMES.indexOf(currentTheme()) + 1) % THEMES.length];
      writeStore(THEME_KEY, next === "auto" ? null : next);
      applyTheme(next);
    });
  }

  /* ------------------------------------------------------------ sidebar */

  /*
   * The collapsed sidebar and the tab strip are both CSS that only makes sense
   * once this file is running: without it, a hidden sidebar is unreachable
   * navigation and a hidden tab panel is unreachable content. Both are gated
   * on a flag set here, so the no-JavaScript rendering stays complete.
   */
  function markReady(selector, attr) {
    each(selector, function (el) { el.setAttribute(attr, ""); });
  }

  function initNav() {
    markReady(".doc", "data-dd-nav-ready");

    document.addEventListener("click", function (ev) {
      var btn = ev.target.closest && ev.target.closest("[data-dd-nav-toggle]");
      if (btn) {
        document.body.classList.toggle("nav-open");
        return;
      }
      /* Tapping the page behind an open sidebar closes it, which is what a
         reader expects from an overlay and saves them aiming at the toggle. */
      if (document.body.classList.contains("nav-open") &&
          !(ev.target.closest && ev.target.closest(".sidebar"))) {
        document.body.classList.remove("nav-open");
      }
    });
  }

  /* --------------------------------------------------------------- copy */

  function initCopy() {
    document.addEventListener("click", function (ev) {
      var btn = ev.target.closest && ev.target.closest("[data-dd-copy]");
      if (!btn) return;
      var sel = btn.getAttribute("data-dd-copy");
      var source = sel
        ? document.querySelector(sel)
        : (btn.closest(".code-block") || btn.parentNode).querySelector("pre, code");
      if (!source) return;

      var text = source.innerText;
      var done = function () {
        var label = btn.textContent;
        btn.classList.add("is-done");
        btn.textContent = "Copied";
        setTimeout(function () {
          btn.classList.remove("is-done");
          btn.textContent = label;
        }, 1200);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
  }

  /* navigator.clipboard is unavailable on file:// and on plain http, which is
     exactly where these documents get opened. */
  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { /* nothing to offer */ }
    document.body.removeChild(ta);
  }

  /* -------------------------------------------------------------- sort */

  function cellValue(row, index) {
    var cell = row.cells[index];
    if (!cell) return "";
    var explicit = cell.getAttribute("data-dd-value");
    return explicit !== null ? explicit : cell.innerText.trim();
  }

  function compare(a, b) {
    /* Numeric when both sides are numeric, so "9" sorts under "10" rather
       than after it; text otherwise, compared in the reader's locale. */
    var na = parseFloat(a.replace(/[,\s]/g, ""));
    var nb = parseFloat(b.replace(/[,\s]/g, ""));
    var aNum = !isNaN(na) && /^[\d.,\s+-]+$/.test(a);
    var bNum = !isNaN(nb) && /^[\d.,\s+-]+$/.test(b);
    if (aNum && bNum) return na - nb;
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
  }

  function initSort() {
    each("table[data-dd-sortable]", function (table) {
      each("th[data-dd-sort]", function (th, index) {
        th.setAttribute("tabindex", "0");
        th.setAttribute("role", "button");
        var run = function () {
          var body = table.tBodies[0];
          if (!body) return;
          var headIndex = Array.prototype.indexOf.call(th.parentNode.cells, th);
          var desc = th.classList.contains("is-asc");
          each("th[data-dd-sort]", function (other) {
            other.classList.remove("is-asc", "is-desc");
            other.removeAttribute("aria-sort");
          }, table);
          th.classList.add(desc ? "is-desc" : "is-asc");
          th.setAttribute("aria-sort", desc ? "descending" : "ascending");
          var rows = Array.prototype.slice.call(body.rows);
          rows.sort(function (x, y) {
            var r = compare(cellValue(x, headIndex), cellValue(y, headIndex));
            return desc ? -r : r;
          });
          rows.forEach(function (r) { body.appendChild(r); });
        };
        th.addEventListener("click", run);
        th.addEventListener("keydown", function (ev) {
          if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); run(); }
        });
      }, table);
    });
  }

  /* ------------------------------------------------------------- filter */

  function textOf(el) {
    var cached = el.getAttribute("data-dd-text");
    if (cached !== null) return cached;
    var t = el.innerText.toLowerCase();
    el.setAttribute("data-dd-text", t);
    return t;
  }

  function initFilter() {
    each("[data-dd-filter]", function (input) {
      var target = document.querySelector(input.getAttribute("data-dd-filter"));
      if (!target) return;
      var rows = target.tagName === "TABLE"
        ? (target.tBodies[0] ? target.tBodies[0].rows : [])
        : target.children;
      input.addEventListener("input", debounce(function () {
        var q = input.value.trim().toLowerCase();
        var shown = 0;
        for (var i = 0; i < rows.length; i++) {
          var hit = !q || textOf(rows[i]).indexOf(q) !== -1;
          rows[i].classList.toggle("is-hidden", !hit);
          if (hit) shown++;
        }
        report(input, shown, rows.length);
        var empty = document.querySelector(input.getAttribute("data-dd-empty") || "");
        if (empty) empty.hidden = shown !== 0;
      }, 80));
    });
  }

  function report(scopeEl, shown, total) {
    var box = scopeEl.closest("[data-dd-facets], .facets, .content, body");
    var out = box && box.querySelector(".facet-shown");
    if (out) out.textContent = shown === total ? total + "" : shown + " / " + total;
  }

  /* ------------------------------------------------------------- facets */

  /*
   * Facets within one group are an OR — picking SELECT and INSERT means
   * either. Across groups they are an AND — a SELECT that is also flagged.
   * That is what a reader means by ticking two boxes, and the opposite
   * convention makes every second click empty the listing.
   */
  function initFacets() {
    each("[data-dd-facets]", function (bar) {
      var target = document.querySelector(bar.getAttribute("data-dd-facets"));
      if (!target) return;
      var rows = target.children;
      var search = bar.querySelector("[data-dd-facet-search]");

      function apply() {
        var groups = {};
        each("[data-dd-facet].is-on", function (btn) {
          var parts = btn.getAttribute("data-dd-facet").split(":");
          var key = parts.shift();
          (groups[key] = groups[key] || []).push(parts.join(":"));
        }, bar);

        var q = search ? search.value.trim().toLowerCase() : "";
        var shown = 0;
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          var hit = true;
          for (var key in groups) {
            if (!Object.prototype.hasOwnProperty.call(groups, key)) continue;
            var value = row.getAttribute("data-dd-" + key) || "";
            var values = value.split(/\s+/);
            var any = groups[key].some(function (want) { return values.indexOf(want) !== -1; });
            if (!any) { hit = false; break; }
          }
          if (hit && q) hit = textOf(row).indexOf(q) !== -1;
          row.classList.toggle("is-hidden", !hit);
          if (hit) shown++;
        }

        /* A group heading with nothing left under it is noise. */
        each(".group", function (group) {
          var live = group.querySelectorAll(".row:not(.is-hidden), tr:not(.is-hidden)");
          group.classList.toggle("is-empty", live.length === 0);
        }, target.parentNode || document);

        var out = bar.querySelector(".facet-shown");
        if (out) out.textContent = shown === rows.length ? rows.length + "" : shown + " / " + rows.length;

        /*
         * Zero matches is an answer, and it needs saying. Hiding every row and
         * leaving a blank column makes the reader wonder whether the page
         * failed; the empty state says which filters did it and offers the way
         * back. Markup: an element with [data-dd-empty] next to the listing.
         */
        var empty = document.querySelector(bar.getAttribute("data-dd-empty") || "[data-dd-empty]");
        if (empty) empty.hidden = shown !== 0;

        syncUrl(bar, groups);
      }

      /* The URL is read first: initialising aria-pressed before restoring the
         selection announced "not pressed" for facets that were visibly on. */
      readUrl(bar);

      each("[data-dd-facet]", function (btn) {
        btn.setAttribute("aria-pressed", btn.classList.contains("is-on") ? "true" : "false");
        btn.addEventListener("click", function () {
          btn.classList.toggle("is-on");
          btn.setAttribute("aria-pressed", btn.classList.contains("is-on") ? "true" : "false");
          apply();
        });
      }, bar);

      each("[data-dd-facet-clear]", function (btn) {
        btn.addEventListener("click", function () {
          each("[data-dd-facet]", function (f) {
            f.classList.remove("is-on");
            f.setAttribute("aria-pressed", "false");
          }, bar);
          if (search) search.value = "";
          apply();
        });
      }, bar);

      if (search) search.addEventListener("input", debounce(apply, 80));

      apply();
    });
  }

  /* The current narrowing lives in the query string, so a filtered listing is
     a link someone can send. */
  function syncUrl(bar, groups) {
    if (bar.getAttribute("data-dd-facet-url") === "off") return;
    var params = new URLSearchParams();
    for (var key in groups) {
      if (Object.prototype.hasOwnProperty.call(groups, key)) params.set(key, groups[key].join(","));
    }
    var qs = params.toString();
    try {
      history.replaceState(null, "", qs ? "?" + qs + location.hash : location.pathname + location.hash);
    } catch (e) { /* file:// refuses replaceState; the filter still works */ }
  }

  function readUrl(bar) {
    var params;
    try { params = new URLSearchParams(location.search); } catch (e) { return; }
    params.forEach(function (value, key) {
      value.split(",").forEach(function (one) {
        var btn = bar.querySelector('[data-dd-facet="' + key + ":" + one + '"]');
        if (btn) btn.classList.add("is-on");
      });
    });
  }

  /* ------------------------------------------------------------- search */

  /*
   * The index is the page's, not ours: only the generator knows what is worth
   * finding. Provide window.ddSearchIndex as an array of
   *   { name, where, body, href }
   * or set window.ddSearch to a function (query) -> those objects.
   */
  function initSearch() {
    var input = document.querySelector("[data-dd-search]");
    if (!input) return;
    var panel = document.querySelector("[data-dd-search-results], #search-results");
    if (!panel) return;

    var selected = -1;

    function provider(q) {
      if (typeof window.ddSearch === "function") return window.ddSearch(q);
      var index = window.ddSearchIndex || [];
      var needle = q.toLowerCase();
      var out = [];
      for (var i = 0; i < index.length && out.length < 50; i++) {
        var item = index[i];
        var hay = ((item.name || "") + " " + (item.where || "") + " " + (item.body || "")).toLowerCase();
        if (hay.indexOf(needle) !== -1) out.push(item);
      }
      /* A name match is what the reader meant; a body match is a fallback. */
      out.sort(function (a, b) {
        var an = (a.name || "").toLowerCase().indexOf(needle) === -1 ? 1 : 0;
        var bn = (b.name || "").toLowerCase().indexOf(needle) === -1 ? 1 : 0;
        return an - bn;
      });
      return out;
    }

    function close() { panel.hidden = true; selected = -1; }

    function render(results) {
      panel.textContent = "";
      if (!results.length) {
        var empty = document.createElement("div");
        empty.className = "search-empty";
        empty.textContent = "Nothing matched.";
        panel.appendChild(empty);
      } else {
        results.forEach(function (item) {
          var a = document.createElement("a");
          a.href = item.href || "#";
          var name = document.createElement("span");
          name.className = "hit-name";
          name.textContent = item.name || "";
          a.appendChild(name);
          if (item.where) {
            a.appendChild(document.createTextNode(" "));
            var where = document.createElement("span");
            where.className = "hit-where";
            where.textContent = item.where;
            a.appendChild(where);
          }
          if (item.body) {
            var body = document.createElement("span");
            body.className = "hit-body";
            body.textContent = item.body;
            a.appendChild(body);
          }
          panel.appendChild(a);
        });
      }
      panel.hidden = false;
      selected = -1;
    }

    input.addEventListener("input", debounce(function () {
      var q = input.value.trim();
      if (q.length < 2) { close(); return; }
      render(provider(q));
    }, 100));

    input.addEventListener("keydown", function (ev) {
      var hits = panel.querySelectorAll("a");
      if (ev.key === "Escape") { close(); input.blur(); return; }
      if (!hits.length) return;
      if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
        ev.preventDefault();
        selected += ev.key === "ArrowDown" ? 1 : -1;
        if (selected < 0) selected = hits.length - 1;
        if (selected >= hits.length) selected = 0;
        for (var i = 0; i < hits.length; i++) hits[i].classList.toggle("is-selected", i === selected);
        hits[selected].scrollIntoView({ block: "nearest" });
      } else if (ev.key === "Enter" && selected >= 0) {
        ev.preventDefault();
        hits[selected].click();
      }
    });

    document.addEventListener("click", function (ev) {
      if (ev.target !== input && !(ev.target.closest && ev.target.closest("[data-dd-search-results], #search-results"))) close();
    });

    /* "/" focuses search, the convention every documentation site shares —
       but not while the reader is typing into something else. */
    document.addEventListener("keydown", function (ev) {
      if (ev.key !== "/" || ev.metaKey || ev.ctrlKey || ev.altKey) return;
      var el = document.activeElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      ev.preventDefault();
      input.focus();
      input.select();
    });
  }

  /* --------------------------------------------------------------- tabs */

  /*
   * Tabs. Arrow keys move between them, which is what the tab pattern says
   * and what a reader who navigates by keyboard expects; only the selected
   * tab is in the tab order, so Tab leaves the strip rather than walking
   * every view of the same thing.
   */
  function initTabs() {
    each("[data-dd-tabs]", function (root) {
      var all = [].slice.call(root.querySelectorAll('[role="tab"]'));
      /* A disabled tab is neither reachable by arrow key nor selectable, but
         it stays in the strip so the reader can see the view exists. */
      var tabs = all.filter(function (t) { return !t.disabled; });
      if (!tabs.length) return;
      root.setAttribute("data-dd-tabs-ready", "");

      function select(tab) {
        if (!tab || tab.disabled) return;
        all.forEach(function (t) {
          var on = t === tab;
          t.setAttribute("aria-selected", on ? "true" : "false");
          t.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !on;
        });
      }

      /* Panels ship visible so that they are readable without this script;
         collapsing them is the first thing the script does. */
      var first = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
      select(first);

      tabs.forEach(function (tab, i) {
        tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1;
        tab.addEventListener("click", function () { select(tab); });
        tab.addEventListener("keydown", function (ev) {
          var next = null;
          if (ev.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
          else if (ev.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
          else if (ev.key === "Home") next = tabs[0];
          else if (ev.key === "End") next = tabs[tabs.length - 1];
          if (!next) return;
          ev.preventDefault();
          select(next);
          next.focus();
        });
      });
    });
  }

  /* ------------------------------------------------------------- to top */

  function initToTop() {
    var btn = document.querySelector("[data-dd-to-top]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    var onScroll = function () {
      btn.classList.toggle("is-shown", window.scrollY > window.innerHeight);
    };
    /* Passive: this runs on every scroll frame and never calls preventDefault,
       and saying so is what keeps it off the main thread's critical path. */
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------------- toc */

  /*
   * Which heading you are reading, marked in the sidebar. Uses an observer
   * with a band near the top rather than a scroll handler: a scroll handler
   * runs on every frame of a flick through a long catalog page, and this runs
   * only when a heading crosses the band.
   */
  function initToc() {
    var toc = document.querySelector("[data-dd-toc], .sidebar-context");
    if (!toc || !("IntersectionObserver" in window)) return;

    var links = {};
    var targets = [];
    each("a[href^='#']", function (a) {
      var id = decodeURIComponent(a.getAttribute("href").slice(1));
      var target = id && document.getElementById(id);
      if (!target) return;
      links[id] = a;
      targets.push(target);
    }, toc);
    if (!targets.length) return;

    var visible = new Set();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });
      var first = targets.filter(function (t) { return visible.has(t.id); })[0];
      if (!first) return;
      for (var id in links) {
        if (!Object.prototype.hasOwnProperty.call(links, id)) continue;
        var li = links[id].closest("li") || links[id];
        li.classList.toggle("is-active", id === first.id);
      }
    }, { rootMargin: "-" + (56) + "px 0px -70% 0px", threshold: 0 });

    targets.forEach(function (t) { observer.observe(t); });
  }

  /* -------------------------------------------------------------- start */

  function start() {
    initTheme();
    initNav();
    initCopy();
    initSort();
    initFilter();
    initFacets();
    initSearch();
    initTabs();
    initToTop();
    initToc();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  /* One escape hatch, for a page that builds part of itself. */
  window.documentDesign = { refresh: start, applyTheme: applyTheme };
})();
