/**
 * 开屏页：气泡上升动效
 * 调参请改 splash-config.json 里的 "computed"，保存后刷新网页（Cmd+Shift+R）
 */

/* ══════════════════════════════════════════════════════════
   ★★★  开屏气泡调参区  ★★★
   ──────────────────────────────────────────────────────────
   speed        气泡上浮速度（越小越慢）。推荐范围 0.2–1.2
   size         气泡大小基准（越小越小）。推荐范围 2–6
   burstChance  在空中随机炸开的概率（越小越少炸）。推荐 0.003–0.02
   maxParticles 屏幕上同时存在的最大气泡数
   maxLife      气泡最长存活帧数（速度慢时适当调大让气泡飞完全程）
   ══════════════════════════════════════════════════════════ */
const BUBBLE_DEFAULTS = {
  maxParticles: 8,
  seedCount: 5,
  speed: 0.45,        /* ★ 上浮速度（原 0.98，已大幅降低） */
  size: 4.5,          /* ★ 气泡大小（原 8.02，已大幅缩小） */
  shapeRingRatio: 0.4,
  opacity: 0.835,
  burstChance: 0.006, /* ★ 随机炸开概率（原 0.022，已降低） */
  spawnRate: 0.45,
  topEdgePx: 6,
  maxLife: 340,       /* ★ 更慢速度需要更长寿命才能飞完全程 */
};

/** 运行时实际使用的参数（由 splash-config.json 加载） */
let BUBBLE_FINAL = { ...BUBBLE_DEFAULTS };

function lerp(min, max, t01) {
  return min + (max - min) * (t01 / 100);
}

function computedFromSliders(sliders) {
  return {
    maxParticles: Math.round(lerp(3, 70, sliders.count)),
    seedCount: Math.round(lerp(2, 22, sliders.count)),
    speed: lerp(0.25, 2.4, sliders.speed),
    size: lerp(2.5, 14, sliders.size),
    shapeRingRatio: sliders.shape / 100,
    opacity: lerp(0.25, 1, sliders.opacity),
    burstChance: lerp(0.004, 0.045, sliders.burst),
    spawnRate:
      lerp(0.5, 3.8, sliders.speed) *
      lerp(0.65, 1.8, sliders.burst) *
      lerp(0.12, 1, sliders.count),
    topEdgePx: 6,
    maxLife: 160,
  };
}

function applyBubbleConfig(data) {
  const next = { ...BUBBLE_DEFAULTS };

  if (data.computed && typeof data.computed === "object") {
    const c = data.computed;
    if (c.maxParticles != null) next.maxParticles = c.maxParticles;
    if (c.seedCount != null) next.seedCount = c.seedCount;
    if (c.speed != null) next.speed = c.speed;
    if (c.size != null) next.size = c.size;
    if (c.shapeRingRatio != null) next.shapeRingRatio = c.shapeRingRatio;
    if (c.opacity != null) next.opacity = c.opacity;
    if (c.burstChance != null) next.burstChance = c.burstChance;
    if (c.spawnRate != null) next.spawnRate = c.spawnRate;
    if (c.topEdgePx != null) next.topEdgePx = c.topEdgePx;
    if (c.maxLife != null) next.maxLife = c.maxLife;
  } else if (data.sliders && typeof data.sliders === "object") {
    Object.assign(next, computedFromSliders(data.sliders));
  }

  BUBBLE_FINAL = next;
}

async function loadBubbleConfig() {
  try {
    const res = await fetch(`splash-config.json?t=${Date.now()}`);
    if (!res.ok) return;
    const data = await res.json();
    applyBubbleConfig(data);
  } catch {
    /* 本地服务器未启动或 file:// 打开时无法 fetch，使用 BUBBLE_DEFAULTS */
  }
}

let splashCanvas;
let splashCtx;
let splashParticles = [];
let splashAnimId = null;
let splashLastTime = 0;
let splashSpawnAcc = 0;
let splashLogicalW = 0;
let splashLogicalH = 0;

/** 动效区下沿：Gin Logo 垂直中线；上沿：网页顶边 */
function getBubbleZone() {
  const splash = document.getElementById("screen-splash");
  const logo = document.querySelector(".splash-logo");
  const h = splashLogicalH || window.innerHeight;

  if (!splash || !logo || h < 10) {
    return { top: 0, bottom: 0.38 };
  }

  const splashRect = splash.getBoundingClientRect();
  const logoRect = logo.getBoundingClientRect();
  const logoMidY = logoRect.top + logoRect.height * 0.5;
  const bottom = (logoMidY - splashRect.top) / splashRect.height;

  /* ★ 气泡活动范围：
       top    = 0（屏幕顶部）
       bottom = 气泡从这里生成并向上飘
       原来 0.24–0.5（只有顶部一小块）
       现在 0.45–0.80（更大区间，贯穿大半个屏幕）
     如果想让气泡出现得更低，把 0.45 改大，把 0.80 改大。 */
  return {
    top: 0,
    bottom: Math.min(0.80, Math.max(0.45, bottom)),
  };
}

function getBubbleConfig() {
  return {
    ...BUBBLE_FINAL,
    zone: getBubbleZone(),
  };
}

function randomYInZone(h, zone, bias = "spawn") {
  const top = h * zone.top;
  const bottom = h * zone.bottom;
  const span = bottom - top;
  if (bias === "spawn") {
    return bottom - span * (0.1 + Math.random() * 0.45);
  }
  return top + span * Math.random();
}

function createParticle(w, h, cfg) {
  const zone = cfg.zone || getBubbleZone();
  const isRing = Math.random() < cfg.shapeRingRatio * 0.6;
  return {
    x: w * (0.06 + Math.random() * 0.88),
    y: randomYInZone(h, zone, "spawn"),
    vy: -cfg.speed * (0.75 + Math.random() * 0.6),
    vx: (Math.random() - 0.5) * cfg.speed * 0.18,
    radius: cfg.size * (0.65 + Math.random() * 0.75),
    opacity: cfg.opacity * (0.8 + Math.random() * 0.2),
    kind: isRing ? "ring" : "dot",
    phase: "rise",
    burstTimer: 0,
    life: 0,
    maxLife: cfg.maxLife,
    wobble: Math.random() * Math.PI * 2,
  };
}

function seedParticles(count, w, h, cfg) {
  splashParticles = [];
  const zone = cfg.zone || getBubbleZone();
  const n = Math.min(count, cfg.maxParticles);
  for (let i = 0; i < n; i++) {
    const p = createParticle(w, h, cfg);
    p.y = randomYInZone(h, zone, "spread");
    p.life = Math.floor(Math.random() * 35);
    splashParticles.push(p);
  }
}

function drawBurst(ctx, x, y, radius, opacity) {
  const rays = 8;
  const inner = radius * 0.15;
  const outer = radius * 2.2;
  ctx.save();
  ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
  ctx.lineWidth = Math.max(1, radius * 0.18);
  ctx.lineCap = "round";
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2 + ((x * 12.9898 + y * 78.233) % 6.28) * 0.15;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * inner, y + Math.sin(a) * inner);
    ctx.lineTo(x + Math.cos(a) * outer, y + Math.sin(a) * outer);
    ctx.stroke();
  }
  ctx.restore();
}

function drawParticle(ctx, p, topEdge) {
  const wobbleX = Math.sin(p.life * 0.045 + p.wobble) * 1.2;
  const x = p.x + wobbleX;
  let y = p.y;

  if (p.phase === "burst") {
    y = Math.max(topEdge, y);
    const fade = Math.max(0, 1 - p.burstTimer / 32);
    drawBurst(ctx, x, y, p.radius, p.opacity * fade);
    return;
  }

  ctx.save();
  ctx.globalAlpha = p.opacity;

  if (p.kind === "ring") {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = Math.max(1, p.radius * 0.14);
    ctx.setLineDash([Math.max(3, p.radius * 0.55), Math.max(2, p.radius * 0.4)]);
    ctx.beginPath();
    ctx.arc(x, y, p.radius, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1.5, p.radius * 0.5), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function updateParticles(dt, w, h, cfg) {
  const zone = cfg.zone || getBubbleZone();
  const yBottom = h * zone.bottom;
  const topEdge = cfg.topEdgePx;

  splashSpawnAcc += cfg.spawnRate * (dt / 16.67);
  while (splashSpawnAcc >= 1) {
    splashSpawnAcc -= 1;
    if (splashParticles.length < cfg.maxParticles) {
      splashParticles.push(createParticle(w, h, cfg));
    }
  }

  if (splashParticles.length > cfg.maxParticles) {
    splashParticles.length = cfg.maxParticles;
  }

  splashParticles = splashParticles.filter((p) => {
    p.life += 1;

    if (p.phase === "burst") {
      p.burstTimer += 1;
      return p.burstTimer < 34;
    }

    p.x += p.vx;
    p.y += p.vy;

    if (p.y <= topEdge + p.radius * 0.35) {
      p.phase = "burst";
      p.burstTimer = 0;
      p.y = topEdge;
      return true;
    }

    const inZone = p.y >= 0 && p.y <= yBottom;
    const randomBurst =
      inZone &&
      p.y > topEdge + 40 &&
      Math.random() < cfg.burstChance;

    if (randomBurst) {
      p.phase = "burst";
      p.burstTimer = 0;
      return true;
    }

    return p.y < yBottom + 24 && p.life < p.maxLife * 1.5;
  });
}

function splashLoop(timestamp) {
  if (!splashCtx || !splashCanvas) return;

  const dt = splashLastTime ? Math.min(timestamp - splashLastTime, 50) : 16.67;
  splashLastTime = timestamp;

  const w = splashLogicalW;
  const h = splashLogicalH;
  if (w < 10 || h < 10) {
    resizeSplashCanvas();
    splashAnimId = requestAnimationFrame(splashLoop);
    return;
  }

  const cfg = getBubbleConfig();

  splashCtx.clearRect(0, 0, w, h);
  updateParticles(dt, w, h, cfg);
  splashParticles.forEach((p) =>
    drawParticle(splashCtx, p, cfg.topEdgePx)
  );

  splashAnimId = requestAnimationFrame(splashLoop);
}

function resizeSplashCanvas() {
  if (!splashCanvas || !splashCtx) return;

  const rect = splashCanvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  splashLogicalW = Math.max(1, rect.width);
  splashLogicalH = Math.max(1, rect.height);

  splashCanvas.width = Math.floor(splashLogicalW * dpr);
  splashCanvas.height = Math.floor(splashLogicalH * dpr);

  splashCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function startSplashBubbles() {
  splashCanvas = document.getElementById("splash-bubbles");
  if (!splashCanvas) return;

  splashCtx = splashCanvas.getContext("2d");
  if (!splashCtx) return;

  const boot = () => {
    resizeSplashCanvas();
    const cfg = getBubbleConfig();
    seedParticles(cfg.seedCount, splashLogicalW, splashLogicalH, cfg);
    splashLastTime = 0;
    splashSpawnAcc = 0;
    if (splashAnimId) cancelAnimationFrame(splashAnimId);
    splashAnimId = requestAnimationFrame(splashLoop);
  };

  requestAnimationFrame(() => requestAnimationFrame(boot));
}

function stopSplashBubbles() {
  if (splashAnimId) {
    cancelAnimationFrame(splashAnimId);
    splashAnimId = null;
  }
}

window.stopSplashBubbles = stopSplashBubbles;

function leaveSplashScreen() {
  document.getElementById("opening-strips")?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

function bindSplashNavigation() {
  const splash = document.getElementById("screen-splash");
  if (!splash) return;

  let touchStartY = 0;
  let touchStartX = 0;

  splash.addEventListener("click", () => leaveSplashScreen());

  splash.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );

  splash.addEventListener(
    "touchend",
    (e) => {
      const dy = touchStartY - e.changedTouches[0].clientY;
      const dx = Math.abs(touchStartX - e.changedTouches[0].clientX);
      if (dy > 40 && dx < 80) leaveSplashScreen();
    },
    { passive: true }
  );
}

async function initSplash() {
  await loadBubbleConfig();
  bindSplashNavigation();
  startSplashBubbles();

  window.addEventListener("resize", resizeSplashCanvas);

  const splash = document.getElementById("screen-splash");
  if (splash && typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(() => {
      resizeSplashCanvas();
    });
    ro.observe(splash);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initSplash());
} else {
  initSplash();
}

window.leaveSplashScreen = leaveSplashScreen;
