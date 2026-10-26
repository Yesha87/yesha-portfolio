/* =========================================================
   Yesha Thompson — Portfolio scripts
   ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

/* ---------------- DATA ---------------- */
const CATS = {
  wordpress: "WordPress",
  shopify: "Shopify",
  webflow: "Webflow",
  custom: "Custom build",
  react: "React / Next.js",
};

const PROJECTS = [
  { name: "Produce to Plate",  url: "https://producetoplate.com/",       cats: ["wordpress"] },
  { name: "Stay Well Adjusted", url: "https://staywelladjusted.com/",    cats: ["wordpress"] },
  { name: "Galia Lahav",       url: "https://www.galialahav.com/",       cats: ["wordpress"] },
  { name: "Lohy",              url: "https://lohy.com.au/",              cats: ["wordpress"] },
  { name: "Squadwear",         url: "https://squadwear.com.au/",         cats: ["shopify"] },
  { name: "Sahroo",            url: "https://www.sahroo.com/",           cats: ["shopify"] },
  { name: "Caldera Lab",       url: "https://calderalab.com/",           cats: ["shopify"] },
  { name: "Chocochips",        url: "https://www.chocochips.co.id/",     cats: ["custom"] },
  { name: "Potting Shed",      url: "https://pottingshed.com/",          cats: ["custom"] },
  { name: "Idea Bakery",       url: "https://ideabakery.com/",           cats: ["custom"] },
  { name: "Extra Fazant",      url: "https://www.extrafazant.nl/",       cats: ["webflow"] },
  { name: "RAMMP",             url: "https://rammp.com/",                cats: ["webflow"] },
  { name: "Great Dwellings",   url: "https://www.greatdwellings.com/",   cats: ["webflow", "react"] },
  { name: "Codeglo",           url: "https://www.codeglo.com/",          cats: ["react"] },
  { name: "SV Life",           url: "https://sv-life.ru/",               cats: ["react"] },
];

const TOOLS = [
  "WordPress", "Shopify", "Webflow", "Wix Studio", "GHL", "Figma", "Adobe tools", "ClickFunnels",
  "Squarespace", "Claude Code", "Codex", "Vercel", "React", "Next.js", "Elementor", "Divi",
  "Zapier", "Make.com", "Zoho",
];

const ROLES = ["Web Developer", "Designer", "Full Stack Developer", "Shopify Builder", "WordPress Pro", "SEO Nerd"];

/* ---------------- THEME ---------------- */
const root = document.documentElement;
function setTheme(t) {
  root.dataset.theme = t;
  store.set("theme", t);
}
setTheme(store.get("theme", window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
$("#themeBtn").addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  toast(root.dataset.theme === "dark" ? "Lights off 🌙" : "Lights on ☀️");
});

/* ---------------- TOAST ---------------- */
let toastTimer;
function toast(msg, ms = 2600) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), ms);
}

/* ---------------- EASTER EGGS ---------------- */
const EGGS = {
  terminal: { label: "Open the secret terminal", hint: "Try the ` key…" },
  blob:     { label: "Annoy the blob", hint: "Someone in the hero loves attention" },
  name:     { label: "Type her name", hint: "Just type it. Anywhere." },
  konami:   { label: "The classic code", hint: "Check the footer ↓" },
  hire:     { label: "Get root access", hint: "sudo something in the terminal" },
};
let found = new Set(store.get("eggs", []).filter((k) => k in EGGS));

function renderEggs() {
  const n = found.size;
  $("#eggCount").textContent = n;
  $("#eggCount2").textContent = n;
  $("#eggMeter").style.width = (n / 5) * 100 + "%";
  $("#eggTease").textContent =
    n === 0 ? "There are secrets hidden on this page…" :
    n < 5 ? `${5 - n} more to go. Check the 🥚 up top for hints.` :
    "You found them all! You clearly pay attention to detail, and so does Yesha. 💜";
  $("#eggList").innerHTML = Object.entries(EGGS)
    .map(([k, e]) => `<li class="${found.has(k) ? "found" : ""}"><span>${found.has(k) ? "🐣" : "🥚"}</span><span>${found.has(k) ? e.label : e.hint}</span></li>`)
    .join("");
}
function findEgg(id) {
  if (found.has(id)) return;
  found.add(id);
  store.set("eggs", [...found]);
  renderEggs();
  const btn = $("#eggBtn");
  btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
  if (found.size === 5) {
    toast("🎉 All 5 easter eggs found! You're officially a legend.", 4000);
    confetti(260);
  } else {
    toast(`🐣 Easter egg found: ${EGGS[id].label} (${found.size}/5)`);
    confetti(70);
  }
}
renderEggs();

const eggPop = $("#eggPop");
$("#eggBtn").addEventListener("click", (e) => { e.stopPropagation(); eggPop.hidden = !eggPop.hidden; });
document.addEventListener("click", (e) => { if (!eggPop.hidden && !eggPop.contains(e.target)) eggPop.hidden = true; });

/* ---------------- ROLE ROTATOR ---------------- */
const roleEl = $("#roleRotator");
let roleI = 0;
setInterval(() => {
  roleI = (roleI + 1) % ROLES.length;
  roleEl.textContent = ROLES[roleI];
  roleEl.classList.remove("swap"); void roleEl.offsetWidth; roleEl.classList.add("swap");
}, 2400);

/* ---------------- TOOLS MARQUEE + STACK ---------------- */
const toolHTML = TOOLS.map((t) => `<span class="tool">${t}</span>`).join("");
$("#marquee").innerHTML = toolHTML + toolHTML; // doubled for a seamless loop
$("#stackChips").innerHTML = ["WordPress", "Shopify", "Webflow", "Wix Studio", "GHL", "Squarespace", "ClickFunnels", "React & Next.js", "Vercel"]
  .map((t) => `<span>${t}</span>`).join("");

/* ---------------- PROJECTS ---------------- */
const grid = $("#workGrid");
grid.innerHTML = PROJECTS.map((p, i) => {
  const host = p.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  return `
  <a class="tile project reveal" href="${p.url}" target="_blank" rel="noopener" data-cats="${p.cats.join(" ")}">
    <div class="browser-bar"><span class="dots"><i></i><i></i><i></i></span><span class="url">${host}</span></div>
    <div class="preview skin-${i % 4}"><span class="wordmark">${p.name}</span><span class="shape"></span></div>
    <div class="project-foot">
      <div><strong>${p.name}</strong><br><span class="visit">Visit site <span class="arrow">↗</span></span></div>
      <span class="tag">${CATS[p.cats[0]]}</span>
    </div>
  </a>`;
}).join("");

// counts on filter pills
$$(".pill").forEach((pill) => {
  const f = pill.dataset.filter;
  const n = f === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.cats.includes(f)).length;
  pill.insertAdjacentHTML("beforeend", `<span class="count">${n}</span>`);
});

$$(".pill").forEach((pill) =>
  pill.addEventListener("click", () => {
    $$(".pill").forEach((p) => p.classList.toggle("active", p === pill));
    const f = pill.dataset.filter;
    $$(".project").forEach((card, i) => {
      const show = f === "all" || card.dataset.cats.split(" ").includes(f);
      card.classList.toggle("hide", !show);
      card.classList.remove("enter");
      if (show) { void card.offsetWidth; card.style.animationDelay = (i % 6) * 40 + "ms"; card.classList.add("enter"); }
    });
  })
);

// subtle 3D tilt on project cards
if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
  $$(".project").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translate(-3px,-3px)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  });
}

/* ---------------- SCROLL REVEAL + COUNTERS ---------------- */
function countUp(el) {
  const target = +el.dataset.count;
  if (reduceMotion) { el.textContent = target; return; }
  const start = performance.now(), dur = 1200;
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target;
    el.classList.add("in");
    $$("[data-count]", el).forEach(countUp);
    // hand transitions back to the normal hover styles once revealed
    setTimeout(() => el.classList.remove("reveal", "in"), 800);
    io.unobserve(el);
  });
}, { threshold: 0.12 });
$$(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 70 + "ms";
  io.observe(el);
  setTimeout(() => (el.style.transitionDelay = ""), 1600);
});

/* ---------------- BLOB BUDDY ---------------- */
const blob = $("#blob");
const speech = $("#speech");
const pupils = $$(".pupil", blob);
const LINES = [
  "hi! 👋", "I help Yesha debug", "hehe that tickles", "ok that's enough", "seriously…",
  "I'm telling Yesha", "FINE. you win 🥚",
  "Wix? Webflow? I've seen it all", "I'm made of pure CSS", "hire her, she's great", "*blob noises*",
];
let blobClicks = 0;
function say(text) {
  speech.textContent = text;
  speech.classList.remove("pop"); void speech.offsetWidth; speech.classList.add("pop");
}
blob.addEventListener("click", () => {
  blobClicks++;
  say(LINES[(blobClicks - 1) % LINES.length]);
  blob.classList.remove("squish", "spin"); void blob.offsetWidth;
  if (blobClicks === 7) {
    blob.classList.add("spin");
    findEgg("blob");
  } else {
    blob.classList.add("squish");
  }
  blob.classList.add("happy");
  setTimeout(() => blob.classList.remove("happy"), 900);
});

// eyes follow the cursor
let raf;
document.addEventListener("pointermove", (e) => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    pupils.forEach((p) => {
      const r = p.parentElement.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const a = Math.atan2(dy, dx);
      const d = Math.min(8, Math.hypot(dx, dy) / 30);
      p.style.transform = `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px)`;
    });
  });
});

/* ---------------- COPY EMAIL ---------------- */
$("#copyEmail").addEventListener("click", async () => {
  const email = "yeshathompson87@gmail.com";
  try { await navigator.clipboard.writeText(email); toast("📋 Email copied!"); }
  catch { toast(email); }
});

/* ---------------- TERMINAL ---------------- */
const overlay = $("#termOverlay");
const body = $("#termBody");
const input = $("#termInput");
const history = [];
let histI = 0;

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function print(html, cls = "") {
  const div = document.createElement("div");
  if (cls) div.className = cls;
  div.innerHTML = html;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

const COMMANDS = {
  help: () => `Available commands:
  <span class="acc">about</span>       who is Yesha?
  <span class="acc">skills</span>      what she's good at
  <span class="acc">projects</span>    sites she's built
  <span class="acc">experience</span>  years &amp; roles
  <span class="acc">contact</span>     how to reach her
  <span class="acc">theme</span>       toggle lights on/off
  <span class="acc">party</span>       🎉
  <span class="acc">clear</span>       clear the screen
  <span class="acc">exit</span>        close the terminal
  …and maybe a secret or two.`,
  about: () => `Hello! I'm Yesha, a Web Developer / Designer &amp; Full Stack Developer.
I work in WordPress, Shopify, Wix, Webflow, GHL and custom code,
with SEO and design skills on top. I also automate workflows with
Zapier, Make.com, GHL and Zoho.`,
  skills: () => `<span class="acc">WordPress</span>   Elementor · Divi · Beaver · custom &amp; child themes
<span class="acc">Shopify</span>     custom stores · Liquid · apps · payment gateways
<span class="acc">Design/UI</span>   Figma · Illustrator · InDesign · AI design tools
<span class="acc">Front-end</span>   HTML5 · CSS3 · Bootstrap · JS · jQuery · React · Next.js
<span class="acc">Webmaster</span>   domains · hosting · WHM · cPanel · 301 redirects
<span class="acc">Growth</span>      SEO · AEO · GEO · Zapier · Make.com · Zoho`,
  projects: () => Object.entries(CATS).map(([k, label]) =>
    `<span class="acc">${label}</span>\n` + PROJECTS.filter((p) => p.cats.includes(k))
      .map((p) => `  → <a href="${p.url}" target="_blank" rel="noopener">${p.name}</a>`).join("\n")
  ).join("\n"),
  ls: () => COMMANDS.projects(),
  experience: () => `<span class="ok">8+ years</span> building for the web, fully remote.
  • GEC Transfers (2 years, remote)
  • Agency work (remote, clients in AUS, US &amp; UK)`,
  contact: () => `✉  <a href="mailto:yeshathompson87@gmail.com">yeshathompson87@gmail.com</a>
💬 Teams: yeshathompson87`,
  whoami: () => `guest… for now. Could be a client soon? 😉`,
  theme: () => { $("#themeBtn").click(); return `theme → ${root.dataset.theme}`; },
  party: () => { confetti(200); return "🎉 🎉 🎉"; },
  coffee: () => "☕ Here's a virtual coffee. Code tastes better with it.",
  hello: () => "hi there! 👋 type <span class=\"acc\">help</span> to look around.",
  hi: () => COMMANDS.hello(),
  clear: () => { body.innerHTML = ""; return null; },
  exit: () => { closeTerm(); return null; },
};

function run(raw) {
  const cmd = raw.trim().toLowerCase().replace(/\s+/g, " ");
  print(`<span class="cmd">~ $</span> ${esc(raw)}`);
  if (!cmd) return;
  if (cmd === "sudo hire yesha" || cmd === "sudo hire-yesha") {
    findEgg("hire");
    print(`<span class="ok">[sudo] access granted ✔</span>
Initiating hire sequence…
  ▸ checking skills ............ <span class="ok">excellent</span>
  ▸ checking experience ........ <span class="ok">8+ years</span>
  ▸ checking vibes ............. <span class="ok">immaculate</span>
Next step → <a href="mailto:yeshathompson87@gmail.com?subject=Let's%20work%20together">send Yesha an email</a> 💜`);
    return;
  }
  if (cmd.startsWith("sudo")) { print("Permission denied 🔒  (hint: what do you want to <i>hire</i>?)"); return; }
  if (cmd === "rm -rf /" || cmd.startsWith("rm ")) { print("Nice try. This portfolio is staying right here. 😌"); return; }
  const fn = COMMANDS[cmd];
  if (fn) { const out = fn(); if (out) print(out); }
  else print(`command not found: ${esc(cmd)}. Type <span class="acc">help</span>`);
}

function openTerm() {
  if (!overlay.hidden) return;
  overlay.hidden = false;
  findEgg("terminal");
  if (!body.childElementCount) {
    print(`<span class="acc">Welcome to yesha.dev terminal v1.0</span>
You found the secret terminal! 🥚 Type <span class="acc">help</span> to get started.`);
  }
  setTimeout(() => input.focus(), 50);
}
function closeTerm() { overlay.hidden = true; }

$("#termTile").addEventListener("click", openTerm);
$("#termClose").addEventListener("click", closeTerm);
overlay.addEventListener("click", (e) => { if (e.target === overlay) closeTerm(); });
$("#termForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = input.value;
  if (v.trim()) history.push(v);
  histI = history.length;
  input.value = "";
  run(v);
});
input.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && histI > 0) { input.value = history[--histI]; e.preventDefault(); }
  if (e.key === "ArrowDown") { histI = Math.min(history.length, histI + 1); input.value = history[histI] || ""; e.preventDefault(); }
});

/* ---------------- GLOBAL KEYS: terminal, name, konami ---------------- */
const KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
let keyBuf = [];
let typed = "";
document.addEventListener("keydown", (e) => {
  const inField = /input|textarea/i.test(e.target.tagName);
  if (e.key === "Escape") { closeTerm(); eggPop.hidden = true; return; }
  if (inField) return;

  if (e.key === "`" || e.key === "~") { e.preventDefault(); openTerm(); return; }

  const k = e.key.toLowerCase();
  keyBuf = [...keyBuf, k].slice(-KONAMI.length);
  if (keyBuf.join() === KONAMI.join()) { keyBuf = []; partyMode(); }

  if (k.length === 1) {
    typed = (typed + k).slice(-5);
    if (typed === "yesha") {
      typed = "";
      findEgg("name");
      say("that's her name! 💜");
      $(".t-intro h1").animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.06) rotate(-2deg)" }, { transform: "scale(1)" }],
        { duration: 600, easing: "ease-out" }
      );
    }
  }
});

function partyMode() {
  findEgg("konami");
  document.body.classList.add("party");
  blob.classList.add("party");
  say("🕺 PARTY MODE 💃");
  confetti(300);
  setTimeout(() => { document.body.classList.remove("party"); blob.classList.remove("party"); }, 5000);
}

// clicking the logo 3× quickly = tiny bonus wiggle (not counted)
let logoClicks = 0, logoTimer;
$("#logo").addEventListener("click", () => {
  logoClicks++;
  clearTimeout(logoTimer);
  logoTimer = setTimeout(() => (logoClicks = 0), 700);
  if (logoClicks === 3) toast("👀 curious, aren't you? Try pressing ` …");
});

/* ---------------- CONFETTI ---------------- */
const cvs = $("#confetti");
const ctx = cvs.getContext("2d");
let parts = [], confettiRaf;
const COLORS = ["#D9BCD6", "#0b0b0b", "#38B6FF", "#FFF8E7", "#b996b5"];
function confetti(n = 120) {
  if (reduceMotion) return;
  cvs.width = innerWidth * devicePixelRatio;
  cvs.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  for (let i = 0; i < n; i++) {
    parts.push({
      x: innerWidth / 2 + (Math.random() - 0.5) * innerWidth * 0.4,
      y: innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 14 - 4,
      s: Math.random() * 8 + 5,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      round: Math.random() > 0.6,
      life: 0,
    });
  }
  cancelAnimationFrame(confettiRaf);
  const step = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter((p) => p.y < innerHeight + 40 && p.life < 400);
    parts.forEach((p) => {
      p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life++;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.strokeStyle = "#0b0b0b"; ctx.lineWidth = 1.2;
      if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
      else { ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.strokeRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); }
      ctx.restore();
    });
    if (parts.length) confettiRaf = requestAnimationFrame(step);
    else ctx.clearRect(0, 0, innerWidth, innerHeight);
  };
  step();
}

/* ---------------- MISC ---------------- */
$("#year").textContent = new Date().getFullYear();

console.log(
  "%c hi, fellow dev 👋 %c\nThis site was hand-built with plain HTML, CSS & JS.\nThere are 5 easter eggs hidden here. Hint: press ` to start.",
  "background:#D9BCD6;color:#0b0b0b;font:700 16px sans-serif;padding:6px 10px;border:2px solid #0b0b0b;border-radius:8px",
  "color:#b996b5;font:13px monospace"
);
