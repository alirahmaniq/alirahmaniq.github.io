(function () {
  "use strict";

  // Theme toggle: respects OS preference until the user overrides, then persists.
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  if (stored === "dark" || stored === "light") root.setAttribute("data-theme", stored);

  var tg = document.getElementById("tg");
  if (tg) {
    tg.addEventListener("click", function () {
      var now = root.getAttribute("data-theme");
      if (!now) now = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      var next = now === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // Current year in the footer.
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  // Typewriter effect on the hero tagline.
  var typed = document.querySelector(".thesis .typed");
  if (typed) {
    var txt = typed.getAttribute("data-text") || "";
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      typed.textContent = txt;
    } else {
      typed.textContent = "";
      typed.classList.add("caret");
      var i = 0;
      var tick = function () {
        typed.textContent = txt.slice(0, ++i);
        if (i < txt.length) setTimeout(tick, 55);
        else setTimeout(function () { typed.classList.remove("caret"); }, 1200);
      };
      setTimeout(tick, 400);
    }
  }

  // Email: shown obfuscated in the HTML, assembled into a real mailto only here
  // so scrapers reading the source never see the address.
  document.querySelectorAll(".email-link").forEach(function (el) {
    var u = el.getAttribute("data-u");
    var d = el.getAttribute("data-d");
    if (u && d) el.setAttribute("href", "mailto:" + u + "@" + d);
  });

  // Lightweight YouTube embed: a .vid card with data-yt loads the player on click.
  var CHANNEL = "https://www.youtube.com/@AliRahmaniQ";
  var cards = document.querySelectorAll(".vid[data-yt]");
  cards.forEach(function (card) {
    var id = card.getAttribute("data-yt");
    if (!id) return;
    var thumb = card.querySelector(".vthumb");
    if (!thumb) return;

    // Placeholder id: keep the SVG art, just send clicks to the channel.
    if (/^PLACEHOLDER/i.test(id)) {
      thumb.style.cursor = "pointer";
      thumb.setAttribute("role", "link");
      thumb.setAttribute("tabindex", "0");
      thumb.setAttribute("aria-label", "Open YouTube channel");
      var go = function () { window.open(CHANNEL, "_blank", "noopener"); };
      thumb.addEventListener("click", go);
      thumb.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
      });
      return;
    }

    // Use the video's real thumbnail if none was provided.
    if (!thumb.querySelector("img")) {
      var img = document.createElement("img");
      img.loading = "lazy";
      img.alt = "";
      img.src = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
      thumb.insertBefore(img, thumb.firstChild);
    }

    thumb.setAttribute("role", "button");
    thumb.setAttribute("tabindex", "0");
    thumb.setAttribute("aria-label", "Play video");

    function load() {
      var frame = document.createElement("iframe");
      frame.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      frame.title = "YouTube video player";
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      frame.allowFullscreen = true;
      thumb.innerHTML = "";
      thumb.appendChild(frame);
    }

    thumb.addEventListener("click", load);
    thumb.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); load(); }
    });
  });

  // Photo lightbox: any link with [data-full] opens the large image with prev/next.
  var photos = Array.prototype.slice.call(document.querySelectorAll("a[data-full]"));
  if (photos.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML =
      '<button class="lb-btn lb-close" aria-label="Close">✕</button>' +
      '<button class="lb-btn lb-prev" aria-label="Previous">‹</button>' +
      '<img alt="">' +
      '<button class="lb-btn lb-next" aria-label="Next">›</button>' +
      '<div class="lb-count"></div>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector("img");
    var lbCount = lb.querySelector(".lb-count");
    var idx = 0;

    function show(i) {
      idx = (i + photos.length) % photos.length;
      lbImg.src = photos[idx].getAttribute("data-full");
      lbCount.textContent = (idx + 1) + " / " + photos.length;
    }
    function open(i) { show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
    function close() { lb.classList.remove("open"); document.body.style.overflow = ""; lbImg.src = ""; }

    photos.forEach(function (a, i) {
      a.addEventListener("click", function (e) { e.preventDefault(); open(i); });
    });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); show(idx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(idx - 1);
      else if (e.key === "ArrowRight") show(idx + 1);
    });
  }
})();
