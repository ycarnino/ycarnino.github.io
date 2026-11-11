/* Shared behaviour for every page: theme, rendering from content.js, reveal, card tilt, contact form. */
(function () {
  "use strict";
  var SITE = window.SITE || { profile: {}, projects: [], testimonials: [] };
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  /* ---------- Theme: dark by default, the toggle remembers a choice ---------- */
  var toggle = $(".theme-toggle");
  try {
    var saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) { /* storage unavailable: stay on the default */ }
  function syncToggle() {
    if (!toggle) return;
    var light = root.getAttribute("data-theme") === "light";
    toggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    toggle.setAttribute("aria-pressed", String(light));
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* fine */ }
      syncToggle();
    });
    syncToggle();
  }

  /* ---------- Featured cards (home) ---------- */
  var cards = $("#featured");
  if (cards) {
    cards.innerHTML = SITE.projects.filter(function (p) { return p.featured; }).map(function (p) {
      var m = p.metrics[0];
      return '<a class="card" href="projects.html#' + esc(p.id) + '">' +
        '<div><div class="big">' + esc(m.value) + '</div><div class="cap">' + esc(m.label) + "</div></div>" +
        "<h3>" + esc(p.title) + "</h3>" +
        '<div class="org">' + esc(p.org) + ", " + esc(p.where) + "</div></a>";
    }).join("");
  }

  /* ---------- Recommendations (home) ---------- */
  var quotes = $("#quotes");
  if (quotes) {
    quotes.innerHTML = SITE.testimonials.map(function (t) {
      if (t.draft) {
        return '<figure class="quote draft"><blockquote>Open slot. Paste a real quote into js/content.js.</blockquote>' +
          "<figcaption><strong>" + esc(t.name) + "</strong>" + esc(t.title) + "</figcaption></figure>";
      }
      return '<figure class="quote"><blockquote>' + esc(t.quote) + "</blockquote>" +
        "<figcaption><strong>" + esc(t.name) + "</strong>" + esc(t.title) + "</figcaption></figure>";
    }).join("");
  }

  /* ---------- Case studies (projects page) ---------- */
  var cases = $("#cases");
  if (cases) {
    var kinds = ["All"];
    SITE.projects.forEach(function (p) { if (kinds.indexOf(p.kind) < 0) kinds.push(p.kind); });
    var filters = $("#filters");
    filters.innerHTML = kinds.map(function (k, i) {
      var label = k === "All" ? "All work" : k + "s";
      if (k === "Research" || k === "Leadership") label = k;
      return '<button type="button" class="chip" data-kind="' + esc(k) + '" aria-pressed="' + (i === 0) + '">' + esc(label) + "</button>";
    }).join("");

    cases.innerHTML = SITE.projects.map(function (p) {
      return '<article class="case" id="' + esc(p.id) + '" data-kind="' + esc(p.kind) + '">' +
        '<header class="case-top">' +
          '<h2 class="case-title">' + esc(p.title) + "</h2>" +
          '<p class="case-meta"><b>' + esc(p.org) + "</b>, " + esc(p.role) + ". " + esc(p.where) + ", " + esc(p.when) + ".</p>" +
        "</header>" +
        '<div class="case-body">' +
          '<div class="case-metrics">' + p.metrics.map(function (m) {
            return '<div><div class="big">' + esc(m.value) + '</div><div class="cap">' + esc(m.label) + "</div></div>";
          }).join("") + "</div>" +
          '<div class="stack"><dl class="prar">' +
            "<div><dt>Problem</dt><dd>" + esc(p.problem) + "</dd></div>" +
            "<div><dt>My role</dt><dd>" + esc(p.myRole) + "</dd></div>" +
            "<div><dt>What I did</dt><dd>" + esc(p.action) + "</dd></div>" +
            '<div class="result"><dt>Result</dt><dd>' + esc(p.result) + "</dd></div>" +
          "</dl>" +
          '<ul class="tags" aria-label="Tools used">' + p.stack.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul></div>" +
        "</div></article>";
    }).join("");

    filters.addEventListener("click", function (e) {
      var b = e.target.closest(".chip");
      if (!b) return;
      filters.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === b)); });
      var kind = b.getAttribute("data-kind");
      cases.querySelectorAll(".case").forEach(function (c) {
        c.hidden = kind !== "All" && c.getAttribute("data-kind") !== kind;
      });
    });

    // Arriving from the map with projects.html#some-id: the article was just created, so scroll to it now.
    if (location.hash.length > 1) {
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) setTimeout(function () { target.scrollIntoView({ block: "start" }); }, 60);
    }
  }

  /* ---------- Contact page ---------- */
  var links = $("#contact-links");
  if (links) {
    var p = SITE.profile;
    var row = function (k, url, missing) {
      if (!url) return '<li><span class="k">' + k + '</span><span class="v todo">' + missing + "</span></li>";
      return '<li><span class="k">' + k + '</span><a class="v" href="' + esc(url) + '" rel="me noopener">' + esc(url.replace(/^https?:\/\/(www\.)?/, "")) + "</a></li>";
    };
    links.innerHTML =
      '<li><span class="k">Email</span><span class="v" id="email-text">' + esc(p.email) + "</span>" +
      '<button type="button" class="copy" id="copy-email">Copy address</button></li>' +
      row("LinkedIn", p.linkedin, "Add your LinkedIn URL in js/content.js") +
      row("GitHub", p.github, "Add your GitHub URL in js/content.js");
    var copy = $("#copy-email");
    copy.addEventListener("click", function () {
      var done = function () { copy.textContent = "Copied"; setTimeout(function () { copy.textContent = "Copy address"; }, 1800); };
      var select = function () {
        var r = document.createRange(); r.selectNodeContents($("#email-text"));
        var s = getSelection(); s.removeAllRanges(); s.addRange(r);
        copy.textContent = "Selected, press copy";
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(p.email).then(done, select);
      else select();
    });
  }

  var form = $("#contact-form");
  if (form) {
    var status = $("#form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status";
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = { name: form.elements.name.value.trim(), email: form.elements.email.value.trim(), message: form.elements.message.value.trim() };
      var endpoint = SITE.profile.formEndpoint;
      if (endpoint) {
        status.textContent = "Sending…";
        fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
          .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); status.textContent = "Message sent. I usually reply within a couple of days."; status.classList.add("ok"); })
          .catch(function () { status.textContent = "The message did not send. Email me directly at " + SITE.profile.email + "."; });
        return;
      }
      // No endpoint configured: hand the message to the visitor's own email app.
      var href = "mailto:" + SITE.profile.email +
        "?subject=" + encodeURIComponent("Portfolio message from " + data.name) +
        "&body=" + encodeURIComponent(data.message + "\n\n" + data.name + "\n" + data.email);
      status.textContent = "Your email app should open with this message filled in. If nothing opens, copy the address on this page and paste the message in.";
      window.location.href = href;
    });
  }

  /* ---------- Reveal on scroll (from a visible state) ---------- */
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.9) { el.classList.add("reveal"); io.observe(el); }
    });
  }

  /* ---------- Subtle 3D tilt on cards, mouse only ---------- */
  if (!reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", (x * 7).toFixed(2) + "deg");
        card.style.setProperty("--rx", (-y * 7).toFixed(2) + "deg");
      });
      card.addEventListener("pointerleave", function () { card.style.removeProperty("--rx"); card.style.removeProperty("--ry"); });
    });
  }

  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
