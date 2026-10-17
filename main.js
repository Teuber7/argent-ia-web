(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
  var escHTML = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "] failed:", e); }
  }
  function fmtMoney(n) {
    return "$" + Math.round(n).toLocaleString("es-AR");
  }
  function fmtNum(n) {
    return Math.round(n).toLocaleString("es-AR");
  }

  /* ---------------------------------------------------------------
     Icon set — minimal line icons, 24x24, stroke=currentColor
  --------------------------------------------------------------- */
  var ICONS = {
    invoice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h9l3 3v17H6z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H5l-2 2v-2.6A8.5 8.5 0 1 1 21 11.5Z"/><circle cx="8.5" cy="12" r=".6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r=".6" fill="currentColor" stroke="none"/><circle cx="15.5" cy="12" r=".6" fill="currentColor" stroke="none"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M11 20V4M18 20v-7"/><path d="M4 20h16"/></svg>',
    database: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>',
    bank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10 12 4l9 6"/><path d="M5 10v9M10 10v9M14 10v9M19 10v9"/><path d="M3 21h18"/></svg>',
    document: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 2h7l5 5v15H7z"/><path d="M14 2v5h5"/><path d="m9.5 13 1.8 1.8L15 11"/></svg>',
    budget: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6M7 17h4"/></svg>',
    crm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><path d="M16.5 5.5a3.2 3.2 0 0 1 0 6.2M21.2 20a5.6 5.6 0 0 0-4.6-6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  /* ---------------------------------------------------------------
     Mounts (idempotent — fill HTML if empty)
  --------------------------------------------------------------- */
  function mountBrandText() {
    $$("[data-brand-name]").forEach(function (el) { el.textContent = data.name || ""; });
    $$("[data-brand-tagline]").forEach(function (el) { el.textContent = data.tagline || ""; });
    $$("[data-brand-email]").forEach(function (el) {
      el.textContent = data.email || "";
      if (el.tagName === "A") el.href = "mailto:" + data.email;
    });
    var yearEl = $("[data-year]");
    if (yearEl) yearEl.textContent = data.year || new Date().getFullYear();
  }

  function mountNav() {
    var target = $("[data-nav-links]");
    if (!target || target.children.length > 0 || !data.nav) return;
    target.innerHTML = data.nav.map(function (n) {
      return '<a class="nav-link" href="' + n.href + '">' + escHTML(n.label) + "</a>";
    }).join("");
    var mtarget = $("[data-nav-mobile-links]");
    if (mtarget && mtarget.children.length === 0) {
      mtarget.innerHTML = data.nav.map(function (n) {
        return '<a href="' + n.href + '">' + escHTML(n.label) + "</a>";
      }).join("");
    }
  }

  function mountProblem() {
    var ex = data.problemExample || {};
    var employees = ex.employees || 10, hpd = ex.hoursPerDay || 2, cost = ex.hourlyCost || 6000;
    var dailyHours = employees * hpd;
    var yearlyHours = dailyHours * 5 * 52;
    var yearlyMoney = yearlyHours * cost;

    var elEmployees = $("[data-problem-employees]");
    if (elEmployees) elEmployees.textContent = employees;
    var elHpd = $("[data-problem-hpd]");
    if (elHpd) elHpd.textContent = hpd;

    var kHours = $("[data-problem-hours]");
    if (kHours) kHours.setAttribute("data-count-to", yearlyHours);
    var kMoney = $("[data-problem-money]");
    if (kMoney) kMoney.setAttribute("data-count-to", yearlyMoney);
    var kDaily = $("[data-problem-daily]");
    if (kDaily) kDaily.setAttribute("data-count-to", dailyHours);
  }

  function solutionCard(s) {
    var before = s.before.map(function (step) { return '<li class="sol-flow-step">' + escHTML(step) + "</li>"; }).join("");
    var after = s.after.map(function (step) { return '<li class="sol-flow-step">' + escHTML(step) + "</li>"; }).join("");
    return (
      '<article class="sol-card glass" data-reveal>' +
      '<div class="sol-icon">' + (ICONS[s.icon] || "") + "</div>" +
      '<span class="sol-tag">' + escHTML(s.tag) + "</span>" +
      "<h3>" + escHTML(s.title) + "</h3>" +
      '<p class="desc">' + escHTML(s.desc) + "</p>" +
      '<div class="sol-flow">' +
      '<div class="sol-flow-col before"><div class="sol-flow-label">Hoy</div><ul>' + before + "</ul></div>" +
      '<div class="sol-flow-col after"><div class="sol-flow-label">Con Argent IA</div><ul>' + after + "</ul></div>" +
      "</div>" +
      '<div class="sol-time"><span class="before">' + escHTML(s.timeBefore) + '</span><span>&#8594;</span><span class="after">' + escHTML(s.timeAfter) + "</span></div>" +
      '<p class="sol-savings">' + escHTML(s.savingsLabel || "") + "</p>" +
      "</article>"
    );
  }

  function mountSolutions() {
    var target = $("[data-solutions]");
    if (!target || target.children.length > 0 || !data.solutions) return;
    target.innerHTML = data.solutions.map(solutionCard).join("");
  }

  function mountProcess() {
    var target = $("[data-process]");
    if (!target || target.children.length > 0 || !data.process) return;
    target.innerHTML = data.process.map(function (p) {
      return (
        '<div class="process-item" data-reveal>' +
        '<div class="process-num">' + escHTML(p.n) + "</div>" +
        "<div><h3>" + escHTML(p.title) + "</h3><p>" + escHTML(p.desc) + "</p></div>" +
        "</div>"
      );
    }).join("");
  }

  function mountTech() {
    var target = $("[data-tech-track]");
    if (!target || target.children.length > 0 || !data.tech) return;
    var badges = data.tech.map(function (t) { return '<span class="tech-badge">' + escHTML(t) + "</span>"; }).join("");
    target.innerHTML = badges;
    target.setAttribute("data-marquee", "");
  }

  function mountFaq() {
    var target = $("[data-faq]");
    if (!target || target.children.length > 0 || !data.faqs) return;
    target.innerHTML = data.faqs.map(function (f, i) {
      return (
        '<div class="faq-item" data-reveal>' +
        '<button class="faq-q" aria-expanded="false" data-faq-toggle>' +
        "<span>" + escHTML(f.q) + "</span>" +
        '<span class="faq-plus" aria-hidden="true"></span>' +
        "</button>" +
        '<div class="faq-a"><div class="faq-a-inner">' + escHTML(f.a) + "</div></div>" +
        "</div>"
      );
    }).join("");
  }

  /* ---------------------------------------------------------------
     Cursor
  --------------------------------------------------------------- */
  function initCursor() {
    var root = $("[data-cursor-root]");
    if (!root || !fineHover) return;
    document.documentElement.classList.add("has-cursor");
    var ring = root.querySelector(".cursor-ring");
    var dot = root.querySelector(".cursor-dot");
    var tx = 0, ty = 0, rx = 0, ry = 0, firstMove = false;

    window.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (dot) dot.style.transform = "translate3d(" + tx + "px," + ty + "px,0)";
      if (!firstMove) {
        firstMove = true; rx = tx; ry = ty;
        if (ring) ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
        root.classList.add("is-ready");
      }
    }, { passive: true });

    function tick() {
      rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
      if (ring) ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    var HOVERABLES = "[data-cursor], .btn, a[href], .sol-card, .faq-q, button";
    document.addEventListener("mouseover", function (e) { if (e.target.closest && e.target.closest(HOVERABLES)) root.classList.add("is-interactive"); });
    document.addEventListener("mouseout", function (e) {
      var related = e.relatedTarget;
      if (e.target.closest && e.target.closest(HOVERABLES) && !(related && related.closest && related.closest(HOVERABLES))) {
        root.classList.remove("is-interactive");
      }
    });
  }

  /* ---------------------------------------------------------------
     Nav (scroll state + mobile menu)
  --------------------------------------------------------------- */
  function initNav() {
    var nav = $(".nav");
    if (nav) {
      var onScroll = function () {
        if (scrollY > 60) nav.classList.add("is-scrolled"); else nav.classList.remove("is-scrolled");
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    var burger = $("[data-nav-burger]");
    var mobile = $("[data-nav-mobile]");
    if (burger && mobile) {
      burger.addEventListener("click", function () {
        var open = mobile.getAttribute("data-open") === "true";
        mobile.setAttribute("data-open", open ? "false" : "true");
        document.body.style.overflow = open ? "" : "hidden";
      });
      $$("a", mobile).forEach(function (a) {
        a.addEventListener("click", function () {
          mobile.setAttribute("data-open", "false");
          document.body.style.overflow = "";
        });
      });
    }
  }

  function initSmoothAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navOffset = 76;
      window.scrollTo({
        top: el.getBoundingClientRect().top + scrollY - navOffset,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  /* ---------------------------------------------------------------
     Hero mouse-reactive gradient
  --------------------------------------------------------------- */
  function initHeroGradient() {
    var hero = $(".hero");
    if (!hero) return;
    var mx = 30, my = 30, tx = 30, ty = 30;
    function setFromEvent(clientX, clientY) {
      tx = (clientX / innerWidth) * 100;
      ty = (clientY / innerHeight) * 100;
    }
    window.addEventListener("mousemove", function (e) { setFromEvent(e.clientX, e.clientY); }, { passive: true });
    function frame() {
      mx += (tx - mx) * 0.045;
      my += (ty - my) * 0.045;
      document.documentElement.style.setProperty("--mx", mx + "%");
      document.documentElement.style.setProperty("--my", my + "%");
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------------
     Particles (intrusive → gated by reduced-motion)
  --------------------------------------------------------------- */
  function initParticles() {
    if (reduced) return;
    var host = $("[data-particles]");
    if (!host) return;
    var canvas = document.createElement("canvas");
    canvas.className = "particles";
    host.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(devicePixelRatio || 1, 1.5);
    var particles = [];
    var COUNT = 60;

    function resize() {
      canvas.width = host.clientWidth * dpr;
      canvas.height = host.clientHeight * dpr;
      canvas.style.width = host.clientWidth + "px";
      canvas.style.height = host.clientHeight + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * host.clientWidth,
        y: Math.random() * host.clientHeight,
        r: 0.5 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.06 - Math.random() * 0.2,
        a: 0.12 + Math.random() * 0.35
      });
    }

    function frame() {
      var w = host.clientWidth, h = host.clientHeight;
      ctx.clearRect(0, 0, w, h);
      for (var j = 0; j < particles.length; j++) {
        var p = particles[j];
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.fillStyle = "rgba(199,203,214," + p.a + ")";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------------
     Reveal on scroll
  --------------------------------------------------------------- */
  function initReveals() {
    var els = $$("[data-reveal], [data-reveal-scale]");
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-revealed"); io.unobserve(e.target); }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    els.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      $$("[data-reveal]:not(.is-revealed), [data-reveal-scale]:not(.is-revealed)").forEach(function (el) {
        if (el.getBoundingClientRect().top < innerHeight) el.classList.add("is-revealed");
      });
    }, 6000);
  }

  /* ---------------------------------------------------------------
     Tilt on solution + case cards
  --------------------------------------------------------------- */
  function initTilt() {
    if (!fineHover) return;
    $$(".sol-card").forEach(function (card) {
      var MAX = 6, tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        tx = -py * MAX; ty = px * MAX;
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
        if (!raf) raf = requestAnimationFrame(loop);
      });
      card.addEventListener("mouseleave", function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
      function loop() {
        cx += (tx - cx) * 0.15; cy += (ty - cy) * 0.15;
        card.style.setProperty("--rx", cx.toFixed(2) + "deg");
        card.style.setProperty("--ry", cy.toFixed(2) + "deg");
        raf = (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) ? requestAnimationFrame(loop) : null;
      }
    });
  }

  /* ---------------------------------------------------------------
     Count-up numbers
  --------------------------------------------------------------- */
  function initCountUp() {
    $$("[data-count-to]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      if (isNaN(target)) return;
      var isMoney = el.hasAttribute("data-count-money");
      var trigger = function () {
        var start = null, dur = 1500;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min(1, (ts - start) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target * eased;
          el.textContent = isMoney ? fmtMoney(val) : fmtNum(val);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      };
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { trigger(); io.unobserve(e.target); } });
      }, { threshold: 0.3 });
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------------
     Split text reveal (headlines)
  --------------------------------------------------------------- */
  function splitWords(el) {
    el.setAttribute("aria-label", el.textContent.trim().replace(/\s+/g, " "));
    var wrap = function (text) {
      return text.split(/(\s+)/).map(function (w) {
        return /^\s+$/.test(w) ? w : '<span class="split-word" aria-hidden="true">' + escHTML(w) + "</span>";
      }).join("");
    };
    var html = Array.prototype.map.call(el.childNodes, function (node) {
      if (node.nodeType === 3) return wrap(node.textContent);
      if (node.nodeName === "BR") return "<br>";
      if (node.nodeType === 1) {
        // Treat the whole element (e.g. a gradient-text <span>) as one atomic
        // unit so nested markup/background-clip isn't broken by re-wrapping.
        var holder = document.createElement("span");
        holder.className = "split-word";
        holder.setAttribute("aria-hidden", "true");
        holder.appendChild(node.cloneNode(true));
        return holder.outerHTML;
      }
      return "";
    }).join("");
    el.innerHTML = html;
    return el.querySelectorAll(".split-word");
  }

  function initSplitText() {
    var els = $$("[data-split]");
    if (!els.length) return;
    els.forEach(function (el) {
      var parts = splitWords(el);
      Array.prototype.forEach.call(parts, function (p, i) {
        p.style.opacity = "0";
        p.style.transform = "translateY(18px)";
        p.style.transition = "opacity .7s " + (i * 0.035) + "s var(--ease-out), transform .7s " + (i * 0.035) + "s var(--ease-out)";
      });
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          Array.prototype.forEach.call(parts, function (p) {
            p.style.opacity = "1";
            p.style.transform = "none";
          });
        });
      });
    });
  }

  /* ---------------------------------------------------------------
     Scroll progress bar
  --------------------------------------------------------------- */
  function initScrollProgress() {
    var bar = $("[data-scroll-progress]");
    if (!bar) return;
    var raf = null;
    function update() {
      var max = document.documentElement.scrollHeight - innerHeight;
      var pct = max > 0 ? scrollY / max : 0;
      bar.style.transform = "scaleX(" + pct + ")";
      raf = null;
    }
    window.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    update();
  }

  /* ---------------------------------------------------------------
     Scroll-linked FX (GSAP + ScrollTrigger)
     - Hero parallax (content drifts up + fades while leaving)
     - Parallax orbs at different speeds
     - Pinned scroll-storytelling in "Problema"
     - Process rail that draws itself
     - CTA final scale-in
  --------------------------------------------------------------- */
  function initScrollFX() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // Scrub effects are user-driven (they only move with the user's own
    // scroll), so they run under prefers-reduced-motion too — just softened.
    // Only autonomous motion (particles, orb float, mesh spin) is fully gated.
    var AMP = reduced ? 0.35 : 1;

    /* Parallax orbs — subtle, every viewport */
    $$("[data-parallax]").forEach(function (orb) {
      var amount = (parseFloat(orb.getAttribute("data-parallax")) || -20) * AMP;
      var scope = orb.closest("section") || orb.parentElement;
      gsap.to(orb, {
        yPercent: amount, ease: "none",
        scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    /* Hero parallax */
    var heroContent = $("[data-hero-content]");
    if (heroContent) {
      gsap.to(heroContent, {
        yPercent: -28 * AMP, opacity: 0, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "75% top", scrub: true }
      });
    }
    var cue = $(".scroll-cue");
    if (cue) {
      gsap.to(cue, {
        opacity: 0, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "20% top", scrub: true }
      });
    }

    /* Pinned storytelling — Problema (desktop only) */
    var story = $("[data-story]");
    var lines = $$("[data-story-line]");
    if (story && lines.length && innerWidth >= 960) {
      document.documentElement.classList.add("has-storyfx");
      lines.forEach(function (line) {
        line.removeAttribute("data-reveal");
        line.classList.add("is-revealed");
      });
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: story,
          start: "top 30%",
          end: "+=" + Math.round(lines.length * (reduced ? 200 : 300)),
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
      lines.forEach(function (line, i) {
        tl.fromTo(line,
          { opacity: 0.07, y: 44 * AMP, filter: reduced ? "none" : "blur(6px)" },
          { opacity: 1, y: 0, filter: reduced ? "none" : "blur(0px)", duration: 1, ease: "none" },
          i);
      });
    }

    /* Process rail draws with scroll + items activate */
    var rail = $("[data-process-rail]");
    if (rail) {
      gsap.fromTo(rail, { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: ".process-wrap", start: "top 72%", end: "bottom 40%", scrub: 0.4 }
      });
    }
    $$(".process-item").forEach(function (item) {
      ScrollTrigger.create({
        trigger: item, start: "top 62%",
        onEnter: function () { item.classList.add("is-active"); },
        onLeaveBack: function () { item.classList.remove("is-active"); }
      });
    });

    /* CTA final — scale in while approaching */
    var ctaContent = $("[data-cta-content]");
    if (ctaContent) {
      gsap.fromTo(ctaContent, { scale: 1 - 0.06 * AMP, opacity: 0.25 }, {
        scale: 1, opacity: 1, ease: "none",
        scrollTrigger: { trigger: ".cta-final", start: "top 90%", end: "top 32%", scrub: 0.4 }
      });
    }

    /* Section heads drift slightly slower than the page (depth) */
    $$(".section-head").forEach(function (head) {
      gsap.fromTo(head, { y: 46 * AMP }, {
        y: -14 * AMP, ease: "none",
        scrollTrigger: { trigger: head, start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    /* Solution cards — staggered cascade entrance */
    var solCards = $$(".sol-card");
    if (solCards.length) {
      solCards.forEach(function (c) { c.removeAttribute("data-reveal"); c.classList.add("is-revealed"); });
      gsap.set(solCards, { opacity: 0, y: 54, scale: 0.965 });
      ScrollTrigger.batch(solCards, {
        start: "top 88%",
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.09, ease: "power3.out", overwrite: true });
        }
      });
      // Safety net: anything still hidden after 6s becomes visible
      setTimeout(function () {
        solCards.forEach(function (c) {
          if (parseFloat(getComputedStyle(c).opacity) < 0.9 && c.getBoundingClientRect().top < innerHeight) {
            gsap.to(c, { opacity: 1, y: 0, scale: 1, duration: 0.5, overwrite: true });
          }
        });
      }, 6000);
    }

    /* "Vendemos tiempo." — gradient sweep linked to scroll */
    var ctaTag = $("[data-cta-tag]");
    if (ctaTag) {
      gsap.fromTo(ctaTag, { "--sweep": "110%" }, {
        "--sweep": "-10%", ease: "none",
        scrollTrigger: { trigger: ".cta-final", start: "top 80%", end: "bottom bottom", scrub: 0.4 }
      });
    }

    /* Footer wordmark — rises as it enters */
    var wordmark = $("[data-wordmark]");
    if (wordmark) {
      gsap.fromTo(wordmark, { y: 90 * AMP, opacity: 0.35 }, {
        y: 0, opacity: 1, ease: "none",
        scrollTrigger: { trigger: ".footer", start: "top 96%", end: "bottom bottom", scrub: 0.4 }
      });
    }
  }

  /* ---------------------------------------------------------------
     Scroll-spy — highlight active section link in nav
  --------------------------------------------------------------- */
  function initScrollSpy() {
    var links = $$(".nav-link");
    if (!links.length) return;
    var map = links.map(function (l) {
      return { link: l, sec: document.querySelector(l.getAttribute("href")) };
    }).filter(function (x) { return x.sec; });
    if (!map.length) return;
    var raf = null;
    function update() {
      var probe = innerHeight * 0.38;
      var active = null;
      map.forEach(function (x) {
        if (x.sec.getBoundingClientRect().top <= probe) active = x;
      });
      map.forEach(function (x) { x.link.classList.toggle("is-active", x === active); });
      raf = null;
    }
    window.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    update();
  }

  /* ---------------------------------------------------------------
     Marquee (tech stack)
  --------------------------------------------------------------- */
  function initMarquee() {
    $$("[data-marquee]").forEach(function (track) {
      if (track.dataset.marqueeBound) return;
      track.dataset.marqueeBound = "1";
      var clone = track.cloneNode(true);
      clone.removeAttribute("data-marquee");
      clone.removeAttribute("aria-hidden");
      clone.setAttribute("aria-hidden", "true");
      track.parentNode.appendChild(clone);
      var wrap = document.createElement("div");
      // wrap both in a flex container that scrolls together
      var BASE_SPEED = 40; // px per second
      var pos = 0;
      var last = null;
      var lastY = scrollY;
      var boost = 0;
      function step(ts) {
        if (last == null) last = ts;
        var dt = (ts - last) / 1000;
        last = ts;
        // scroll velocity feeds the marquee: scrollear rápido lo acelera.
        // Under reduced-motion it still moves (slower, no boost) — freezing
        // it entirely makes the site look broken on many Windows setups.
        var speed = BASE_SPEED * (reduced ? 0.5 : 1);
        if (!reduced) {
          var dy = Math.abs(scrollY - lastY);
          lastY = scrollY;
          boost += (Math.min(dy * 7, 260) - boost) * 0.055;
          speed += boost;
        }
        pos -= speed * dt;
        var w = track.scrollWidth + 42; // gap approx
        if (Math.abs(pos) >= w) pos = 0;
        track.style.transform = "translate3d(" + pos + "px,0,0)";
        clone.style.transform = "translate3d(" + (pos + w) + "px,0,0)";
        requestAnimationFrame(step);
      }
      clone.style.position = "absolute";
      clone.style.top = "0";
      clone.style.left = "0";
      track.parentNode.style.position = "relative";
      track.style.position = "relative";
      requestAnimationFrame(step);
    });
  }

  /* ---------------------------------------------------------------
     Calculadora de ahorro
  --------------------------------------------------------------- */
  function initCalculator() {
    var form = $("[data-calc-form]");
    if (!form) return;
    var employeesInput = $("[data-calc-employees]", form);
    var hoursInput = $("[data-calc-hours]", form);
    var costInput = $("[data-calc-cost]", form);
    if (!employeesInput || !hoursInput || !costInput) return;

    var outMonthlyMoney = $("[data-calc-monthly-money]");
    var outYearlyMoney = $("[data-calc-yearly-money]");
    var outYearlyHours = $("[data-calc-yearly-hours]");
    var outRecoverableMoney = $("[data-calc-recoverable-money]");
    var outRecoverableHours = $("[data-calc-recoverable-hours]");
    var outRoi = $("[data-calc-roi]");
    var outPayback = $("[data-calc-payback]");
    var outFte = $("[data-calc-fte]");

    var lastVals = {};

    function animateNumber(el, to, formatter) {
      if (!el) return;
      var from = lastVals[el] || 0;
      var start = null, dur = 700;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = from + (to - from) * eased;
        el.textContent = formatter(val);
        if (p < 1) requestAnimationFrame(step);
        else lastVals[el] = to;
      }
      requestAnimationFrame(step);
    }

    function calc() {
      var employees = Math.max(1, parseFloat(employeesInput.value) || 1);
      var hoursPerDay = Math.max(0.25, parseFloat(hoursInput.value) || 1);
      var hourlyCost = Math.max(500, parseFloat(costInput.value) || 6000);

      $("[data-calc-employees-val]") && ($("[data-calc-employees-val]").textContent = employees);
      $("[data-calc-hours-val]") && ($("[data-calc-hours-val]").textContent = hoursPerDay);
      $("[data-calc-cost-val]") && ($("[data-calc-cost-val]").textContent = fmtMoney(hourlyCost));

      var dailyHours = employees * hoursPerDay;
      var monthlyHours = dailyHours * 22;
      var yearlyHours = dailyHours * 5 * 52;
      var monthlyMoney = monthlyHours * hourlyCost;
      var yearlyMoney = yearlyHours * hourlyCost;

      var RECOVERY_RATE = 0.7;
      var recoverableHours = yearlyHours * RECOVERY_RATE;
      var recoverableMoney = yearlyMoney * RECOVERY_RATE;

      var estimatedInvestment = recoverableMoney * 0.15;
      var roi = estimatedInvestment > 0 ? (recoverableMoney - estimatedInvestment) / estimatedInvestment : 0;
      var paybackMonths = estimatedInvestment > 0 ? estimatedInvestment / (recoverableMoney / 12) : 0;
      var fte = recoverableHours / (8 * 260);

      if (outYearlyMoney) {
        outYearlyMoney.classList.remove("flash");
        void outYearlyMoney.offsetWidth; // reinicia la animación del glow
        outYearlyMoney.classList.add("flash");
      }

      animateNumber(outMonthlyMoney, monthlyMoney, fmtMoney);
      animateNumber(outYearlyMoney, yearlyMoney, fmtMoney);
      animateNumber(outYearlyHours, yearlyHours, fmtNum);
      animateNumber(outRecoverableMoney, recoverableMoney, fmtMoney);
      animateNumber(outRecoverableHours, recoverableHours, fmtNum);
      animateNumber(outFte, fte, function (v) { return v.toFixed(1); });
      if (outRoi) animateNumber(outRoi, roi, function (v) { return v.toFixed(1) + "x"; });
      if (outPayback) animateNumber(outPayback, paybackMonths, function (v) { return v.toFixed(1); });
    }

    [employeesInput, hoursInput, costInput].forEach(function (input) {
      input.addEventListener("input", calc);
    });
    calc();
  }

  /* ---------------------------------------------------------------
     Carruseles horizontales (soluciones)
  --------------------------------------------------------------- */
  function initCarousels() {
    $$("[data-carousel]").forEach(function (box) {
      var track = $(".carousel-track", box);
      var prev = $("[data-carousel-prev]", box);
      var next = $("[data-carousel-next]", box);
      if (!track || !prev || !next) return;

      function amount() { return Math.min(440, track.clientWidth * 0.85); }
      prev.addEventListener("click", function () { track.scrollBy({ left: -amount(), behavior: reduced ? "auto" : "smooth" }); });
      next.addEventListener("click", function () { track.scrollBy({ left: amount(), behavior: reduced ? "auto" : "smooth" }); });

      // Apagar las flechas cuando no hay más para ese lado
      function sync() {
        var max = track.scrollWidth - track.clientWidth;
        prev.disabled = track.scrollLeft <= 8;
        next.disabled = track.scrollLeft >= max - 8;
      }
      track.addEventListener("scroll", sync, { passive: true });
      window.addEventListener("resize", sync);
      sync();
    });
  }

  /* ---------------------------------------------------------------
     FAQ accordion
  --------------------------------------------------------------- */
  function initFaqAccordion() {
    var list = $("[data-faq]");
    if (!list) return;
    list.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest("[data-faq-toggle]");
      if (!btn) return;
      var item = btn.closest(".faq-item");
      var answer = item.querySelector(".faq-a");
      var isOpen = item.classList.contains("is-open");
      $$(".faq-item.is-open", list).forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove("is-open");
          openItem.querySelector(".faq-q").setAttribute("aria-expanded", "false");
          openItem.querySelector(".faq-a").style.maxHeight = "0px";
        }
      });
      if (isOpen) {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        answer.style.maxHeight = "0px";
      } else {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  }

  /* ---------------------------------------------------------------
     Boot
  --------------------------------------------------------------- */
  function boot() {
    safe(mountBrandText, "mountBrandText");
    safe(mountNav, "mountNav");
    safe(mountProblem, "mountProblem");
    safe(mountSolutions, "mountSolutions");
    safe(mountProcess, "mountProcess");
    safe(mountTech, "mountTech");
    safe(mountFaq, "mountFaq");

    safe(initCursor, "initCursor");
    safe(initNav, "initNav");
    safe(initSmoothAnchors, "initSmoothAnchors");
    safe(initHeroGradient, "initHeroGradient");
    safe(initParticles, "initParticles");
    safe(initScrollProgress, "initScrollProgress");
    safe(initScrollFX, "initScrollFX"); // before initReveals: story lines opt out of IO reveal
    safe(initScrollSpy, "initScrollSpy");
    safe(initReveals, "initReveals");
    safe(initTilt, "initTilt");
    safe(initCountUp, "initCountUp");
    safe(initSplitText, "initSplitText");
    safe(initMarquee, "initMarquee");
    safe(initCalculator, "initCalculator");
    safe(initCarousels, "initCarousels");
    safe(initFaqAccordion, "initFaqAccordion");

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
