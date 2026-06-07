/**
 * 第一页：铜版条陈列、What is Gin 视差与滚入、进入游戏
 * 不修改 splash.js
 */

/** 五幅铜版条 — 预留未来橙波交互（ff7d00）与世纪花体字图层 */
const ERA_STRIPS = [
  { id: "13th",   label: "13th century",      image: "assets/page1/13th century.png" },
  { id: "17th",   label: "17th century",      image: "assets/page1/17th century.png" },
  { id: "18th",   label: "18th century",      image: "assets/page1/18th century.png" },
  { id: "19-20th",label: "19th–20th century", image: "assets/page1/19-20th century.png" },
  { id: "21st",   label: "21st century",      image: "assets/page1/Now 21th century.png" },
];

const ERA_INTERACTION_COLOR = "#ff7d00";

function buildEraStrips() {
  const row = document.getElementById("era-strips-row");
  if (!row) return;

  ERA_STRIPS.forEach((era) => {
    // 外层 wrap：负责滚动滑入动画
    const wrap = document.createElement("div");
    wrap.className = "era-strip-wrap";

    // 内层 article：负责鼠标视差
    const el = document.createElement("article");
    el.className = "era-strip";
    el.dataset.eraId = era.id;
    el.dataset.eraLabel = era.label;
    el.dataset.interactive = "pending";
    el.dataset.accentColor = ERA_INTERACTION_COLOR;
    el.setAttribute("role", "presentation");
    el.setAttribute("aria-label", `${era.label}（交互预留）`);

    el.style.border = "none";
    el.style.outline = "none";
    el.innerHTML = `<img src="${era.image}" alt="${era.label} 铜版画" loading="lazy" />`;

    wrap.appendChild(el);
    row.appendChild(wrap);
  });
}

/** 铜版条逐条从下方滑入（滚动触发，每条错开 110ms） */
function initStripReveal() {
  const row = document.getElementById("era-strips-row");
  if (!row) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const wraps = row.querySelectorAll(".era-strip-wrap");
        wraps.forEach((wrap, i) => {
          setTimeout(() => wrap.classList.add("strip-visible"), i * 110);
        });
        observer.disconnect();
      });
    },
    { threshold: 0.08 }
  );

  observer.observe(row);
}

/** 铜版条整体鼠标视差 —— 随鼠标在 strips-row 内微移 */
function initStripParallax() {
  const row = document.getElementById("era-strips-row");
  if (!row) return;

  const MAX_X = 7;   // 水平最大偏移 px，改这里调强度
  const MAX_Y = 4;   // 垂直最大偏移 px

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  function onMove(e) {
    const rect = row.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    targetX = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
    targetY = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));
  }

  function tick() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    const tf = `translate(${currentX * MAX_X}px, ${currentY * MAX_Y}px)`;

    row.querySelectorAll(".era-strip").forEach((strip) => {
      strip.style.transform = tf;
    });

    // 所有面板与铜版条完全同步视差——不会露出面板背后的铜版条
    row.querySelectorAll('.era-slide-panel').forEach(p => p.style.transform = tf);

    requestAnimationFrame(tick);
  }

  row.addEventListener("mousemove", onMove);
  row.addEventListener("mouseleave", () => { targetX = 0; targetY = 0; });

  tick();
}

function initParallax() {
  const zone = document.getElementById("wig-parallax-zone");
  const bar = zone?.querySelector(".wig-orange-bar");
  const glassWrap = zone?.querySelector(".wig-glass-wrap");
  const glassImg = zone?.querySelector(".wig-glass");   // 酒杯图片

  if (!zone || !bar || !glassWrap) return;

  const MAX_BAR   = 10;
  const MAX_GLASS = 14;

  // ── 阴影参数（改这里调效果） ──────────────────────────────
  const SHADOW_X     = 20;    // 水平最大偏移 px（越大鼠标移动时影子飘得越远）
  const SHADOW_Y_BASE= 16;    // 默认向下偏移 px（模拟重力感）
  const SHADOW_Y     = 10;    // 垂直额外范围 px
  const SHADOW_BLUR  = 5;     // 模糊半径 px（越小轮廓越清晰，0=完全清晰）
  const SHADOW_DARK  = 0.50;  // 阴影深浅 0–1（越大越黑）
  // ────────────────────────────────────────────────────────

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  function onMove(e) {
    const rect = zone.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = (e.clientX - cx) / (rect.width / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);
    targetX = Math.max(-1, Math.min(1, nx));
    targetY = Math.max(-1, Math.min(1, ny));
  }

  function tick() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    bar.style.transform = `translate(calc(-50% + ${currentX * MAX_BAR}px), calc(-50% + ${currentY * MAX_BAR * 0.4}px))`;
    glassWrap.style.transform = `translate(${currentX * MAX_GLASS}px, ${currentY * MAX_GLASS * 0.45}px)`;

    // 轮廓阴影：方向与鼠标相反，模拟光源从鼠标方向照射
    if (glassImg) {
      const sx = -currentX * SHADOW_X;
      const sy = SHADOW_Y_BASE + currentY * SHADOW_Y;
      glassImg.style.filter =
        `drop-shadow(${sx}px ${sy}px ${SHADOW_BLUR}px rgba(0,0,0,${SHADOW_DARK}))`;
    }

    requestAnimationFrame(tick);
  }

  zone.addEventListener("mousemove", onMove);
  zone.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
  });

  tick();
}

// ═══════════════════════════════════════════════════════
//  全局互斥锁：同一时间只允许一条铜版条展开
//  点击任意铜版条 → lockStrips()
//  重置完成后   → unlockStrips()
// ═══════════════════════════════════════════════════════
let _stripLocked = false;
function lockStrips()   { _stripLocked = true;  }
function unlockStrips() { _stripLocked = false; }

// ═══════════════════════════════════════════════════════
//  13th Century 铜板条交互
// ═══════════════════════════════════════════════════════

// ── 动效速度（改这里调整所有时间）──────────────────────────
const STRIP_T = {
  WAVE:    400,  // ms  水波从下涌满整条的时长
  TEXT_IN: 1000,  // ms  TEXT.png淡入时长
  PAUSE:   600,  // ms  填满后停顿再开始滑动
  SLIDE:   520,  // ms  橙色向右扩展时长
  STAGGER: 130,  // ms  每段文字依次浮现的间隔
};
// ──────────────────────────────────────────────────────

/** Canvas 水波从下向上涌满动画 */
function animateWaveRise(canvas, duration, callback) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let t0 = null, phase = 0;

  function frame(ts) {
    if (!t0) t0 = ts;
    const prog = Math.min((ts - t0) / duration, 1);
    phase += 0.07;
    ctx.clearRect(0, 0, W, H);

    // 填充面从底部升起；振幅随填充减小
    const fillY = H * (1 - prog);
    const amp   = 14 * (1 - prog * 0.75);

    ctx.beginPath();
    ctx.moveTo(-1, H + 1);
    ctx.lineTo(-1, fillY);
    for (let x = 0; x <= W + 1; x++) {
      ctx.lineTo(x, fillY + Math.sin(x * 0.055 + phase) * amp);
    }
    ctx.lineTo(W + 1, H + 1);
    ctx.closePath();
    ctx.fillStyle = '#ff7d00';
    ctx.fill();

    if (prog < 1) {
      requestAnimationFrame(frame);
    } else {
      ctx.fillRect(0, 0, W, H); // 最后帧确保完全填满
      callback?.();
    }
  }
  requestAnimationFrame(frame);
}

/** 13th Century 铜板条：悬浮水波预览，点击弹出面板 */
function init13thInteraction() {
  const row    = document.getElementById('era-strips-row');
  if (!row) return;
  const wrap13  = row.querySelector('.era-strip-wrap');
  const strip13 = wrap13?.querySelector('.era-strip');
  if (!wrap13 || !strip13) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'strip-wave-canvas';
  strip13.appendChild(canvas);

  const stripImg = strip13.querySelector('img');

  const textP1 = document.createElement('img');
  textP1.className = 'strip-text-overlay';
  textP1.src = 'assets/page1/13th%20century-TEXT.png';
  textP1.style.width = '72%';
  strip13.appendChild(textP1);

  const textP2 = document.createElement('img');
  textP2.className = 'strip-text-overlay';
  textP2.src = 'assets/page1/13th%20Century-Text%2BOrange.png';
  textP2.style.width = '72%';
  strip13.appendChild(textP2);

  const panel = document.createElement('div');
  panel.className = 'era-slide-panel';
  panel.innerHTML = `
    <div class="era-panel-content">
      <h2 class="era-panel-title">13th Century ·<br>Origins in the Monastery</h2>
      <div class="era-panel-body">
        <p>The earliest written reference to gin appears in the 13th-century encyclopaedic work <em>Der Naturen Bloeme</em> from Bruges.</p>
        <p>It was a distilled wine infused with juniper berries, serving as a fiery medicinal tonic, since juniper had long been a staple in doctors' kits.</p>
        <p>During the Black Death, plague doctors even stuffed their beaked masks with juniper berries, believing it offered protection from disease.</p>
        <p>At the time, apothecaries across Europe dispensed juniper tonic wines for coughs, pains, cramps, and all manner of ailments.</p>
        <p>These proved enormously popular — perhaps a little too popular — as people began to realise the drinks were being consumed for pleasure rather than for medicine.</p>
      </div>
    </div>`;
  row.appendChild(panel);

  wrap13.style.cursor = 'pointer';
  let triggered = false;
  let resetHandler = null;
  let hovering  = false;
  let hoverGen  = 0;

  // ── 关闭：还原五条 ────────────────────────────────────────
  function resetToStrips() {
    if (resetHandler) {
      document.removeEventListener('click', resetHandler, true);
      resetHandler = null;
    }
    panel.style.transition = `width ${STRIP_T.SLIDE}ms cubic-bezier(0.4,0,0.2,1)`;
    panel.style.width = '0';
    textP2.style.transition = 'opacity 250ms ease'; textP2.style.opacity = '0';
    canvas.style.transition = 'opacity 250ms ease'; canvas.style.opacity = '0';
    panel.querySelectorAll('.era-panel-title, .era-panel-body p')
         .forEach(el => el.classList.remove('revealed'));
    setTimeout(() => {
      panel.style.height = '0';   // ★ Bug修复：重置高度防止页面拉伸
      triggered = false;
      hovering  = false;
      unlockStrips();
    }, STRIP_T.SLIDE + 80);
  }

  // ── 悬浮进入：水波涌上 + TEXT.png ────────────────────────
  strip13.addEventListener('mouseenter', () => {
    if (triggered || _stripLocked) return;
    hovering = true;
    const gen = ++hoverGen;
    canvas.width  = wrap13.offsetWidth;
    canvas.height = wrap13.offsetHeight;
    canvas.style.transition = '';
    canvas.style.opacity    = '1';
    animateWaveRise(canvas, STRIP_T.WAVE, () => {
      if (gen !== hoverGen || !hovering || triggered) return;
      textP1.style.transition = `opacity ${STRIP_T.TEXT_IN}ms ease`;
      textP1.style.opacity    = '1';
    });
  });

  // ── 悬浮离开：还原铜版画 ──────────────────────────────────
  strip13.addEventListener('mouseleave', () => {
    if (triggered) return;
    hovering = false;
    ++hoverGen;
    canvas.style.transition = 'opacity 400ms ease'; canvas.style.opacity = '0';
    textP1.style.transition = 'opacity 300ms ease'; textP1.style.opacity = '0';
  });

  // ── 点击：按压反馈 → 恢复原图+橙字 → 面板弹出 ─────────────
  strip13.addEventListener('click', () => {
    if (triggered || _stripLocked) return;
    lockStrips();
    triggered = true;
    hovering  = false;
    ++hoverGen;

    wrap13.style.transition = 'transform 0.10s ease-in';
    wrap13.style.transform  = 'scale(0.97)';
    if (stripImg) { stripImg.style.transition = 'filter 0.08s ease'; stripImg.style.filter = 'brightness(0.62)'; }
    setTimeout(() => {
      wrap13.style.transition = 'transform 0.22s ease-out';
      wrap13.style.transform  = 'scale(1)';
      if (stripImg) { stripImg.style.transition = 'filter 0.30s ease'; stripImg.style.filter = ''; }
    }, 130);

    setTimeout(() => {
      wrap13.style.transition = ''; wrap13.style.transform = '';

      // 恢复铜版画原图
      canvas.style.transition = 'opacity 300ms ease'; canvas.style.opacity = '0';
      // 换橙色字图
      textP1.style.transition = 'opacity 200ms ease'; textP1.style.opacity = '0';
      textP2.style.transition = 'opacity 200ms ease'; textP2.style.opacity = '1';

      // 面板向右展开
      const rowRect = row.getBoundingClientRect();
      const sRight  = wrap13.getBoundingClientRect().right - rowRect.left;  /* 第1条右缘(相对row真实位置) */
      const panelW  = row.offsetWidth - sRight;
      panel.style.left   = sRight + 'px';
      panel.style.height = wrap13.offsetHeight + 'px';
      panel.style.width  = '0px';
      panel.getBoundingClientRect();
      panel.style.transition = `width ${STRIP_T.SLIDE}ms cubic-bezier(0.4,0,0.2,1)`;
      panel.style.width = panelW + 'px';

      // 文字逐段浮现
      const els = panel.querySelectorAll('.era-panel-title, .era-panel-body p');
      els.forEach((el, i) => setTimeout(() => el.classList.add('revealed'), STRIP_T.SLIDE + 60 + i * STRIP_T.STAGGER));

      const doneIn = STRIP_T.SLIDE + 60 + els.length * STRIP_T.STAGGER + 350;
      setTimeout(() => {
        resetHandler = (e) => { if (e.target.closest('.era-slide-panel')) return; resetToStrips(); };
        document.addEventListener('click', resetHandler, true);
      }, doneIn);
    }, 310);
  });
}

/** 17th Century 铜板条：左右双橙色面板交互 */
function init17thInteraction() {
  const row      = document.getElementById('era-strips-row');
  if (!row) return;
  const allWraps = row.querySelectorAll('.era-strip-wrap');
  const wrap17   = allWraps[1];
  const strip17  = wrap17?.querySelector('.era-strip');
  if (!wrap17 || !strip17) return;

  // ── DOM 元素创建 ──────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.className = 'strip-wave-canvas';
  strip17.appendChild(canvas);

  const stripImg = strip17.querySelector('img');

  const textP1 = document.createElement('img');
  textP1.className = 'strip-text-overlay';
  textP1.src = 'assets/page1/17th%20century%20TEXT.png';
  textP1.style.width = '72%';   /* ← TEXT.png 大小：改这里 */
  strip17.appendChild(textP1);

  const textP2 = document.createElement('img');
  textP2.className = 'strip-text-overlay';
  textP2.src = 'assets/page1/17th%20century%20TEXT%2BOrange.png';
  textP2.style.width = '72%';   /* ← Text+Orange.png 大小：改这里 */
  strip17.appendChild(textP2);

  // ── 左侧面板（铜板条2橙1）：与铜板条1等宽，向左展开 ──────────
  const panelLeft = document.createElement('div');
  panelLeft.className = 'era-slide-panel';
  panelLeft.innerHTML = `
    <div class="era-panel-content era-panel-content--left">
      <div class="era-panel-body era-panel-body--sm">
        <p>(Jenever is the original Dutch/Belgian malt-wine-based spirit that gin originates from — think of jenever as the ancestor, and gin as the lighter, more aromatic English evolution of it.)</p>
      </div>
      <h2 class="era-panel-title era-panel-title--sub">What<br>is<br>Jenever</h2>
    </div>`;
  row.appendChild(panelLeft);

  // ── 右侧面板（铜板条2橙2）：从铜板条2右侧延伸到铜板条5右边线 ──
  const panelRight = document.createElement('div');
  panelRight.className = 'era-slide-panel';
  panelRight.innerHTML = `
    <div class="era-panel-content">
      <h2 class="era-panel-title">17th Century ·<br>From the Pharmacy<br>to the Battlefield</h2>
      <div class="era-panel-body">
        <p>By the mid-17th century, Dutch and Flemish distillers had developed a new method of re-distilling malt wine with juniper, anise, caraway, and coriander, selling the resulting spirit in pharmacies as a treatment for kidney ailments, gout, lumbago, and gallstones.</p>
        <p>As early as 1585, English soldiers supporting the Dutch against Spain in Antwerp were already drinking jenever to steady their nerves before battle, giving rise to the expression "Dutch courage."</p>
        <p>After the Glorious Revolution, the Protestant King William III brought gin to England, where it rapidly displaced French brandy, earning it the contemporary description of a distinctly "Protestant drink."</p>
      </div>
    </div>`;
  row.appendChild(panelRight);

  wrap17.style.cursor = 'pointer';
  let triggered = false;
  let resetHandler = null;
  let hovering  = false;
  let hoverGen  = 0;

  // ── 关闭 ──────────────────────────────────────────────────
  function resetToStrips() {
    if (resetHandler) { document.removeEventListener('click', resetHandler, true); resetHandler = null; }
    const slideMs = `width ${STRIP_T.SLIDE}ms cubic-bezier(0.4,0,0.2,1)`;
    panelLeft.style.transition  = slideMs; panelLeft.style.width  = '0';
    panelRight.style.transition = slideMs; panelRight.style.width = '0';
    textP1.style.transition = 'opacity 250ms ease'; textP1.style.opacity = '0';
    textP2.style.transition = 'opacity 250ms ease'; textP2.style.opacity = '0';
    canvas.style.transition = 'opacity 250ms ease'; canvas.style.opacity = '0';
    [panelLeft, panelRight].forEach(p =>
      p.querySelectorAll('.era-panel-title, .era-panel-body p').forEach(el => el.classList.remove('revealed'))
    );
    setTimeout(() => {
      panelLeft.style.height = '0'; panelRight.style.height = '0'; // ★ Bug修复
      triggered = false; hovering = false; unlockStrips();
    }, STRIP_T.SLIDE + 80);
  }

  // ── 悬浮进入：水波 + TEXT.png ─────────────────────────────
  strip17.addEventListener('mouseenter', () => {
    if (triggered || _stripLocked) return;
    hovering = true;
    const gen = ++hoverGen;
    canvas.width  = wrap17.offsetWidth; canvas.height = wrap17.offsetHeight;
    canvas.style.transition = ''; canvas.style.opacity = '1';
    animateWaveRise(canvas, STRIP_T.WAVE, () => {
      if (gen !== hoverGen || !hovering || triggered) return;
      textP1.style.transition = `opacity ${STRIP_T.TEXT_IN}ms ease`;
      textP1.style.opacity    = '1';
    });
  });

  // ── 悬浮离开 ──────────────────────────────────────────────
  strip17.addEventListener('mouseleave', () => {
    if (triggered) return;
    hovering = false; ++hoverGen;
    canvas.style.transition = 'opacity 400ms ease'; canvas.style.opacity = '0';
    textP1.style.transition = 'opacity 300ms ease'; textP1.style.opacity = '0';
  });

  // ── 点击：按压 → 恢复原图+橙字 → 双面板弹出 ──────────────
  strip17.addEventListener('click', () => {
    if (triggered || _stripLocked) return;
    lockStrips(); triggered = true; hovering = false; ++hoverGen;

    wrap17.style.transition = 'transform 0.10s ease-in'; wrap17.style.transform = 'scale(0.97)';
    if (stripImg) { stripImg.style.transition = 'filter 0.08s ease'; stripImg.style.filter = 'brightness(0.62)'; }
    setTimeout(() => {
      wrap17.style.transition = 'transform 0.22s ease-out'; wrap17.style.transform = 'scale(1)';
      if (stripImg) { stripImg.style.transition = 'filter 0.30s ease'; stripImg.style.filter = ''; }
    }, 130);

    setTimeout(() => {
      wrap17.style.transition = ''; wrap17.style.transform = '';

      canvas.style.transition = 'opacity 300ms ease'; canvas.style.opacity = '0';
      textP1.style.transition = 'opacity 200ms ease'; textP1.style.opacity = '0';
      textP2.style.transition = 'opacity 200ms ease'; textP2.style.opacity = '1';

      const stripH  = wrap17.offsetHeight;
      const rowW    = row.offsetWidth;
      const rowRect = row.getBoundingClientRect();
      const r17     = wrap17.getBoundingClientRect();
      const sLeft   = r17.left  - rowRect.left;   /* 被点第2条的左缘(相对row真实位置) */
      const sRight  = r17.right - rowRect.left;   /* 被点第2条的右缘 */

      /* 左右面板严丝合缝贴在被点竖条的左右长边（用真实位置，不留白不多盖） */
      panelLeft.style.left = 'auto'; panelLeft.style.right = (rowW - sLeft) + 'px';
      panelLeft.style.top = '0'; panelLeft.style.height = stripH + 'px'; panelLeft.style.width = '0px';
      panelLeft.getBoundingClientRect();
      panelLeft.style.transition = `width ${STRIP_T.SLIDE}ms cubic-bezier(0.4,0,0.2,1)`;
      panelLeft.style.width = sLeft + 'px';

      panelRight.style.left = sRight + 'px'; panelRight.style.top = '0';
      panelRight.style.height = stripH + 'px'; panelRight.style.width = '0px';
      panelRight.getBoundingClientRect();
      panelRight.style.transition = `width ${STRIP_T.SLIDE}ms cubic-bezier(0.4,0,0.2,1)`;
      panelRight.style.width = (rowW - sRight) + 'px';

      const allEls = [
        ...panelLeft.querySelectorAll('.era-panel-title, .era-panel-body p'),
        ...panelRight.querySelectorAll('.era-panel-title, .era-panel-body p'),
      ];
      allEls.forEach((el, i) => setTimeout(() => el.classList.add('revealed'), STRIP_T.SLIDE + 60 + i * STRIP_T.STAGGER));

      const doneIn = STRIP_T.SLIDE + 60 + allEls.length * STRIP_T.STAGGER + 350;
      setTimeout(() => {
        resetHandler = (e) => { if (e.target.closest('.era-slide-panel')) return; resetToStrips(); };
        document.addEventListener('click', resetHandler, true);
      }, doneIn);
    }, 310);
  });
}

/** 18th Century 铜板条：左右双橙色面板，对称覆盖铜版条1+2 / 4+5 */
function init18thInteraction() {
  const row      = document.getElementById('era-strips-row');
  if (!row) return;
  const allWraps = row.querySelectorAll('.era-strip-wrap');
  const wrap18   = allWraps[2];                         // 第3条（index 2）
  const strip18  = wrap18?.querySelector('.era-strip');
  if (!wrap18 || !strip18) return;

  // ── DOM 元素创建 ──────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.className = 'strip-wave-canvas';
  strip18.appendChild(canvas);

  const stripImg = strip18.querySelector('img');

  const textP1 = document.createElement('img');
  textP1.className = 'strip-text-overlay';
  textP1.src = 'assets/page1/18th%20Century%20TEXT.png';
  textP1.style.width = '75%';   /* ← TEXT.png 大小：改这里 */
  strip18.appendChild(textP1);

  const textP2 = document.createElement('img');
  textP2.className = 'strip-text-overlay';
  textP2.src = 'assets/page1/18th%20Century%20TEXT%2BOrange.png';
  textP2.style.width = '75%';   /* ← Text+Orange.png 大小：改这里 */
  strip18.appendChild(textP2);

  // ── 左侧面板：标题顶部，正文向下；右对齐 ─────────────────
  const panelLeft = document.createElement('div');
  panelLeft.className = 'era-slide-panel';
  panelLeft.innerHTML = `
    <div class="era-panel-content era-panel-content--18l">
      <h2 class="era-panel-title era-panel-title--18l">18th<br>Century ·</h2>
      <div class="era-panel-body">
        <p>When the British government permitted unlicensed gin production while slapping heavy duties on imported spirits, gin became the most popular, most affordable, and most destructive drink of the time.</p>
        <p>Between 1695 and 1735, thousands of gin shops sprang up across England, and in London, over half of all drinking establishments sold gin.</p>
      </div>
    </div>`;
  row.appendChild(panelLeft);

  // ── 右侧面板：正文顶部，标题底部；左对齐 ─────────────────
  const panelRight = document.createElement('div');
  panelRight.className = 'era-slide-panel';
  panelRight.innerHTML = `
    <div class="era-panel-content era-panel-content--18r">
      <div class="era-panel-body">
        <p>Death rates rose, crime rates soared, and the chaos unleashed by gin ultimately gave rise to the Bow Street Runners, the forerunner of Britain's modern police force.</p>
        <p>The Gin Act of 1736 attempted to restore order, but only provoked riots, with sellers driven underground and the Act repealed by 1742. It was the revised Gin Act of 1751 — combined with rising grain prices — that finally brought the trade under control.</p>
      </div>
      <h2 class="era-panel-title era-panel-title--18r">The Gin Craze<br>and Its<br>Consequences</h2>
    </div>`;
  row.appendChild(panelRight);

  wrap18.style.cursor = 'pointer';
  let triggered = false;
  let resetHandler = null;
  let hovering  = false;
  let hoverGen  = 0;

  // ── 关闭 ──────────────────────────────────────────────────
  function resetToStrips() {
    if (resetHandler) { document.removeEventListener('click', resetHandler, true); resetHandler = null; }
    const slideMs = `width ${STRIP_T.SLIDE}ms cubic-bezier(0.4,0,0.2,1)`;
    panelLeft.style.transition  = slideMs; panelLeft.style.width  = '0';
    panelRight.style.transition = slideMs; panelRight.style.width = '0';
    textP1.style.transition = 'opacity 250ms ease'; textP1.style.opacity = '0';
    textP2.style.transition = 'opacity 250ms ease'; textP2.style.opacity = '0';
    canvas.style.transition = 'opacity 250ms ease'; canvas.style.opacity = '0';
    [panelLeft, panelRight].forEach(p =>
      p.querySelectorAll('.era-panel-title, .era-panel-body p').forEach(el => el.classList.remove('revealed'))
    );
    setTimeout(() => {
      panelLeft.style.height = '0'; panelRight.style.height = '0'; // ★ Bug修复
      triggered = false; hovering = false; unlockStrips();
    }, STRIP_T.SLIDE + 80);
  }

  // ── 悬浮进入：水波 + TEXT.png ─────────────────────────────
  strip18.addEventListener('mouseenter', () => {
    if (triggered || _stripLocked) return;
    hovering = true;
    const gen = ++hoverGen;
    canvas.width  = wrap18.offsetWidth; canvas.height = wrap18.offsetHeight;
    canvas.style.transition = ''; canvas.style.opacity = '1';
    animateWaveRise(canvas, STRIP_T.WAVE, () => {
      if (gen !== hoverGen || !hovering || triggered) return;
      textP1.style.transition = `opacity ${STRIP_T.TEXT_IN}ms ease`;
      textP1.style.opacity    = '1';
    });
  });

  // ── 悬浮离开 ──────────────────────────────────────────────
  strip18.addEventListener('mouseleave', () => {
    if (triggered) return;
    hovering = false; ++hoverGen;
    canvas.style.transition = 'opacity 400ms ease'; canvas.style.opacity = '0';
    textP1.style.transition = 'opacity 300ms ease'; textP1.style.opacity = '0';
  });

  // ── 点击：按压 → 恢复原图+橙字 → 双面板弹出 ──────────────
  strip18.addEventListener('click', () => {
    if (triggered || _stripLocked) return;
    lockStrips(); triggered = true; hovering = false; ++hoverGen;

    wrap18.style.transition = 'transform 0.10s ease-in'; wrap18.style.transform = 'scale(0.97)';
    if (stripImg) { stripImg.style.transition = 'filter 0.08s ease'; stripImg.style.filter = 'brightness(0.62)'; }
    setTimeout(() => {
      wrap18.style.transition = 'transform 0.22s ease-out'; wrap18.style.transform = 'scale(1)';
      if (stripImg) { stripImg.style.transition = 'filter 0.30s ease'; stripImg.style.filter = ''; }
    }, 130);

    setTimeout(() => {
      wrap18.style.transition = ''; wrap18.style.transform = '';

      canvas.style.transition = 'opacity 300ms ease'; canvas.style.opacity = '0';
      textP1.style.transition = 'opacity 200ms ease'; textP1.style.opacity = '0';
      textP2.style.transition = 'opacity 200ms ease'; textP2.style.opacity = '1';

      const stripH  = wrap18.offsetHeight;
      const rowW    = row.offsetWidth;
      const rowRect = row.getBoundingClientRect();
      const r18     = wrap18.getBoundingClientRect();
      const sLeft   = r18.left  - rowRect.left;   /* 被点第3条的左缘(相对row真实位置) */
      const sRight  = r18.right - rowRect.left;   /* 被点第3条的右缘 */

      /* 左右面板严丝合缝贴在被点竖条的左右长边（用真实位置，不留白不多盖） */
      panelLeft.style.left = 'auto'; panelLeft.style.right = (rowW - sLeft) + 'px';
      panelLeft.style.top = '0'; panelLeft.style.height = stripH + 'px'; panelLeft.style.width = '0px';
      panelLeft.getBoundingClientRect();
      panelLeft.style.transition = `width ${STRIP_T.SLIDE}ms cubic-bezier(0.4,0,0.2,1)`;
      panelLeft.style.width = sLeft + 'px';

      panelRight.style.left = sRight + 'px'; panelRight.style.top = '0';
      panelRight.style.height = stripH + 'px'; panelRight.style.width = '0px';
      panelRight.getBoundingClientRect();
      panelRight.style.transition = `width ${STRIP_T.SLIDE}ms cubic-bezier(0.4,0,0.2,1)`;
      panelRight.style.width = (rowW - sRight) + 'px';

      const allEls = [
        ...panelLeft.querySelectorAll('.era-panel-title, .era-panel-body p'),
        ...panelRight.querySelectorAll('.era-panel-body p, .era-panel-title'),
      ];
      allEls.forEach((el, i) => setTimeout(() => el.classList.add('revealed'), STRIP_T.SLIDE + 60 + i * STRIP_T.STAGGER));

      const doneIn = STRIP_T.SLIDE + 60 + allEls.length * STRIP_T.STAGGER + 350;
      setTimeout(() => {
        resetHandler = (e) => { if (e.target.closest('.era-slide-panel')) return; resetToStrips(); };
        document.addEventListener('click', resetHandler, true);
      }, doneIn);
    }, 310);
  });
}

/** 19-20th Century 铜板条：左侧大橙色面板（覆盖条1+2+3）+ 右侧小橙色面板（覆盖条5）*/
function init19thInteraction() {
  const row      = document.getElementById('era-strips-row');
  if (!row) return;
  const allWraps = row.querySelectorAll('.era-strip-wrap');
  const wrap19   = allWraps[3];                         // 第4条（index 3）
  const strip19  = wrap19?.querySelector('.era-strip');
  if (!wrap19 || !strip19) return;

  // ── DOM 元素创建 ──────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.className = 'strip-wave-canvas';
  strip19.appendChild(canvas);

  const stripImg = strip19.querySelector('img');

  const textP1 = document.createElement('img');
  textP1.className = 'strip-text-overlay';
  textP1.src = 'assets/page1/19-20th%20Century%20TEXT.png';
  textP1.style.width = '83%';   /* ← TEXT.png 大小：改这里 */
  strip19.appendChild(textP1);

  const textP2 = document.createElement('img');
  textP2.className = 'strip-text-overlay';
  textP2.src = 'assets/page1/19-20th%20Century%20TEXT%2BOrange.png';
  textP2.style.width = '83%';   /* ← TEXT+Orange.png 大小：改这里 */
  strip19.appendChild(textP2);

  // ── 左侧面板（铜板条4橙1）：覆盖条1+2+3，向左展开，右对齐 ──
  const panelLeft = document.createElement('div');
  panelLeft.className = 'era-slide-panel';
  panelLeft.innerHTML = `
    <div class="era-panel-content era-panel-content--19l">
      <h2 class="era-panel-title era-panel-title--19l">19th–20th Century ·<br>The Birth of<br>Modern Gin</h2>
      <div class="era-panel-body">
        <p>The invention of the column still in the 1820s–30s made the production of neutral spirit practical, bringing the cleaner, crisper "London dry" style to a far wider audience and defining the category for generations.</p>
        <p>In Britain's tropical colonies, gin was mixed with quinine-laced tonic water to mask its bitter medicinal taste, giving birth to the gin and tonic, while the martini (made by gin and dry vermouth) also emerged around the same era.</p>
        <p>During American Prohibition, informally produced "bathtub gin" flooded speakeasies, amplifying gin's disreputable image. The British nickname mother's ruin stuck entered the language as bywords for gin.</p>
      </div>
    </div>`;
  row.appendChild(panelLeft);

  // ── 右侧面板（铜板条4橙2）：覆盖条5，向右展开，左对齐 ──────
  const panelRight = document.createElement('div');
  panelRight.className = 'era-slide-panel';
  panelRight.innerHTML = `
    <div class="era-panel-content era-panel-content--19r">
      <div class="era-panel-body era-panel-body--19r">
        <p>A column still is a tall, continuous distillation device that replaced the traditional pot still. It runs non-stop rather than in batches, producing a much purer, more neutral spirit with higher efficiency.</p>
      </div>
      <h2 class="era-panel-title era-panel-title--19r">What<br>is a<br>Column Still</h2>
    </div>`;
  row.appendChild(panelRight);

  wrap19.style.cursor = 'pointer';
  let triggered = false;
  let resetHandler = null;
  let hovering  = false;
  let hoverGen  = 0;

  // ── 关闭 ──────────────────────────────────────────────────
  function resetToStrips() {
    if (resetHandler) { document.removeEventListener('click', resetHandler, true); resetHandler = null; }
    const slideMs = `width ${STRIP_T.SLIDE}ms cubic-bezier(0.4,0,0.2,1)`;
    panelLeft.style.transition  = slideMs; panelLeft.style.width  = '0';
    panelRight.style.transition = slideMs; panelRight.style.width = '0';
    textP1.style.transition = 'opacity 250ms ease'; textP1.style.opacity = '0';
    textP2.style.transition = 'opacity 250ms ease'; textP2.style.opacity = '0';
    canvas.style.transition = 'opacity 250ms ease'; canvas.style.opacity = '0';
    [panelLeft, panelRight].forEach(p =>
      p.querySelectorAll('.era-panel-title, .era-panel-body p').forEach(el => el.classList.remove('revealed'))
    );
    setTimeout(() => {
      panelLeft.style.height = '0'; panelRight.style.height = '0'; // ★ Bug修复
      triggered = false; hovering = false; unlockStrips();
    }, STRIP_T.SLIDE + 80);
  }

  // ── 悬浮进入：水波 + TEXT.png ─────────────────────────────
  strip19.addEventListener('mouseenter', () => {
    if (triggered || _stripLocked) return;
    hovering = true;
    const gen = ++hoverGen;
    canvas.width  = wrap19.offsetWidth; canvas.height = wrap19.offsetHeight;
    canvas.style.transition = ''; canvas.style.opacity = '1';
    animateWaveRise(canvas, STRIP_T.WAVE, () => {
      if (gen !== hoverGen || !hovering || triggered) return;
      textP1.style.transition = `opacity ${STRIP_T.TEXT_IN}ms ease`;
      textP1.style.opacity    = '1';
    });
  });

  // ── 悬浮离开 ──────────────────────────────────────────────
  strip19.addEventListener('mouseleave', () => {
    if (triggered) return;
    hovering = false; ++hoverGen;
    canvas.style.transition = 'opacity 400ms ease'; canvas.style.opacity = '0';
    textP1.style.transition = 'opacity 300ms ease'; textP1.style.opacity = '0';
  });

  // ── 点击：按压 → 恢复原图+橙字 → 双面板弹出 ──────────────
  strip19.addEventListener('click', () => {
    if (triggered || _stripLocked) return;
    lockStrips(); triggered = true; hovering = false; ++hoverGen;

    wrap19.style.transition = 'transform 0.10s ease-in'; wrap19.style.transform = 'scale(0.97)';
    if (stripImg) { stripImg.style.transition = 'filter 0.08s ease'; stripImg.style.filter = 'brightness(0.62)'; }
    setTimeout(() => {
      wrap19.style.transition = 'transform 0.22s ease-out'; wrap19.style.transform = 'scale(1)';
      if (stripImg) { stripImg.style.transition = 'filter 0.30s ease'; stripImg.style.filter = ''; }
    }, 130);

    setTimeout(() => {
      wrap19.style.transition = ''; wrap19.style.transform = '';

      canvas.style.transition = 'opacity 300ms ease'; canvas.style.opacity = '0';
      textP1.style.transition = 'opacity 200ms ease'; textP1.style.opacity = '0';
      textP2.style.transition = 'opacity 200ms ease'; textP2.style.opacity = '1';

      const stripH  = wrap19.offsetHeight;
      const rowW    = row.offsetWidth;
      const rowRect = row.getBoundingClientRect();
      const r19     = wrap19.getBoundingClientRect();
      const sLeft   = r19.left  - rowRect.left;   /* 被点第4条的左缘(相对row真实位置) */
      const sRight  = r19.right - rowRect.left;   /* 被点第4条的右缘 */

      /* 左右面板严丝合缝贴在被点竖条的左右长边（用真实位置，不留白不多盖） */
      panelLeft.style.left = 'auto'; panelLeft.style.right = (rowW - sLeft) + 'px';
      panelLeft.style.top = '0'; panelLeft.style.height = stripH + 'px'; panelLeft.style.width = '0px';
      panelLeft.getBoundingClientRect();
      panelLeft.style.transition = `width ${STRIP_T.SLIDE}ms cubic-bezier(0.4,0,0.2,1)`;
      panelLeft.style.width = sLeft + 'px';

      panelRight.style.left = sRight + 'px'; panelRight.style.top = '0';
      panelRight.style.height = stripH + 'px'; panelRight.style.width = '0px';
      panelRight.getBoundingClientRect();
      panelRight.style.transition = `width ${STRIP_T.SLIDE}ms cubic-bezier(0.4,0,0.2,1)`;
      panelRight.style.width = (rowW - sRight) + 'px';

      const allEls = [
        ...panelLeft.querySelectorAll('.era-panel-title, .era-panel-body p'),
        ...panelRight.querySelectorAll('.era-panel-body p, .era-panel-title'),
      ];
      allEls.forEach((el, i) => setTimeout(() => el.classList.add('revealed'), STRIP_T.SLIDE + 60 + i * STRIP_T.STAGGER));

      const doneIn = STRIP_T.SLIDE + 60 + allEls.length * STRIP_T.STAGGER + 350;
      setTimeout(() => {
        resetHandler = (e) => { if (e.target.closest('.era-slide-panel')) return; resetToStrips(); };
        document.addEventListener('click', resetHandler, true);
      }, doneIn);
    }, 310);
  });
}

function initScrollReveal() {
  const group = document.getElementById("wig-reveal");
  if (!group) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          group.classList.add("is-visible");
          observer.disconnect();
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
  );

  observer.observe(group);
}

/** 21st Century 铜板条（第5条，最右侧）：向左展开单橙色面板，覆盖条1-4 */
function init21stInteraction() {
  const row = document.getElementById('era-strips-row');
  if (!row) return;
  const allWraps = row.querySelectorAll('.era-strip-wrap');
  const wrap21   = allWraps[4];                          // 第5条（index 4）
  const strip21  = wrap21?.querySelector('.era-strip');
  if (!wrap21 || !strip21) return;

  // ── DOM 元素创建 ──────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.className = 'strip-wave-canvas';
  strip21.appendChild(canvas);

  const stripImg = strip21.querySelector('img');

  const textP1 = document.createElement('img');
  textP1.className = 'strip-text-overlay';
  textP1.src = 'assets/page1/21th%20Century%20TEXT.png';
  textP1.style.width = '83%';   /* ← TEXT.png 大小：改这里 */
  strip21.appendChild(textP1);

  const textP2 = document.createElement('img');
  textP2.className = 'strip-text-overlay';
  textP2.src = 'assets/page1/21th%20Century%20TEXT%2BOrange.png';
  textP2.style.width = '83%';   /* ← TEXT+Orange.png 大小：改这里 */
  strip21.appendChild(textP2);

  // ── 面板（向左展开，右边缘锚定在铜版条5的左边界）────────────
  const panel = document.createElement('div');
  panel.className = 'era-slide-panel';
  panel.innerHTML = `
    <div class="era-panel-content era-panel-content--21st">
      <h2 class="era-panel-title era-panel-title--21st">21st Century (Now) ·<br>The Craft Revival</h2>
      <div class="era-panel-body era-panel-body--21st">
        <p>Since around 2013, gin has undergone a remarkable global renaissance. A wave of new distilleries and independent producers has flooded the market, driving various innovations for this drink with a history.</p>
        <p>Flavoured expressions, like pink gin, rhubarb gin, blood orange, violet, and spiced, have broadened gin's appeal far beyond its traditional audience.</p>
        <p>But even setting aside innovations based on the classics, gin itself is one of the five major spirits used in cocktails (vodka, rum, tequila, whisky, and gin). As long as people continue to enjoy alcohol and its distinctive botanical aromas, gin is destined to endure and flourish on the palates of humanity.</p>
      </div>
    </div>`;
  row.appendChild(panel);

  wrap21.style.cursor = 'pointer';
  let triggered = false;
  let resetHandler = null;
  let hovering  = false;
  let hoverGen  = 0;

  // ── 关闭 ──────────────────────────────────────────────────
  function resetToStrips() {
    if (resetHandler) { document.removeEventListener('click', resetHandler, true); resetHandler = null; }
    panel.style.transition = `width ${STRIP_T.SLIDE}ms cubic-bezier(0.4,0,0.2,1)`;
    panel.style.width = '0';
    textP2.style.transition = 'opacity 250ms ease'; textP2.style.opacity = '0';
    canvas.style.transition = 'opacity 250ms ease'; canvas.style.opacity = '0';
    panel.querySelectorAll('.era-panel-title, .era-panel-body p')
         .forEach(el => el.classList.remove('revealed'));
    setTimeout(() => {
      panel.style.height = '0';   // ★ Bug修复
      triggered = false; hovering = false; unlockStrips();
    }, STRIP_T.SLIDE + 80);
  }

  // ── 悬浮进入：水波 + TEXT.png ─────────────────────────────
  strip21.addEventListener('mouseenter', () => {
    if (triggered || _stripLocked) return;
    hovering = true;
    const gen = ++hoverGen;
    canvas.width  = wrap21.offsetWidth; canvas.height = wrap21.offsetHeight;
    canvas.style.transition = ''; canvas.style.opacity = '1';
    animateWaveRise(canvas, STRIP_T.WAVE, () => {
      if (gen !== hoverGen || !hovering || triggered) return;
      textP1.style.transition = `opacity ${STRIP_T.TEXT_IN}ms ease`;
      textP1.style.opacity    = '1';
    });
  });

  // ── 悬浮离开 ──────────────────────────────────────────────
  strip21.addEventListener('mouseleave', () => {
    if (triggered) return;
    hovering = false; ++hoverGen;
    canvas.style.transition = 'opacity 400ms ease'; canvas.style.opacity = '0';
    textP1.style.transition = 'opacity 300ms ease'; textP1.style.opacity = '0';
  });

  // ── 点击：按压 → 恢复原图+橙字 → 面板向左弹出 ────────────
  strip21.addEventListener('click', () => {
    if (triggered || _stripLocked) return;
    lockStrips(); triggered = true; hovering = false; ++hoverGen;

    wrap21.style.transition = 'transform 0.10s ease-in'; wrap21.style.transform = 'scale(0.97)';
    if (stripImg) { stripImg.style.transition = 'filter 0.08s ease'; stripImg.style.filter = 'brightness(0.62)'; }
    setTimeout(() => {
      wrap21.style.transition = 'transform 0.22s ease-out'; wrap21.style.transform = 'scale(1)';
      if (stripImg) { stripImg.style.transition = 'filter 0.30s ease'; stripImg.style.filter = ''; }
    }, 130);

    setTimeout(() => {
      wrap21.style.transition = ''; wrap21.style.transform = '';

      canvas.style.transition = 'opacity 300ms ease'; canvas.style.opacity = '0';
      textP1.style.transition = 'opacity 200ms ease'; textP1.style.opacity = '0';
      textP2.style.transition = 'opacity 200ms ease'; textP2.style.opacity = '1';

      const strip21W = wrap21.offsetWidth;
      const panelW   = row.offsetWidth - strip21W;
      panel.style.left = ''; panel.style.right = strip21W + 'px';
      panel.style.height = wrap21.offsetHeight + 'px'; panel.style.width = '0px';
      panel.getBoundingClientRect();
      panel.style.transition = `width ${STRIP_T.SLIDE}ms cubic-bezier(0.4,0,0.2,1)`;
      panel.style.width = panelW + 'px';

      const els = panel.querySelectorAll('.era-panel-title, .era-panel-body p');
      els.forEach((el, i) => setTimeout(() => el.classList.add('revealed'), STRIP_T.SLIDE + 60 + i * STRIP_T.STAGGER));

      const doneIn = STRIP_T.SLIDE + 60 + els.length * STRIP_T.STAGGER + 350;
      setTimeout(() => {
        resetHandler = (e) => { if (e.target.closest('.era-slide-panel')) return; resetToStrips(); };
        document.addEventListener('click', resetHandler, true);
      }, doneIn);
    }, 310);
  });
}

function enterGameFromPageOne() {
  document.body.classList.remove("mode-opening");
  const opening = document.getElementById("opening-scroll");
  if (opening) opening.style.display = "none";

  if (typeof window.showScreen === "function") {
    window.showScreen("screen-start");
  } else {
    document.querySelectorAll("#app > .screen").forEach((el) => el.classList.remove("active"));
    document.getElementById("screen-start")?.classList.add("active");
  }

  window.scrollTo(0, 0);
}

function initEnterGameButton() {
  document.getElementById("btn-enter-game")?.addEventListener("click", enterGameFromPageOne);
}

function initPageOne() {
  buildEraStrips();
  initStripReveal();       // 铜版条滚动滑入
  initStripParallax();     // 铜版条鼠标视差
  init13thInteraction();   // 13th century 点击展开交互
  init17thInteraction();   // 17th century 左右双面板交互
  init18thInteraction();   // 18th century 左右双面板交互
  init19thInteraction();   // 19-20th century 左右双面板交互
  init21stInteraction();   // 21st century 向左单面板交互
  initParallax();          // 酒杯视差
  initScrollReveal();      // What Is Gin 区域滚动显现
  initEnterGameButton();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPageOne);
} else {
  initPageOne();
}

window.enterGameFromPageOne = enterGameFromPageOne;
