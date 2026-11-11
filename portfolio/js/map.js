/*
  The home page map. No map library: js/map-data.js holds pre-projected SVG paths
  (Web Mercator, 10 map units per degree of longitude) and this file moves the viewBox.

  To add a place: add a view to VIEWS, a pin to PINS, and give projects in content.js a matching `place`.
*/
(function () {
  "use strict";
  var D = window.MAP_DATA, SITE = window.SITE;
  var stage = document.getElementById("stage");
  if (!D || !stage) return;

  var W = D.W, NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var panel = document.getElementById("map-panel");
  var crumbs = document.getElementById("frame-path");
  var hint = document.getElementById("stage-hint");

  function project(lon, lat) {
    var phi = lat * Math.PI / 180;
    return [(lon + 180) / 360 * W, W / 2 - W / (2 * Math.PI) * Math.log(Math.tan(Math.PI / 4 + phi / 2))];
  }
  function unproject(x, y) {
    return [x / W * 360 - 180, (2 * Math.atan(Math.exp((W / 2 - y) * 2 * Math.PI / W)) - Math.PI / 2) * 180 / Math.PI];
  }

  /* ---------- Views: bounds are [west, south, east, north] in degrees ---------- */
  var VIEWS = {
    world: {
      label: "world", parent: null,
      bounds: [-168, -55, 178, 74], narrow: [-128, -38, 45, 60],
      hot: { countries: { "840": "usa", "724": "spain", "076": "brazil" } }
    },
    usa: {
      label: "usa", parent: "world",
      bounds: [-125, 24, -66.5, 50], narrow: [-99, 35, -73, 50],
      layers: ["states"], gone: ["840"], dim: true,
      hot: { states: { "26": "michigan", "55": "wisconsin" } }
    },
    michigan: {
      label: "michigan", parent: "usa",
      bounds: [-84.3, 41.93, -83.2, 42.6], narrow: [-84.12, 41.98, -83.42, 42.48],
      layers: ["states", "counties"], gone: ["840"], dim: true,
      here: { counties: ["26161"] }
    },
    wisconsin: {
      label: "wisconsin", parent: "usa",
      bounds: [-93.4, 42.3, -86.2, 47.2],
      layers: ["states"], gone: ["840"], dim: true,
      here: { states: ["55"] }
    },
    spain: {
      label: "spain", parent: "world",
      bounds: [-10.5, 35.5, 4.8, 44.4],
      here: { countries: ["724"] }
    },
    brazil: {
      label: "brazil", parent: "world",
      bounds: [-76, -35, -32, 7],
      here: { countries: ["076"] }, leadsTo: "about.html"
    }
  };

  /* ---------- Pins: `go` zooms to another view, `group` highlights a block in the side panel ---------- */
  var PINS = [
    { view: "world", lon: -98.5, lat: 39.5, name: "United States", go: "usa" },
    { view: "world", lon: -3.7, lat: 40.2, name: "Spain", go: "spain" },
    { view: "world", lon: -52, lat: -11, name: "Brazil", go: "brazil" },
    { view: "usa", lon: -84.75, lat: 43.5, name: "Michigan", go: "michigan" },
    { view: "usa", lon: -89.9, lat: 44.6, name: "Wisconsin", go: "wisconsin", flip: true },
    { view: "michigan", lon: -83.743, lat: 42.2808, name: "Ann Arbor", group: "annarbor" },
    { view: "michigan", lon: -83.7816, lat: 42.1667, name: "Saline", group: "saline" },
    { view: "wisconsin", lon: -87.9065, lat: 43.0389, name: "Milwaukee", group: "milwaukee", flip: true },
    { view: "spain", lon: -1.9812, lat: 43.3183, name: "San Sebastián", group: "sansebastian", flip: true }
  ];
  var LABELS = [{ view: "michigan", lon: -83.98, lat: 42.4, text: "Washtenaw County" }];
  D.counties.forEach(function (c) {
    var ll = unproject(c[3], c[4]), b = VIEWS.michigan.bounds;
    if (c[0] !== "26161" && ll[0] > b[0] && ll[0] < b[2] && ll[1] > b[1] && ll[1] < b[3]) {
      LABELS.push({ view: "michigan", x: c[3], y: c[4], text: c[1] });
    }
  });

  /* ---------- Build the SVG ---------- */
  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
  var layers = {}, paths = { countries: {}, states: {}, counties: {} };
  ["countries", "states", "counties"].forEach(function (name) {
    var g = document.createElementNS(NS, "g");
    g.setAttribute("class", "layer " + name + (name === "countries" ? "" : " off"));
    D[name].forEach(function (f) {
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", f[2]);
      p.setAttribute("data-id", f[0]);
      g.appendChild(p);
      paths[name][f[0]] = p;
    });
    svg.appendChild(g);
    layers[name] = g;
  });
  stage.insertBefore(svg, stage.firstChild);

  PINS.forEach(function (pin) {
    var xy = project(pin.lon, pin.lat);
    pin.x = xy[0]; pin.y = xy[1];
    var b = document.createElement("button");
    b.type = "button";
    b.className = "pin off" + (pin.flip ? " flip" : "");
    b.innerHTML = '<span class="dot"></span><span class="name"></span>';
    b.lastChild.textContent = pin.name;
    if (pin.go) b.setAttribute("aria-label", pin.name + ": zoom in");
    b.addEventListener("click", function () { pin.go ? go(pin.go, true) : selectGroup(pin.group); });
    stage.appendChild(b);
    pin.el = b;
  });
  LABELS.forEach(function (l) {
    if (l.x == null) { var xy = project(l.lon, l.lat); l.x = xy[0]; l.y = xy[1]; }
    var s = document.createElement("span");
    s.className = "maplabel off";
    s.textContent = l.text;
    stage.appendChild(s);
    l.el = s;
  });

  /* ---------- Camera ---------- */
  var current = "world", cam = null, raf = 0;

  function aspect() { return stage.clientWidth / Math.max(1, stage.clientHeight); }

  function fit(id) {
    var v = VIEWS[id], narrow = stage.clientWidth < 620 && v.narrow;
    var b = narrow ? v.narrow : v.bounds;
    var a = project(b[0], b[3]), c = project(b[2], b[1]);
    var w = (c[0] - a[0]) * 1.1, h = (c[1] - a[1]) * 1.1, asp = aspect();
    if (w / h < asp) w = h * asp;
    return [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, w];
  }

  function apply(c) {
    cam = c;
    var sw = stage.clientWidth, sh = stage.clientHeight;
    var w = c[2], h = w * sh / sw, x0 = c[0] - w / 2, y0 = c[1] - h / 2, k = sw / w;
    svg.setAttribute("viewBox", x0 + " " + y0 + " " + w + " " + h);
    PINS.forEach(function (p) {
      p.el.style.transform = "translate(" + ((p.x - x0) * k).toFixed(1) + "px," + ((p.y - y0) * k).toFixed(1) + "px)" + (p.flip ? " translateX(-100%)" : "");
    });
    LABELS.forEach(function (l) {
      l.el.style.transform = "translate(" + ((l.x - x0) * k).toFixed(1) + "px," + ((l.y - y0) * k).toFixed(1) + "px) translate(-50%,-50%)";
    });
  }

  // Smooth zoom-and-pan path (van Wijk and Nuij), the same curve mapping libraries use.
  function zoomPath(p0, p1) {
    var rho = 1.3, rho2 = rho * rho, rho4 = rho2 * rho2;
    var dx = p1[0] - p0[0], dy = p1[1] - p0[1], d2 = dx * dx + dy * dy, w0 = p0[2], w1 = p1[2], S, f;
    var cosh = Math.cosh, sinh = Math.sinh, tanh = Math.tanh;
    if (d2 < 1e-9) {
      S = Math.log(w1 / w0) / rho;
      f = function (t) { return [p0[0] + t * dx, p0[1] + t * dy, w0 * Math.exp(rho * t * S)]; };
    } else {
      var d1 = Math.sqrt(d2);
      var b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1);
      var b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1);
      var r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      f = function (t) {
        var s = t * S, c0 = cosh(r0), u = w0 / (rho2 * d1) * (c0 * tanh(rho * s + r0) - sinh(r0));
        return [p0[0] + u * dx, p0[1] + u * dy, w0 * c0 / cosh(rho * s + r0)];
      };
    }
    f.ms = Math.min(1500, Math.max(550, Math.abs(S) * 330));
    return f;
  }

  function fly(to, done) {
    cancelAnimationFrame(raf);
    if (reduce || !cam) { apply(to); if (done) done(); return; }
    var path = zoomPath(cam, to), start = performance.now();
    (function tick(now) {
      var t = Math.min(1, (now - start) / path.ms);
      var e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      apply(t === 1 ? to : path(e));
      if (t < 1) raf = requestAnimationFrame(tick); else if (done) done();
    })(start);
  }

  /* ---------- State ---------- */
  function setClasses(id) {
    var v = VIEWS[id];
    ["states", "counties"].forEach(function (n) {
      layers[n].classList.toggle("off", !(v.layers && v.layers.indexOf(n) >= 0));
    });
    layers.countries.classList.toggle("dim", !!v.dim);
    Object.keys(paths).forEach(function (n) {
      Object.keys(paths[n]).forEach(function (pid) {
        var p = paths[n][pid];
        var target = v.hot && v.hot[n] && v.hot[n][pid];
        p.classList.toggle("hot", !!target);
        p.classList.toggle("here", !!(v.here && v.here[n] && v.here[n].indexOf(pid) >= 0));
        if (n === "countries") p.classList.toggle("gone", !!(v.gone && v.gone.indexOf(pid) >= 0));
        p._target = target || null;
      });
    });
    PINS.forEach(function (p) {
      var on = p.view === id;
      p.el.classList.toggle("off", !on);
      p.el.tabIndex = on ? 0 : -1;
      if (p.group) p.el.setAttribute("aria-pressed", "false");
    });
    LABELS.forEach(function (l) { l.el.classList.toggle("off", l.view !== id); });
  }

  function renderCrumbs(id) {
    var chain = [];
    for (var k = id; k; k = VIEWS[k].parent) chain.unshift(k);
    crumbs.innerHTML = chain.map(function (k, i) {
      var last = i === chain.length - 1;
      return (i ? '<span class="sep" aria-hidden="true">/</span>' : "") +
        '<button type="button" data-go="' + k + '"' + (last ? ' aria-current="true"' : "") + ">" + VIEWS[k].label + "</button>";
    }).join("");
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function placeBtn(goId, title, sub) {
    return '<li><button type="button" class="place-btn" data-go="' + goId + '"><strong>' + title + "</strong><span>" + sub + "</span></button></li>";
  }
  function projectLinks(place) {
    return '<ul class="panel-list">' + SITE.projects.filter(function (p) { return p.place === place; }).map(function (p) {
      return '<li><a class="panel-link" href="projects.html#' + esc(p.id) + '">' +
        '<span class="metric">' + esc(p.metrics[0].value) + "</span><strong>" + esc(p.title) + "</strong><span>" + esc(p.org) + "</span></a></li>";
    }).join("") + "</ul>";
  }
  function back(id) {
    var parent = VIEWS[id].parent;
    var names = { world: "the world", usa: "the United States" };
    return parent ? '<button type="button" class="back" data-go="' + parent + '">Back to ' + names[parent] + "</button>" : "";
  }

  var PANELS = {
    world: function () {
      return '<h2 tabindex="-1">Where the work happened</h2><p>Three countries so far. Pick one on the map or in this list.</p>' +
        '<ul class="panel-list">' +
        placeBtn("usa", "United States", "Michigan and Wisconsin. College, research, and an internship.") +
        placeBtn("spain", "Spain", "San Sebastián. R&amp;D internship at CEIT.") +
        placeBtn("brazil", "Brazil", "Where my story starts. Opens the About page.") + "</ul>";
    },
    usa: function () {
      return '<h2 tabindex="-1">United States</h2><p>Two states. Michigan splits into college and high school when you zoom in.</p>' +
        '<ul class="panel-list">' +
        placeBtn("michigan", "Michigan", "Ann Arbor for college, Saline for high school.") +
        placeBtn("wisconsin", "Wisconsin", "Milwaukee Tool, summer 2026.") + "</ul>";
    },
    michigan: function () {
      return '<h2 tabindex="-1">Michigan</h2><p>Two towns about ten miles apart in Washtenaw County.</p>' +
        '<div class="panel-group" data-group="annarbor"><h3>Ann Arbor <small>College, 2023 to now</small></h3>' + projectLinks("annarbor") + "</div>" +
        '<div class="panel-group" data-group="saline"><h3>Saline <small>High school</small></h3>' + projectLinks("saline") + "</div>";
    },
    wisconsin: function () {
      return '<h2 tabindex="-1">Milwaukee, Wisconsin</h2><p>Summer 2026, on the electrical engineering team at Milwaukee Tool.</p>' +
        '<div class="panel-group" data-group="milwaukee">' + projectLinks("milwaukee") + "</div>";
    },
    spain: function () {
      return '<h2 tabindex="-1">San Sebastián, Spain</h2><p>Summer 2025, at the CEIT technology center on the Basque coast.</p>' +
        '<div class="panel-group" data-group="sansebastian">' + projectLinks("sansebastian") + "</div>";
    },
    brazil: function () {
      return '<h2 tabindex="-1">Brazil</h2><p>Where my story starts.</p>' +
        '<ul class="panel-list"><li><a class="panel-link" href="about.html"><strong>About me</strong><span>Background, strengths, and skills.</span></a></li></ul>';
    }
  };

  function selectGroup(group) {
    PINS.forEach(function (p) { if (p.group) p.el.setAttribute("aria-pressed", String(p.group === group)); });
    panel.querySelectorAll(".panel-group").forEach(function (g) {
      var on = g.getAttribute("data-group") === group;
      g.classList.toggle("lit", on);
      if (on && g.scrollIntoView) g.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
    });
  }

  function showCenter() {
    if (!hint || !cam) return;
    var ll = unproject(cam[0], cam[1]);
    hint.textContent = Math.abs(ll[1]).toFixed(2) + "° " + (ll[1] >= 0 ? "N" : "S") + ", " + Math.abs(ll[0]).toFixed(2) + "° " + (ll[0] >= 0 ? "E" : "W");
  }

  function go(id, byUser) {
    if (!VIEWS[id]) id = "world";
    var moved = id !== current;
    current = id;
    setClasses(id);
    renderCrumbs(id);
    panel.innerHTML = PANELS[id]() + back(id);
    if (byUser && moved) {
      var h = panel.querySelector("h2");
      if (h) h.focus({ preventScroll: true });
      try { history.replaceState(null, "", id === "world" || VIEWS[id].leadsTo ? location.pathname + location.search : "#" + id); } catch (e) { /* hash is a nicety */ }
    }
    fly(fit(id), function () {
      showCenter();
      if (byUser && VIEWS[id].leadsTo && current === id) window.location.href = VIEWS[id].leadsTo;
    });
  }

  /* ---------- Events ---------- */
  svg.addEventListener("click", function (e) {
    var t = e.target._target;
    if (t) go(t, true);
  });
  svg.addEventListener("mouseover", function (e) { lightPin(e.target._target, true); });
  svg.addEventListener("mouseout", function (e) { lightPin(e.target._target, false); });
  function lightPin(target, on) {
    if (!target) return;
    PINS.forEach(function (p) { if (p.go === target && p.view === current) p.el.classList.toggle("lit", on); });
  }
  function onGoClick(e) {
    var b = e.target.closest("[data-go]");
    if (b && b.getAttribute("aria-current") !== "true") go(b.getAttribute("data-go"), true);
  }
  panel.addEventListener("click", onGoClick);
  crumbs.addEventListener("click", onGoClick);
  // Hovering a list entry lights the matching shape on the map.
  function lightPath(e, on) {
    var b = e.target.closest && e.target.closest(".place-btn");
    if (!b) return;
    var id = b.getAttribute("data-go"), v = VIEWS[current];
    Object.keys(v.hot || {}).forEach(function (n) {
      Object.keys(v.hot[n]).forEach(function (pid) { if (v.hot[n][pid] === id) paths[n][pid].classList.toggle("lit", on); });
    });
  }
  panel.addEventListener("mouseover", function (e) { lightPath(e, true); });
  panel.addEventListener("mouseout", function (e) { lightPath(e, false); });
  panel.addEventListener("focusin", function (e) { lightPath(e, true); });
  panel.addEventListener("focusout", function (e) { lightPath(e, false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && VIEWS[current].parent && (stage.contains(document.activeElement) || panel.contains(document.activeElement))) go(VIEWS[current].parent, true);
  });

  var resizeTimer;
  function onResize() { clearTimeout(resizeTimer); resizeTimer = setTimeout(function () { cancelAnimationFrame(raf); apply(fit(current)); }, 60); }
  if ("ResizeObserver" in window) new ResizeObserver(onResize).observe(stage); else window.addEventListener("resize", onResize);
  // Coming back with the browser's back button after Brazil sent the visitor to About: reset to the world.
  window.addEventListener("pageshow", function (e) { if (e.persisted && VIEWS[current].leadsTo) { cam = null; go("world"); } });

  var start = (location.hash || "").slice(1);
  if (!VIEWS[start] || VIEWS[start].leadsTo) start = "world";
  apply(fit(start));
  go(start);
  showCenter();
})();
