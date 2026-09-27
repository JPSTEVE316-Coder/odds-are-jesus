/* ============================================================
   Odds Are Jesus — v2 app logic
   All combined odds computed in log-space. Nothing hardcoded.
   ============================================================ */
"use strict";

/* ---------- config ---------- */
const EMAIL_ENDPOINT = "https://docs.google.com/forms/d/e/1FAIpQLSf4WQaQZ6XEYI2BBryxEYLmo48nD9OG4jqo-VitWwI97iZkOA/formResponse"; // Google Form "Odds Are Jesus — Email Signup"; empty = honest "coming soon" fallback
const EMAIL_ENTRY = "entry.514691784"; // Email field id in that form
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const LOG_POP = Math.log10(POPULATION_EVER);

/* ---------- state ---------- */
let selected = new Set(); // start empty — the user taps prophecies to build the odds up
let globalS = 100;          // skepticism slider 1..100
let perVal = {};           // prophecy id -> 0..100 (per-card adjuster)
let merged = false;        // merge Zechariah 11:12-13 pair
PROPHECIES.forEach((p) => (perVal[p.id] = 100));

/* ---------- math engine (log-space) ---------- */
function perFactor(p) {
  // log-interpolate between floor (v=0) and base (v=100)
  const lb = Math.log10(p.base);
  const lf = Math.log10(p.floor);
  return Math.pow(10, (lf - lb) * (1 - perVal[p.id] / 100));
}
function adjustedOdds(p) {
  return Math.max(1, p.base * perFactor(p) * (globalS / 100));
}
function productLog10() {
  // returns { log10, terms } — terms = number of independent factors multiplied
  const sel = PROPHECIES.filter((p) => selected.has(p.id));
  if (!sel.length) return { log10: -Infinity, terms: 0 };
  const logs = sel.map((p) => Math.log10(adjustedOdds(p)));
  let terms = sel.length;
  if (merged) {
    const a = PROPHECIES.find((p) => p.id === 5);
    const b = PROPHECIES.find((p) => p.id === 6);
    if (selected.has(5) && selected.has(6)) {
      const i5 = sel.indexOf(a), i6 = sel.indexOf(b);
      const mergedLog = Math.max(logs[i5], logs[i6]); // larger odds of the two
      const rest = logs.filter((_, i) => i !== i5 && i !== i6);
      return { log10: rest.reduce((s, v) => s + v, 0) + mergedLog, terms: terms - 1 };
    }
  }
  return { log10: logs.reduce((s, v) => s + v, 0), terms };
}

/* ---------- formatting ---------- */
const ANCHORS = [
  [80, "more than atoms in the observable universe — roughly the Eddington estimate"],
  [18, "quintillion"],
  [17, "100 quadrillion"],
  [15, "quadrillion"],
  [12, "trillion"],
  [9, "billion"],
  [6, "million"],
];
function wordAnchor(exp) {
  for (const [e, w] of ANCHORS) if (exp >= e) return w;
  return "10 to the " + exp;
}
// full "1 in X" for log10 value -> {html, text, exp, mant}
function formatOdds(log10) {
  if (!isFinite(log10)) return { html: "—", text: "—", exp: null, mant: null };
  let exp = Math.floor(log10 + 1e-9);
  let mant = Math.pow(10, log10 - exp);
  if (mant >= 9.95) { mant = 1.0; exp += 1; }
  if (exp < 6) {
    const n = Math.round(Math.pow(10, log10)).toLocaleString("en-US");
    return { html: "1 in " + n, text: "1 in " + n, exp, mant: null };
  }
  const m = mant.toFixed(1);
  return {
    html: `1 in ${m}×10<sup>${exp}</sup>`,
    text: `1 in ${m}×10^${exp}`,
    exp, mant: m,
  };
}
function fmtInt(n) { return "1 in " + Math.round(n).toLocaleString("en-US"); }
// population as a plain count ("88 billion") — it is not odds, so never "1 in ..."
function formatCount(n) {
  if (n >= 1e9) return trim1(n / 1e9) + " billion";
  if (n >= 1e6) return trim1(n / 1e6) + " million";
  if (n >= 1e3) return trim1(n / 1e3) + " thousand";
  return String(Math.round(n));
}

// compact "314K / 2.4M / 8.8B" for tight spaces
function compactNum(n) {
  if (n >= 1e12) return trim1(n / 1e12) + "T";
  if (n >= 1e9) return trim1(n / 1e9) + "B";
  if (n >= 1e6) return trim1(n / 1e6) + "M";
  if (n >= 1e3) return trim1(n / 1e3) + "K";
  return String(Math.round(n));
}
function trim1(n) {
  const s = n.toFixed(1);
  return s.endsWith(".0") ? s.slice(0, -2) : s;
}
// expected number of chance-matches across history (when combined odds < 1)
function formatExpected(n) {
  const r = Math.round(n);
  const plural = r === 1 ? "person" : "people";
  let big;
  if (n >= 1e9) big = "≈ " + trim1(n / 1e9) + " billion";
  else if (n >= 1e6) big = "≈ " + trim1(n / 1e6) + " million";
  else big = "≈ " + r.toLocaleString("en-US");
  return {
    big,
    bar: "≈" + compactNum(n),
    anchor: `${plural} in all of history would match by luck alone`,
  };
}

/* ---------- DOM refs ---------- */
const $ = (id) => document.getElementById(id);
const grid = $("grid"), barOdds = $("barOdds"), barCount = $("barCount");
const bigOdds = $("bigOdds"), wordAnchorEl = $("wordAnchor"), stepsEl = $("stepsLine");
const labelEl = $("readoutLabel");

/* ---------- renderers ---------- */
function renderReadouts() {
  const { log10, terms } = productLog10();
  if (terms === 0) {
    labelEl.textContent = "Combined odds";
    barOdds.textContent = "—";
    bigOdds.textContent = "—";
    wordAnchorEl.textContent = "Tap a prophecy to start";
    stepsEl.innerHTML = "";
  } else {
    const headLog = log10 - LOG_POP;
    const per = formatOdds(log10);
    const popCount = formatCount(POPULATION_EVER);
    if (headLog < 0) {
      // expected chance-matches = all of humanity ÷ per-person odds — humans lead the equation
      stepsEl.innerHTML = `${popCount} people who&rsquo;ve lived &nbsp;÷&nbsp; ${per.html} per person`;
      // combined odds below 1: show how many people in history would match by chance
      const ex = formatExpected(Math.pow(10, -headLog));
      labelEl.textContent = "Expected by chance";
      barOdds.textContent = ex.bar;
      bigOdds.textContent = ex.big;
      wordAnchorEl.textContent = ex.anchor;
    } else {
      // combined odds = per-person odds ÷ all of humanity — reads in computation order
      stepsEl.innerHTML = `${per.html} per person &nbsp;÷&nbsp; ${popCount} people who&rsquo;ve lived`;
      const head = formatOdds(headLog);
      labelEl.textContent = "Combined odds";
      barOdds.innerHTML = head.html;
      bigOdds.innerHTML = head.html;
      wordAnchorEl.textContent = head.exp != null && head.exp >= 6 ? wordAnchor(head.exp) : "";
      maybeToast(head);
    }
  }
  barCount.textContent = `${selected.size}/8`;
  // sync accordion included-states + per-card adjusted readouts
  document.querySelectorAll(".acc-item").forEach((el) => {
    el.classList.toggle("included", selected.has(+el.dataset.id));
  });
  PROPHECIES.forEach((p) => {
    const v = $("adj-" + p.id);
    if (v) v.textContent = fmtInt(adjustedOdds(p));
  });
  drawShareSoon();
}

/* ---------- selection grid ---------- */
function buildGrid() {
  PROPHECIES.forEach((p, i) => {
    const b = document.createElement("button");
    b.className = "pcard";
    b.type = "button";
    b.dataset.id = p.id;
    b.setAttribute("aria-pressed", selected.has(p.id) ? "true" : "false");
    b.innerHTML = `
      <span class="check" aria-hidden="true">✓</span>
      <div class="pcard-num">0${i + 1}</div>
      <div class="pcard-name">${p.name}</div>
      <div class="pcard-ref">${p.prophecy.ref} → ${p.fulfillment.ref}</div>
      <div class="pcard-odds"><span class="lbl">Stoner's estimate</span>${fmtInt(p.base)}</div>`;
    b.addEventListener("click", () => {
      if (selected.has(p.id)) selected.delete(p.id);
      else selected.add(p.id);
      b.setAttribute("aria-pressed", selected.has(p.id) ? "true" : "false");
      renderReadouts();
    });
    grid.appendChild(b);
  });
  $("selectAll").addEventListener("click", () => {
    selected = new Set(PROPHECIES.map((p) => p.id));
    syncGrid(); renderReadouts();
  });
  $("clearAll").addEventListener("click", () => {
    selected = new Set();
    syncGrid(); renderReadouts();
  });
}
function syncGrid() {
  grid.querySelectorAll(".pcard").forEach((b) => {
    b.setAttribute("aria-pressed", selected.has(+b.dataset.id) ? "true" : "false");
  });
}

/* ---------- skepticism slider ---------- */
function buildSlider() {
  const slider = $("doubt");
  const bubble = $("doubtBubble");
  const label = $("doubtLabel");
  function paint() {
    const v = +slider.value;
    globalS = v;
    slider.style.setProperty("--fill", v + "%");
    const pct = (v - 1) / 99;
    const x = pct * (slider.clientWidth - 30) + 15;
    bubble.style.left = x + "px";
    bubble.textContent = v + "%";
    label.textContent = `Skepticism discount: ${v}%`;
    renderReadouts();
  }
  slider.addEventListener("input", paint);
  window.addEventListener("resize", () => {
    const v = +slider.value;
    const pct = (v - 1) / 99;
    bubble.style.left = (pct * (slider.clientWidth - 30) + 15) + "px";
  });
  slider.value = globalS;
  requestAnimationFrame(paint);
}

/* ---------- milestone toast ---------- */
let toastArmed = !sessionStorage.getItem("oaj-toast-17");
function maybeToast(head) {
  if (!toastArmed || head.exp == null || head.exp < 17) return;
  toastArmed = false;
  sessionStorage.setItem("oaj-toast-17", "1");
  const t = $("toast");
  $("toastNum").textContent = head.text;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 9000);
}
function buildToast() {
  const close = () => $("toast").classList.remove("show");
  $("toastClose").addEventListener("click", close);
  $("toast").addEventListener("click", (e) => { if (e.target.id === "toast") close(); });
}

/* ---------- deep-dive accordion ---------- */
function buildAccordion() {
  const acc = $("accordion");
  PROPHECIES.forEach((p, i) => {
    const item = document.createElement("div");
    item.className = "acc-item" + (selected.has(p.id) ? " included" : "");
    item.dataset.id = p.id;
    const pairNote = p.pair
      ? `<div class="fairnote"><strong>⚠️ Independence flag.</strong> Same passage as #${p.pair} (Zechariah 11:12–13) — counts as one linked event if you're being strict.</div>
         <div class="mergebox">
           <label>
             <input type="checkbox" class="mergeToggle" ${merged ? "checked" : ""}>
             <span><span class="mt">Merge them into one event</span><br>
             <span class="ms">Treats the pair as a single data point, using the larger odds of the two. This is the strict reading — and the math survives it.</span></span>
           </label>
         </div>`
      : "";
    const stonerNote = p.stonerNote
      ? `<div class="fairnote"><strong>Adapted from Stoner.</strong> ${p.stonerNote}</div>` : "";
    const donkeyHint = p.id === 3
      ? `<div class="fairnote"><strong>Steel-man tip:</strong> weakening isn't the same as un-multiplying. If you think this one was staged, uncheck the card above — that's the honest tool here.</div>` : "";
    item.innerHTML = `
      <button class="acc-head" aria-expanded="false" aria-controls="accbody-${p.id}">
        <span class="acc-num">0${i + 1}</span>
        <span class="acc-name">${p.name}</span>
        <span class="acc-odds mono">${fmtInt(p.base)}</span>
        <span class="acc-chev" aria-hidden="true">▾</span>
      </button>
      <div class="acc-body" id="accbody-${p.id}" hidden>
        <div class="lbl">The assumption</div>
        <p>${p.assumption}</p>
        <div class="fairnote"><strong>What a critic would say.</strong> ${p.honest}</div>
        ${stonerNote}
        <div class="lbl">The texts (${BIBLE_VERSION})</div>
        <div class="reflinks">
          <button class="reflink" data-scrip="${p.id}" data-which="prophecy">📜 ${p.prophecy.ref} (${p.prophecy.date})</button>
          <button class="reflink" data-scrip="${p.id}" data-which="fulfillment">✝️ ${p.fulfillment.ref}</button>
        </div>
        <div class="lbl">Skeptic's discount for this one</div>
        <div class="miniadj">
          <div class="miniadj-top">
            <span class="t">Adjusted odds</span>
            <span class="v mono" id="adj-${p.id}">${fmtInt(p.base)}</span>
          </div>
          <input type="range" class="mini" min="0" max="100" step="1" value="${perVal[p.id]}"
                 aria-label="Skeptic's discount for ${p.name}" data-mini="${p.id}">
          <div class="miniadj-scale"><span>Skeptical floor: ${fmtInt(p.floor)}</span><span>Stoner's estimate</span></div>
        </div>
        ${donkeyHint}
        ${pairNote}
      </div>`;
    acc.appendChild(item);
  });

  acc.addEventListener("click", (e) => {
    const head = e.target.closest(".acc-head");
    if (head) {
      const body = head.parentElement.querySelector(".acc-body");
      const open = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", String(!open));
      body.hidden = open;
      return;
    }
    const rl = e.target.closest(".reflink");
    if (rl) openSheet(+rl.dataset.scrip, rl.dataset.which);
  });
  acc.addEventListener("input", (e) => {
    const m = e.target.closest("[data-mini]");
    if (m) {
      perVal[+m.dataset.mini] = +m.value;
      m.style.setProperty("--fill", m.value + "%");
      renderReadouts();
    }
    const t = e.target.closest(".mergeToggle");
    if (t) {
      merged = t.checked;
      document.querySelectorAll(".mergeToggle").forEach((x) => (x.checked = merged));
      renderReadouts();
    }
  });
  acc.querySelectorAll("[data-mini]").forEach((m) => m.style.setProperty("--fill", m.value + "%"));
}

/* ---------- scripture sheet ---------- */
function openSheet(id, which) {
  const p = PROPHECIES.find((x) => x.id === id);
  const s = p.scripture;
  const bg = (ref) => `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref)}&version=KJV`;
  $("sheetTitle").textContent = p.name;
  $("sheetBody").innerHTML = `
    <div class="passage">
      <div class="pref">The prediction — ${s.prophecy.ref}</div>
      <p class="ptext">“${s.prophecy.text}”</p>
      <a href="${bg(s.prophecy.ref)}" target="_blank" rel="noopener">Read the full chapter on BibleGateway ↗</a>
    </div>
    <div class="passage">
      <div class="pref">The fulfillment — ${s.fulfillment.ref}</div>
      <p class="ptext">“${s.fulfillment.text}”</p>
      <a href="${bg(s.fulfillment.ref)}" target="_blank" rel="noopener">Read the full chapter on BibleGateway ↗</a>
    </div>`;
  $("sheetOverlay").classList.add("show");
  $("sheet").classList.add("show");
  document.body.style.overflow = "hidden";
  $("sheetClose").focus();
}
function closeSheet() {
  $("sheetOverlay").classList.remove("show");
  $("sheet").classList.remove("show");
  document.body.style.overflow = "";
}
function buildSheet() {
  $("sheetClose").addEventListener("click", closeSheet);
  $("sheetOverlay").addEventListener("click", closeSheet);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(); });
}

/* ---------- share card canvas ---------- */
const ACCENT = "#F2A93B", INK = "#060606", PAPER = "#FFFFFF",
      MUTED = "#A3A3A8", FAINT = "#6E6E73";
let shareDirty = true, shareObserved = false;

function scaleLine(exp) {
  if (exp == null) return "Select prophecies to run the numbers.";
  if (exp >= 80) return "Like picking one atom out of the universe.";
  if (exp >= 30) return "Like finding one grain of sand on every beach.";
  if (exp >= 17) return "Like finding one marked coin in Texas, 2 ft deep in silver dollars.";
  return "More unlikely than back-to-back lottery wins.";
}
function wrapCenter(ctx, text, cx, y, maxW, lineH) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; }
    else line = t;
  }
  lines.push(line);
  lines.slice(0, 2).forEach((l, i) => ctx.fillText(l, cx, y + i * lineH));
}
function drawShare(canvas, S) {
  // S = scale factor; canvas is 1080*S square. Coordinates below are 1080-space.
  const ctx = canvas.getContext("2d");
  const u = (n) => n * S;
  ctx.save();
  ctx.scale(S, S);
  // background + subtle vignette
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, 1080, 1080);
  const vg = ctx.createRadialGradient(540, 200, 50, 540, 200, 900);
  vg.addColorStop(0, "rgba(242,169,59,0.05)");
  vg.addColorStop(1, "rgba(242,169,59,0)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, 1080, 1080);

  const cx = 540;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // OAJ mark with gold dot
  ctx.fillStyle = "#0D0D0D";
  ctx.strokeStyle = "#222222"; ctx.lineWidth = 2;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(cx - 60, 90, 120, 120, 18); else ctx.rect(cx - 60, 90, 120, 120);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = PAPER;
  ctx.font = '700 44px "Space Grotesk", Inter, sans-serif';
  ctx.fillText("OAJ", cx - 12, 168);
  ctx.fillStyle = ACCENT;
  ctx.beginPath(); ctx.arc(cx + 38, 152, 9, 0, Math.PI * 2); ctx.fill();

  // wordmark
  ctx.fillStyle = PAPER;
  ctx.font = '300 64px Inter, sans-serif';
  ctx.fillText("OddsAre", cx, 300);
  ctx.font = '700 84px "Space Grotesk", Inter, sans-serif';
  ctx.fillText("Jesus", cx, 382);

  // accent hairline
  ctx.fillStyle = ACCENT;
  ctx.fillRect(cx - 120, 438, 240, 3);

  ctx.fillStyle = PAPER;
  ctx.font = '600 44px Inter, sans-serif';
  ctx.fillText("I ran the numbers.", cx, 528);

  // result
  const { log10, terms } = productLog10();
  let head = { exp: null, mant: null, text: "—" };
  let expectedMode = false, expectedText = "", expectedCaption = "";
  if (terms) {
    const headLog = log10 - LOG_POP;
    if (headLog < 0) {
      // combined odds below 1: show expected chance-matches instead
      expectedMode = true;
      const ex = formatExpected(Math.pow(10, -headLog));
      expectedText = ex.big;
      expectedCaption = ex.anchor;
    } else {
      head = formatOdds(headLog);
    }
  }
  ctx.fillStyle = ACCENT;
  if (expectedMode) {
    ctx.font = '700 84px "JetBrains Mono", monospace';
    ctx.fillText(expectedText, cx, 668);
  } else if (head.exp == null) {
    ctx.font = '700 64px "JetBrains Mono", monospace';
    ctx.fillText("—", cx, 668);
  } else if (head.mant == null) {
    ctx.font = '700 88px "JetBrains Mono", monospace';
    ctx.fillText(head.text, cx, 668);
  } else {
    const base = `1 in ${head.mant}×10`;
    ctx.font = '700 96px "JetBrains Mono", monospace';
    const wBase = ctx.measureText(base).width;
    ctx.font = '700 60px "JetBrains Mono", monospace';
    const wExp = ctx.measureText(String(head.exp)).width;
    let x = cx - (wBase + wExp) / 2;
    ctx.textAlign = "left";
    ctx.font = '700 96px "JetBrains Mono", monospace';
    ctx.fillText(base, x, 668);
    x += wBase;
    ctx.font = '700 60px "JetBrains Mono", monospace';
    ctx.fillText(String(head.exp), x, 668 - 34); // raised ~35% of cap height
    ctx.textAlign = "center";
  }

  ctx.fillStyle = MUTED;
  ctx.font = '500 36px Inter, sans-serif';
  ctx.fillText(expectedMode ? expectedCaption : "Coincidence? Or evidence?", cx, 748);

  ctx.fillStyle = FAINT;
  ctx.font = '500 30px Inter, sans-serif';
  const n = merged && selected.has(5) && selected.has(6) ? terms + " events" : terms + " prophecies";
  ctx.fillText(terms ? `${n} · ${globalS}% skeptic discount` : "your move — tap the prophecies above", cx, 830);

  ctx.fillStyle = MUTED;
  ctx.font = '500 30px Inter, sans-serif';
  wrapCenter(ctx, expectedMode ? "Tap more prophecies — watch it collapse." : scaleLine(head.exp), cx, 890, 900, 40);

  // footer
  ctx.fillStyle = PAPER;
  ctx.font = '700 40px Inter, sans-serif';
  ctx.fillText("oddsarejesus.com · It's Just Math.", cx, 992);

  ctx.restore();
}
async function ensureFonts() {
  try {
    await Promise.all([
      document.fonts.load('700 84px "Space Grotesk"'),
      document.fonts.load('300 64px Inter'),
      document.fonts.load('700 96px "JetBrains Mono"'),
    ]);
    await document.fonts.ready;
  } catch (e) { /* fall back to system fonts */ }
}
let shareTimer = null;
function drawShareSoon() {
  shareDirty = true;
  if (!shareObserved) return;
  clearTimeout(shareTimer);
  shareTimer = setTimeout(renderPreview, 250); // debounce: slider drags redraw at most ~4/sec
}
function renderPreview() {
  const c = $("sharePreview");
  if (!c) return;
  ensureFonts().then(() => { drawShare(c, 0.5); shareDirty = false; });
}
function buildShare() {
  const c = $("sharePreview");
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      shareObserved = true;
      io.disconnect();
      renderPreview();
    }
  }, { rootMargin: "200px" });
  io.observe(c);

  $("dlBtn").addEventListener("click", async () => {
    await ensureFonts();
    const off = document.createElement("canvas");
    off.width = 1080; off.height = 1080;
    drawShare(off, 1);
    off.toBlob((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "odds-are-jesus.png";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
    }, "image/png");
  });

  $("copyBtn").addEventListener("click", async () => {
    const url = location.origin === "null" || location.protocol === "file:"
      ? "https://oddsarejesus.com/" + encodeState()
      : location.origin + location.pathname + encodeState();
    try {
      await navigator.clipboard.writeText(url);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    const n = $("copiedNote");
    n.textContent = "Copied ✓ — send it to a friend";
    setTimeout(() => (n.textContent = ""), 3000);
  });

  if (navigator.share) {
    const sb = $("nativeShare");
    sb.hidden = false;
    sb.addEventListener("click", async () => {
      const { log10, terms } = productLog10();
      let resultText = "no prophecies selected yet";
      if (terms) {
        const headLog = log10 - LOG_POP;
        if (headLog < 0) {
          const ex = formatExpected(Math.pow(10, -headLog));
          resultText = `${ex.big} ${ex.anchor}`;
        } else {
          resultText = formatOdds(headLog).text;
        }
      }
      try {
        await navigator.share({
          title: "Odds Are Jesus",
          text: `I ran the numbers: ${resultText}. Run yours — it's just math.`,
          url: location.href.split("?")[0] + encodeState(),
        });
      } catch (e) { /* user cancelled */ }
    });
  }
}
function encodeState() {
  const p = PROPHECIES.map((x) => (selected.has(x.id) ? "1" : "0")).join("");
  const f = PROPHECIES.map((x) => perVal[x.id]).join(",");
  return `?p=${p}&s=${globalS}&m=${merged ? 1 : 0}&f=${f}`;
}
function readStateFromURL() {
  const q = new URLSearchParams(location.search);
  if (!q.has("p")) return;
  const p = q.get("p");
  if (/^[01]{8}$/.test(p)) {
    selected = new Set();
    [...p].forEach((c, i) => { if (c === "1") selected.add(i + 1); });
  }
  const s = parseInt(q.get("s"), 10);
  if (s >= 1 && s <= 100) globalS = s;
  merged = q.get("m") === "1";
  (q.get("f") || "").split(",").forEach((v, i) => {
    const n = parseInt(v, 10);
    if (i < 8 && n >= 0 && n <= 100) perVal[i + 1] = n;
  });
}

/* ---------- email capture (honest fallback) ---------- */
function buildEmail() {
  const form = $("joinForm"), fallback = $("joinSoon");
  if (!EMAIL_ENDPOINT) {
    form.hidden = true;
    fallback.hidden = false;
    return;
  }
  fallback.hidden = true;
  form.hidden = false;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.website.value) return; // honeypot
    const email = form.email.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      form.email.focus();
      return;
    }
    try {
      // Google Forms has no CORS headers: no-cors + FormData is the supported pattern.
      // The response is opaque, so reaching here without a network error counts as sent.
      const fd = new FormData();
      fd.append(EMAIL_ENTRY, email);
      await fetch(EMAIL_ENDPOINT, { method: "POST", mode: "no-cors", body: fd });
      form.innerHTML = `<p style="font-size:17px"><span style="color:var(--accent);font-weight:700">✓</span> <strong>You're on the team.</strong> First drop lands soon.</p>`;
    } catch (err) {
      form.innerHTML = `<p style="color:var(--muted)">Hmm — that didn't go through. Try again in a bit.</p>`;
    }
  });
}

/* ---------- boot ---------- */
readStateFromURL();
buildGrid();
buildSlider();
buildAccordion();
buildToast();
buildSheet();
buildShare();
buildEmail();
$("doubt").value = globalS;
syncGrid();
renderReadouts();
