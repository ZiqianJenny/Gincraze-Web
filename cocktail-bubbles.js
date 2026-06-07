/**
 * cocktail-bubbles.js v6 — 多鸡尾酒混合气泡系统
 * 支持在同一屏幕上显示多种鸡尾酒类型（Gin&Tonic、Bee's Knees等）
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   调参区 — 通用配置
   ══════════════════════════════════════════════════════════ */
const CB = {
  /* 普通装饰气泡 */
  DOT_COUNT:     5,
  DOT_SIZE_MIN:  4,
  DOT_SIZE_MAX: 30,
  DOT_SPEED_MIN: 20,
  DOT_SPEED_MAX: 50,
  SHAPE_SOLID:  0.30,
  SHAPE_DASHED: 0.45,

  /* 鸡尾酒气泡总数（会随机分配到各种类型） */
  COCKTAIL_N: 6,
  COCKTAIL_SIZE:      40,
  COCKTAIL_SPEED_MIN: 50,
  COCKTAIL_SPEED_MAX: 80,
  COCKTAIL_ROT_SPEED: 0.5,

  /* 展开卡片 */
  CARD_SIZE: 480,

  /* 爆炸粒子效果 */
  EXPLODE_COUNT:    40,
  EXPLODE_LINE_LEN: 15,
  EXPLODE_LINE_W:   2,
  EXPLODE_SPEED:    20,
  EXPLODE_DUR:      580,
};

/* ══════════════════════════════════════════════════════════
   鸡尾酒类型定义 ★ 在这里添加新的鸡尾酒类型
   ══════════════════════════════════════════════════════════ */
const COCKTAIL_TYPES = {
  'gin-tonic': {
    name: 'Gin & Tonic',
    color: '#ea4d00',
    baseUrl: 'assets/page1/GIN%26TONIC/',
    assets: {
      bg:       'Gin%26Tonic-BG.png',
      material: 'Gin%26Tonic-Material.png',
      text:     'Gin%26Tonic-TEXT.png',
      image:    'Gin%26Tonic-Image.png',
      front:    'Gin%26Tonic-Front%20Side.png',
      star2:    'assets/page1/APNG%20Stars/White%20Star%202.png',
      star4:    'assets/page1/APNG%20Stars/White%20Star%204.png',
    },
    layers: [
      { key: 'bg',       scale: 1.00, ox:  0.00, oy:  0.00, par: 0,    shadow: false },
      { key: 'material', scale: 0.25, ox:  0.34, oy:  0.11, par: 0.04, shadow: false },
      { key: 'text',     scale: 0.40, ox: -0.35, oy:  0.08, par: 0.05, shadow: false },
      { key: 'image',    scale: 0.85, ox:  0.00, oy:  0.04, par: 0.07, shadow: true  },
      { key: 'star2',    scale: 0.50, ox: -0.20, oy: -0.20, par: 0.10, shadow: false },
      { key: 'star4',    scale: 0.35, ox:  0.22, oy:  0.25, par: 0.12, shadow: false },
    ],
  },

  'bees-knees': {
    name: "Bee's Knees",
    color: '#f4c430',
    baseUrl: 'assets/page1/Interactive%20Bubbles/Bee%27s%20Knees/',
    assets: {
      bg:       'Bee%27s%20Knees_Bg.png',
      material: 'Bee%27s%20Knees_Material.png',
      text:     'Bee%27s%20Knees_Origin.png',
      image:    'Bee%27s%20Knees_Img.png',
      front:    'Bee%27s%20Knees_Back.png',
      star2:    'assets/page1/APNG%20Stars/White%20Star%202.png',
      star3:    'assets/page1/APNG%20Stars/White%20Star%203.png',
      star4:    'assets/page1/APNG%20Stars/White%20Star%204.png',
      star5:    'assets/page1/APNG%20Stars/White%20Star%205.png',
    },
    layers: [
      { key: 'bg',       scale: 1.00, ox:  0.00, oy:  0.00, par: 0,    shadow: false },
      { key: 'material', scale: 0.25, ox:  0.30, oy:  0.05, par: 0.04, shadow: false },
      { key: 'text',     scale: 0.35, ox: -0.30, oy:  0.08, par: 0.05, shadow: false },
      { key: 'image',    scale: 0.85, ox:  0.00, oy:  0.04, par: 0.07, shadow: true  },
      { key: 'star2',    scale: 0.35, ox: -0.30, oy: -0.20, par: 0.10, shadow: false },
      { key: 'star3',    scale: 0.15, ox:  0.19, oy: -0.33, par: 0.11, shadow: false },
      { key: 'star4',    scale: 0.25, ox:  0.35, oy: -0.05, par: 0.12, shadow: false },
      { key: 'star5',    scale: 0.70, ox:  0.15, oy:  0.20, par: 0.10, shadow: false },
    ],
  },

  'gimlet': {
    name: 'Gimlet',
    color: '#00c9b0',
    baseUrl: 'assets/page1/Interactive%20Bubbles/GIMLET/',
    assets: {
      bg:       'Gimlet_Bg.png',
      material: 'Gimlet_Material.png',
      text:     'Gimlet_Origin.png',
      image:    'Gimlet_Img.png',
      front:    'Gimlet_Back.png',
      star2:    'assets/page1/APNG%20Stars/White%20Star%202.png',
      star4:    'assets/page1/APNG%20Stars/White%20Star%204.png',
    },
    layers: [
      { key: 'bg',       scale: 1.00, ox:  0.00, oy:  0.00, par: 0,    shadow: false },
      { key: 'material', scale: 0.25, ox:  0.24, oy: -0.01, par: 0.04, shadow: false },
      { key: 'text',     scale: 0.38, ox: -0.30, oy:  0.06, par: 0.05, shadow: false },
      { key: 'image',    scale: 0.82, ox:  0.05, oy:  0.05, par: 0.07, shadow: true  },
      { key: 'star4',    scale: 0.55, ox:  0.16, oy:  0.25, par: 0.10, shadow: false },
      { key: 'star2',    scale: 0.30, ox:  0.34, oy:  0.08, par: 0.12, shadow: false },
    ],
  },

  'martini': {
    name: 'Martini',
    color: '#e8b800',
    baseUrl: 'assets/page1/Interactive%20Bubbles/Martini/',
    assets: {
      bg:       'Martini_Bg.png',
      material: 'Martini_Material.png',
      text:     'Martini_Origin.png',
      image:    'Martini_Img.png',
      front:    'Martini_Back.png',
      star4a:   'assets/page1/APNG%20Stars/White%20Star%204.png',
      star4b:   'assets/page1/APNG%20Stars/White%20Star%204.png',
    },
    layers: [
      { key: 'bg',       scale: 1.00, ox:  0.00, oy:  0.00, par: 0,    shadow: false },
      { key: 'material', scale: 0.30, ox:  0.25, oy:  0.0, par: 0.04, shadow: false },
      { key: 'text',     scale: 0.45, ox: -0.25, oy:  0.06, par: 0.05, shadow: false },
      { key: 'image',    scale: 0.85, ox:  0.00, oy:  0.04, par: 0.07, shadow: true  },
      { key: 'star4a',   scale: 0.40, ox: -0.27, oy: -0.15, par: 0.10, shadow: false },
      { key: 'star4b',   scale: 0.60, ox:  0.26, oy:  0.15, par: 0.12, shadow: false },
    ],
  },

  'negroni': {
    name: 'Negroni',
    color: '#cc1a00',
    baseUrl: 'assets/page1/Interactive%20Bubbles/NEGRONI/',
    assets: {
      bg:       'Negroni_Bg.png',
      material: 'Negroni_Material.png',
      text:     'Negroni_Origin.png',
      image:    'Negroni_Img.png',
      front:    'Negroni_Back.png',
      star2:    'assets/page1/APNG%20Stars/White%20Star%202.png',
      star4:    'assets/page1/APNG%20Stars/White%20Star%204.png',
    },
    layers: [
      { key: 'bg',       scale: 1.00, ox:  0.00, oy:  0.00, par: 0,    shadow: false },
      { key: 'material', scale: 0.25, ox:  0.35, oy:  0.10, par: 0.04, shadow: false },
      { key: 'text',     scale: 0.38, ox: -0.35, oy:  0.05, par: 0.05, shadow: false },
      { key: 'image',    scale: 0.88, ox:  0.02, oy:  0.02, par: 0.07, shadow: true  },
      { key: 'star2',    scale: 0.22, ox: -0.24, oy: -0.24, par: 0.10, shadow: false },
      { key: 'star4',    scale: 0.50, ox:  0.22, oy:  0.25, par: 0.12, shadow: false },
    ],
  },

  'singapore-sling': {
    name: 'Singapore Sling',
    color: '#c8102e',
    baseUrl: 'assets/page1/Interactive%20Bubbles/Singapore%20Sling/',
    assets: {
      bg:       'Singapore%20Sling_Bg.png',
      material: 'Singapore%20Sling_Material.png',
      text:     'Singapore%20Sling_Origin.png',
      image:    'Singapore%20Sling_Img.png',
      front:    'Singapore%20Sling_Back.png',
      star2:    'assets/page1/APNG%20Stars/White%20Star%202.png',
      star4:    'assets/page1/APNG%20Stars/White%20Star%204.png',
    },
    layers: [
      { key: 'bg',       scale: 1.00, ox:  0.00, oy:  0.00, par: 0,    shadow: false },
      { key: 'material', scale: 0.25, ox:  0.27, oy:  0.12, par: 0.04, shadow: false },
      { key: 'text',     scale: 0.36, ox: -0.24, oy:  0.06, par: 0.05, shadow: false },
      { key: 'image',    scale: 0.82, ox: -0.05, oy:  0.04, par: 0.07, shadow: true  },
      { key: 'star4',    scale: 0.55, ox:  0.25, oy: -0.15, par: 0.10, shadow: false },
      { key: 'star2',    scale: 0.20, ox:  0.17, oy:  0.30, par: 0.12, shadow: false },
    ],
  },

  'tom-collins': {
    name: 'Tom Collins',
    color: '#f0e000',
    baseUrl: 'assets/page1/Interactive%20Bubbles/Tom%20Colins/',
    assets: {
      bg:       'Tom%20Colins_Bg.png',
      material: 'Tom%20Colins_Material.png',
      text:     'Tom%20Colins_Origin.png',
      image:    'Tom%20Colins_Img.png',
      front:    'Tom%20Colins_Back.png',
      star2:    'assets/page1/APNG%20Stars/White%20Star%202.png',
      star4:    'assets/page1/APNG%20Stars/White%20Star%204.png',
    },
    layers: [
      { key: 'bg',       scale: 1.00, ox:  0.00, oy:  0.00, par: 0,    shadow: false },
      { key: 'material', scale: 0.25, ox:  0.30, oy:  0.10, par: 0.04, shadow: false },
      { key: 'text',     scale: 0.33, ox: -0.30, oy:  0.06, par: 0.05, shadow: false },
      { key: 'image',    scale: 0.82, ox:  0.00, oy:  0.04, par: 0.07, shadow: true  },
      { key: 'star4',    scale: 0.60, ox:  0.24, oy: -0.20, par: 0.10, shadow: false },
      { key: 'star2',    scale: 0.40, ox: -0.25, oy:  0.15, par: 0.12, shadow: false },
    ],
  },
};

/* ══════════════════════════════════════════════════════════
   辅助函数：获取鸡尾酒配置
   ══════════════════════════════════════════════════════════ */
function _getCocktailType(typeKey) {
  return COCKTAIL_TYPES[typeKey] || COCKTAIL_TYPES['gin-tonic'];
}

function _getRandomCocktailType() {
  const keys = Object.keys(COCKTAIL_TYPES);
  return keys[Math.floor(Math.random() * keys.length)];
}

/* 返回一个当前屏幕上没有存活气泡正在使用的类型 */
function _getUnusedCocktailType() {
  const used = new Set(_bubbles.filter(b => b.isCocktail && b.alive).map(b => b.type));
  const free = Object.keys(COCKTAIL_TYPES).filter(k => !used.has(k));
  if (free.length === 0) return _getRandomCocktailType();
  return free[Math.floor(Math.random() * free.length)];
}

/* ══════════════════════════════════════════════════════════
   全局状态
   ══════════════════════════════════════════════════════════ */
let _cvs     = null;
let _ctx     = null;
let _bubbles = [];
let _raf     = null;
let _lastTs  = null;
let _running = false;

let _imgFronts = {};  // { 'gin-tonic': Image, 'bees-knees': Image, ... }

let _mouseX = typeof window !== 'undefined' ? window.innerWidth  / 2 : 0;
let _mouseY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

let _state        = null;
let _activeBubble = null;

let _cardEl        = null;
let _cardLayers    = [];
let _cardFixedLeft = 0;
let _cardFixedTop  = 0;

/* ══════════════════════════════════════════════════════════
   初始化
   ══════════════════════════════════════════════════════════ */
function initCocktailBubbles() {
  if (_running) return;
  _running = true;

  /* 预加载所有鸡尾酒类型的 front 图像 */
  Object.entries(COCKTAIL_TYPES).forEach(([typeKey, config]) => {
    const img = new Image();
    img.src = config.baseUrl + config.assets.front;
    _imgFronts[typeKey] = img;
  });

  _cvs = document.createElement('canvas');
  _cvs.id = 'cb-canvas';
  Object.assign(_cvs.style, {
    position:      'fixed',
    top:           '0',
    left:          '0',
    pointerEvents: 'none',
    zIndex:        '9999',
  });

  function _resize() {
    _cvs.width  = window.innerWidth;
    _cvs.height = window.innerHeight;
  }
  _resize();
  window.addEventListener('resize', _resize);
  document.documentElement.appendChild(_cvs);
  _ctx = _cvs.getContext('2d');

  /* 初始散布普通气泡 */
  for (let i = 0; i < CB.DOT_COUNT; i++) {
    _bubbles.push(_spawnBubble(true, false));
  }

  /* 鸡尾酒圆点：错落分布
     前两个已在屏幕内不同高度，其余在屏幕下方依次排队，间距随机 */
  const ON_SCREEN = 2;
  for (let i = 0; i < CB.COCKTAIL_N; i++) {
    const b = _spawnBubble(false, true);
    if (i < ON_SCREEN) {
      b.y = window.innerHeight * (0.15 + i * 0.38 + (Math.random() - 0.5) * 0.12);
    } else {
      b.y = window.innerHeight + CB.COCKTAIL_SIZE * 1.5
          + (i - ON_SCREEN) * (window.innerHeight * 0.45 + Math.random() * window.innerHeight * 0.2);
    }
    b.speed = CB.COCKTAIL_SPEED_MIN + Math.random() * (CB.COCKTAIL_SPEED_MAX - CB.COCKTAIL_SPEED_MIN);
    _bubbles.push(b);
  }

  document.addEventListener('mousemove', _onMouseMove);
  document.addEventListener('click',     _onDocClick, true);

  _raf = requestAnimationFrame(_loop);
}

/* ══════════════════════════════════════════════════════════
   鼠标位置追踪
   ══════════════════════════════════════════════════════════ */
function _onMouseMove(e) {
  _mouseX = e.clientX;
  _mouseY = e.clientY;
}

/* ══════════════════════════════════════════════════════════
   生成气泡
   ══════════════════════════════════════════════════════════ */
function _spawnBubble(scattered, isCocktail) {
  let size;
  if (isCocktail) {
    size = CB.COCKTAIL_SIZE;
  } else {
    const t = Math.random();
    size = CB.DOT_SIZE_MIN + (CB.DOT_SIZE_MAX - CB.DOT_SIZE_MIN) * Math.pow(t, 0.65);
  }

  const x = size / 2 + Math.random() * (window.innerWidth - size);
  const y = scattered
    ? window.innerHeight * 0.05 + Math.random() * window.innerHeight * 0.88
    : window.innerHeight + size + Math.random() * 60;

  const speed = isCocktail
    ? CB.COCKTAIL_SPEED_MIN + Math.random() * (CB.COCKTAIL_SPEED_MAX - CB.COCKTAIL_SPEED_MIN)
    : CB.DOT_SPEED_MIN      + Math.random() * (CB.DOT_SPEED_MAX      - CB.DOT_SPEED_MIN);

  let shape = 'solid';
  if (!isCocktail) {
    const r = Math.random();
    if      (r < CB.SHAPE_SOLID)                   shape = 'solid';
    else if (r < CB.SHAPE_SOLID + CB.SHAPE_DASHED) shape = 'dashed';
    else                                            shape = 'burst';
  }

  const rotSpeed = isCocktail
    ? (Math.random() < 0.5 ? 1 : -1) * CB.COCKTAIL_ROT_SPEED
    : (Math.random() < 0.5 ? 1 : -1) * (0.2 + Math.random() * 0.6);

  const circumference = Math.PI * size;
  const dashCount = Math.max(4, Math.round(circumference / 14));
  const dashLen   = circumference / dashCount * 0.55;
  const dashGap   = circumference / dashCount * 0.45;
  const rayCount  = 6 + Math.floor(Math.random() * 7);

  return {
    x, y, size, speed,
    vx: 0, vy: 0,
    isCocktail, alive: true,
    shape, rot: Math.random() * Math.PI * 2, rotSpeed,
    dashLen, dashGap, rayCount,
    type: isCocktail ? _getUnusedCocktailType() : null,  /* 鸡尾酒类型：避免重复 */
  };
}

/* ══════════════════════════════════════════════════════════
   主动画循环
   ══════════════════════════════════════════════════════════ */
function _loop(ts) {
  if (!_running) return;

  if (_lastTs === null) _lastTs = ts;
  const dt = Math.min((ts - _lastTs) / 1000, 0.05);
  _lastTs = ts;

  _ctx.clearRect(0, 0, _cvs.width, _cvs.height);

  for (let i = 0; i < _bubbles.length; i++) {
    const b = _bubbles[i];
    if (!b.alive) continue;

    if (b === _activeBubble && _state === 'attached') {
      const springK = 0.10;
      const springD = 0.78;
      b.vx = (b.vx + (_mouseX - b.x) * springK) * springD;
      b.vy = (b.vy + (_mouseY - b.y) * springK) * springD;
      b.x += b.vx;
      b.y += b.vy;
    } else {
      b.y -= b.speed * dt;
    }

    b.rot += b.rotSpeed * dt;
    _drawBubble(b);

    if (b === _activeBubble) {
      // activated bubble doesn't disappear
    } else if (b.y + b.size / 2 < 0) {
      if (b.isCocktail) {
        const nb = _spawnBubble(false, true);
        nb.speed = CB.COCKTAIL_SPEED_MIN + Math.random() * (CB.COCKTAIL_SPEED_MAX - CB.COCKTAIL_SPEED_MIN);
        /* 排在当前最低存活气泡的下方，加随机间距保持错落 */
        const lowestY = _bubbles.reduce((maxY, ob) => {
          return (ob !== b && ob.isCocktail && ob.alive) ? Math.max(maxY, ob.y) : maxY;
        }, window.innerHeight);
        nb.y = Math.max(
          window.innerHeight + nb.size * 1.5,
          lowestY + window.innerHeight * (0.4 + Math.random() * 0.35)
        );
        _bubbles[i] = nb;
      } else {
        _bubbles[i] = _spawnBubble(false, false);
      }
    }
  }

  if (_state === 'open' && _cardEl) {
    _updateCard();
  }

  _raf = requestAnimationFrame(_loop);
}

/* ══════════════════════════════════════════════════════════
   绘制单个气泡
   ══════════════════════════════════════════════════════════ */
function _drawBubble(b) {
  const { x, y, size, shape, rot } = b;
  const r = size / 2;

  _ctx.save();

  /* 根据气泡类型获取颜色 */
  const color = b.isCocktail ? _getCocktailType(b.type).color : '#ea4d00';
  _ctx.strokeStyle = color;
  _ctx.fillStyle   = color;
  _ctx.globalAlpha = 1;

  if (b.isCocktail) {
    _ctx.beginPath();
    _ctx.arc(x, y, r, 0, Math.PI * 2);
    _ctx.fill();

    /* 加载相应的 front 图像 */
    const imgFront = _imgFronts[b.type];
    if (imgFront && imgFront.complete && imgFront.naturalWidth > 0) {
      _ctx.save();
      _ctx.translate(x, y);
      _ctx.rotate(rot);
      _ctx.beginPath();
      _ctx.arc(0, 0, r, 0, Math.PI * 2);
      _ctx.clip();
      _ctx.drawImage(imgFront, -r, -r, size, size);
      _ctx.restore();
    }

    _ctx.beginPath();
    _ctx.arc(x, y, r + 2, 0, Math.PI * 2);
    _ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    _ctx.lineWidth = 1.5;
    _ctx.stroke();

  } else if (shape === 'solid') {
    _ctx.beginPath();
    _ctx.arc(x, y, r, 0, Math.PI * 2);
    _ctx.fill();

  } else if (shape === 'dashed') {
    _ctx.translate(x, y);
    _ctx.rotate(rot);
    _ctx.lineWidth = Math.max(1, size * 0.06);
    _ctx.setLineDash([b.dashLen, b.dashGap]);
    _ctx.beginPath();
    _ctx.arc(0, 0, r, 0, Math.PI * 2);
    _ctx.stroke();
    _ctx.setLineDash([]);

  } else {
    _ctx.translate(x, y);
    _ctx.rotate(rot);
    _ctx.lineWidth = Math.max(1, size * 0.055);
    const innerR = r * 0.22;
    const outerR = r * 0.92;
    for (let i = 0; i < b.rayCount; i++) {
      const angle = (i / b.rayCount) * Math.PI * 2;
      _ctx.beginPath();
      _ctx.moveTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);
      _ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
      _ctx.stroke();
    }
    _ctx.beginPath();
    _ctx.arc(0, 0, innerR * 0.8, 0, Math.PI * 2);
    _ctx.fill();
  }

  _ctx.restore();
}

/* ══════════════════════════════════════════════════════════
   点击状态机
   ══════════════════════════════════════════════════════════ */
function _onDocClick(e) {
  if (_state === 'open') {
    e.stopPropagation();
    _closeCard();
    return;
  }

  if (_state === 'attached' && _activeBubble) {
    e.stopPropagation();
    _openCard(_activeBubble);
    return;
  }

  for (const b of _bubbles) {
    if (!b.isCocktail || !b.alive) continue;
    const dx = e.clientX - b.x;
    const dy = e.clientY - b.y;
    if (dx * dx + dy * dy <= (b.size / 2) * (b.size / 2)) {
      e.stopPropagation();
      _activeBubble = b;
      _state        = 'attached';
      return;
    }
  }
}

/* ══════════════════════════════════════════════════════════
   展开卡片
   ══════════════════════════════════════════════════════════ */
function _openCard(b) {
  _state    = 'open';
  b.alive   = false;

  const S = CB.CARD_SIZE;
  const cocktailConfig = _getCocktailType(b.type);

  _cardFixedLeft = Math.max(0, Math.min(window.innerWidth  - S, _mouseX - S / 2));
  _cardFixedTop  = Math.max(0, Math.min(window.innerHeight - S, _mouseY - S / 2));

  _cardEl = document.createElement('div');
  _cardEl.id = 'cb-card';
  Object.assign(_cardEl.style, {
    position:     'fixed',
    left:         _cardFixedLeft + 'px',
    top:          _cardFixedTop  + 'px',
    width:        S + 'px',
    height:       S + 'px',
    borderRadius: '50%',
    background:   cocktailConfig.color,
    zIndex:       '10001',
    overflow:     'hidden',
    cursor:       'pointer',
    userSelect:   'none',
    touchAction:  'none',
    boxShadow:    '0 12px 48px rgba(0,0,0,0.45)',
  });

  _cardLayers = [];
  cocktailConfig.layers.forEach(cfg => {
    const img = document.createElement('img');

    /* star资源使用完整路径，不需要baseUrl前缀 */
    const assetPath = cocktailConfig.assets[cfg.key];
    if (cfg.key.startsWith('star')) {
      img.src = assetPath;
    } else {
      img.src = cocktailConfig.baseUrl + assetPath;
    }

    const w  = S * cfg.scale;
    const lf = (S - w) / 2 + cfg.ox * S;
    const tp = (S - w) / 2 + cfg.oy * S;

    Object.assign(img.style, {
      position:          'absolute',
      width:             w  + 'px',
      height:            w  + 'px',
      left:              lf + 'px',
      top:               tp + 'px',
      objectFit:         'contain',
      pointerEvents:     'none',
      transition:        'transform 0.06s ease-out',
      willChange:        'transform',
    });

    _cardEl.appendChild(img);
    _cardLayers.push({ el: img, par: cfg.par, shadow: cfg.shadow });
  });

  document.documentElement.appendChild(_cardEl);
  _updateCard();
}

/* ══════════════════════════════════════════════════════════
   更新视差
   ══════════════════════════════════════════════════════════ */
function _updateCard() {
  if (!_cardEl) return;
  const S = CB.CARD_SIZE;

  const cardCX = _cardFixedLeft + S / 2;
  const cardCY = _cardFixedTop  + S / 2;
  const nx = Math.max(-1, Math.min(1, (_mouseX - cardCX) / (S / 2)));
  const ny = Math.max(-1, Math.min(1, (_mouseY - cardCY) / (S / 2)));

  _cardLayers.forEach(({ el, par, shadow }) => {
    if (par === 0) return;
    const tx = nx * S * par;
    const ty = ny * S * par;
    el.style.transform = `translate(${tx}px, ${ty}px)`;

    if (shadow) {
      el.style.filter =
        `drop-shadow(${-nx * 10}px ${-ny * 6 + 3}px 3px rgba(0,0,0,0.80))`;
    }
  });
}

/* ══════════════════════════════════════════════════════════
   关闭卡片
   ══════════════════════════════════════════════════════════ */
function _closeCard() {
  if (!_cardEl) return;

  const r  = _cardEl.getBoundingClientRect();
  const cx = r.left + r.width  / 2;
  const cy = r.top  + r.height / 2;

  const activeColor = _getCocktailType(_activeBubble.type).color;

  _cardEl.remove();
  _cardEl     = null;
  _cardLayers = [];

  _explode(cx, cy, r.width / 2, activeColor);

  const b = _activeBubble;
  _activeBubble = null;
  _state        = null;

  if (b) {
    setTimeout(() => {
      if (!_running) return;
      const other = _bubbles.find(ob => ob !== b && ob.isCocktail && ob.alive);
      b.x  = CB.COCKTAIL_SIZE / 2 + Math.random() * (window.innerWidth - CB.COCKTAIL_SIZE);
      b.y  = window.innerHeight + CB.COCKTAIL_SIZE * 1.5;
      b.vx = 0;
      b.vy = 0;
      if (other) {
        b.y = Math.max(b.y, other.y + window.innerHeight * 0.9);
      }
      b.alive = true;
    }, 2000 + Math.random() * 1000);
  }
}

/* ══════════════════════════════════════════════════════════
   粒子爆炸
   ══════════════════════════════════════════════════════════ */
function _explode(cx, cy, r, color) {
  const cvs = document.createElement('canvas');
  cvs.width  = window.innerWidth;
  cvs.height = window.innerHeight;
  Object.assign(cvs.style, {
    position: 'fixed', top: '0', left: '0',
    zIndex: '10002', pointerEvents: 'none',
  });
  document.documentElement.appendChild(cvs);
  const ctx = cvs.getContext('2d');

  const pts = Array.from({ length: CB.EXPLODE_COUNT }, () => {
    const ang = Math.random() * Math.PI * 2;
    const spd = CB.EXPLODE_SPEED * (0.35 + Math.random() * 0.65);
    return {
      x:   cx,
      y:   cy,
      vx:  Math.cos(ang) * spd,
      vy:  Math.sin(ang) * spd,
      len: CB.EXPLODE_LINE_LEN * (0.5 + Math.random() * 0.9),
    };
  });

  ctx.strokeStyle = color;
  ctx.lineCap     = 'round';
  ctx.lineWidth   = CB.EXPLODE_LINE_W;

  let t0 = null;
  (function frame(ts) {
    if (!t0) t0 = ts;
    const prog = Math.min((ts - t0) / CB.EXPLODE_DUR, 1);
    if (prog >= 1) { cvs.remove(); return; }

    ctx.clearRect(0, 0, cvs.width, cvs.height);

    const fade = Math.pow(1 - prog, 1.4);
    ctx.globalAlpha = fade;

    pts.forEach(p => {
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.vy += 0.10;
      p.x  += p.vx;
      p.y  += p.vy;

      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd < 0.2) return;
      const nx = p.vx / spd;
      const ny = p.vy / spd;

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - nx * p.len, p.y - ny * p.len);
      ctx.stroke();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  })(performance.now());
}

/* ══════════════════════════════════════════════════════════
   停止系统
   ══════════════════════════════════════════════════════════ */
function stopCocktailBubbles() {
  _running = false;
  if (_raf) { cancelAnimationFrame(_raf); _raf = null; }
  document.removeEventListener('mousemove', _onMouseMove);
  document.removeEventListener('click',     _onDocClick, true);
  if (_cvs)   { _cvs.remove();   _cvs = null; }
  if (_cardEl){ _cardEl.remove(); _cardEl = null; }
  _bubbles      = [];
  _state        = null;
  _activeBubble = null;
  _cardLayers   = [];
}

window.stopCocktailBubbles = stopCocktailBubbles;

/* ══════════════════════════════════════════════════════════
   自动启动
   ══════════════════════════════════════════════════════════ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCocktailBubbles);
} else {
  initCocktailBubbles();
}
