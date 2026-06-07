/**
 * Gin Craze London — 地图探索 + 选择驱动 + 资源管理
 */

const LOCATIONS = [
  {
    id: "spitalfields",
    name: "Spitalfields 斯皮塔佛兹",
    icon: "🏭",
    era: "移民作坊区 · 1720s",
    x: 78, y: 38,
    intro:
      "荷兰与佛兰德的蒸馏师在此落脚，廉价铜锅日夜沸腾。贫民以几便士买醉，杜松子香气渗入每一条胡同。",
    options: [
      {
        key: "A",
        title: "暗中散发试饮券",
        desc: "让学徒在纺织工下工时分发小杯样品，口碑缓慢发酵。",
        erosion: 10,
        cost: null,
        feedback: "织工们低声议论这种「能忘忧的水」，侵蚀在暗处生根。",
      },
      {
        key: "B",
        title: "贿赂工头强制配给",
        desc: "要求每家作坊每日收工时供应一壶 gin，违者克扣工钱。",
        erosion: 30,
        cost: "conservativeNext",
        feedback: "作坊里响起咒骂与碰杯声。你的手段太露骨——下一处须收敛。",
      },
      {
        key: "C",
        title: "炸毁井水井架",
        desc: "切断饮水来源，只留下巷口的 gin 贩。",
        erosion: 50,
        cost: "extraAction",
        feedback: "井水苦涩，只有 gin 甘甜。居民眼中布满血丝，而你付出更多时间布局。",
      },
    ],
  },
  {
    id: "covent",
    name: "Covent Garden 考文特花园",
    icon: "🧺",
    era: "露天市集 · 喧闹正午",
    x: 42, y: 48,
    intro:
      "鲜花、蔬果与野味摊位旁，总有人在篮底藏一瓶 gin。商贩叫卖，醉汉当街起舞，警察也睁一只眼闭一只眼。",
    options: [
      {
        key: "A",
        title: "赞助街头艺人",
        desc: "让艺人把 gin 唱进民谣，随人流传唱。",
        erosion: 10,
        cost: null,
        feedback: "一首新曲子传遍广场：「杜松子救我脱离苦海」。",
      },
      {
        key: "B",
        title: "收购摊位改酒馆",
        desc: "半数蔬果摊一夜变成「Gin & 洋葱」铺。",
        erosion: 30,
        cost: "conservativeNext",
        feedback: "市集变味，菜贩怒而转投啤酒馆——你树敌太多，须暂避锋芒。",
      },
      {
        key: "C",
        title: "在喷泉中掺 gin",
        desc: "中央喷泉一夜变成公共酒缸。",
        erosion: 50,
        cost: "extraAction",
        feedback: "孩童与贵妇同饮一池浊液。伦敦中心沦陷，你耗费整整一日善后。",
      },
    ],
  },
  {
    id: "stgiles",
    name: "St. Giles 圣吉尔斯贫民窟",
    icon: "🕳️",
    era: "最污秽的巢穴 · 鼠疫余悸",
    x: 28, y: 62,
    intro:
      "伦敦最穷的人挤在漏雨的阁楼，gin 比面包便宜。死亡率居高不下，却无人愿戒。这里是狂潮的心脏。",
    options: [
      {
        key: "A",
        title: "开设「赈济 gin 站」",
        desc: "假慈善名义每日施舍半品脱。",
        erosion: 10,
        cost: null,
        feedback: "饥民排队领取「温暖」，侵蚀如瘟疫蔓延。",
      },
      {
        key: "B",
        title: "收买掘墓人宣传",
        desc: "让送葬队宣扬「至死方休也要喝」。",
        erosion: 30,
        cost: "lockLocation",
        lockTarget: "westminster",
        feedback: "棺材旁的醉话吓跑了上流绅士——威斯敏斯特暂时对你关上了门。",
      },
      {
        key: "C",
        title: "纵火逼迁",
        desc: "烧毁廉租房，逼居民涌入地下 gin 洞。",
        erosion: 50,
        cost: "extraAction",
        feedback: "火光映红夜空，幸存者只剩酒杯。你花光心力收拾残局。",
      },
    ],
  },
  {
    id: "fleet",
    name: "Fleet Street 舰队街",
    icon: "📰",
    era: "印刷坊与咖啡馆",
    x: 52, y: 42,
    intro:
      "报刊老板以墨水操控舆论。一篇社论可让 gin 成为「爱国饮品」，也可让禁酒法案胎死腹中。",
    options: [
      {
        key: "A",
        title: "刊登健康「研究」",
        desc: "伪造医生书信，称 gin 可祛瘴气。",
        erosion: 10,
        cost: null,
        feedback: "头条写着：科学站在你这边。",
      },
      {
        key: "B",
        title: "抹黑啤酒商",
        desc: "连载漫画把啤酒描绘成「迟钝之饮」。",
        erosion: 30,
        cost: "conservativeNext",
        feedback: "啤酒馆老板结盟反击，你下一手只能温和。",
      },
      {
        key: "C",
        title: "印刷假许可证",
        desc: "让每家地下作坊看似合法经营。",
        erosion: 50,
        cost: "bonusAction",
        feedback: "满街持证醉汉，官僚被买通——你反而赢得几日空闲。",
      },
    ],
  },
  {
    id: "westminster",
    name: "Westminster 威斯敏斯特",
    icon: "⚖️",
    era: "议会与法庭",
    x: 22, y: 78,
    intro:
      "议员们在辩论《Gin Act》：许可费、搜查权与罚款。游说团在走廊穿梭，酒杯碰撞决定千万人的命运。",
    options: [
      {
        key: "A",
        title: "游说温和议员",
        desc: "支持「许可费而非全面禁酒」。",
        erosion: 10,
        cost: null,
        feedback: "法案漏洞百出，地下蒸馏更加猖獗。",
      },
      {
        key: "B",
        title: "宴请财政大臣",
        desc: "用金酒换税收豁免的口头承诺。",
        erosion: 30,
        cost: "conservativeNext",
        feedback: "国库短视地微笑，舆论反弹——你须低调一阵。",
      },
      {
        key: "C",
        title: "在国会酒窖投毒替代品",
        desc: "只留下 gin，让议员亲身体验「国民饮品」。",
        erosion: 50,
        cost: "extraAction",
        feedback: "辩论厅里东倒西歪，法案流产。你耗去大量心机。",
      },
    ],
  },
  {
    id: "smithfield",
    name: "Smithfield 史密斯菲尔德",
    icon: "🐂",
    era: "牲畜市场 · 血腥黎明",
    x: 48, y: 28,
    intro:
      "屠夫与赶车夫天未亮便饮酒御寒。牛铃与酒杯声交织，这里是劳动者狂饮的圣地。",
    options: [
      {
        key: "A",
        title: "赞助「宰牲节」畅饮",
        desc: "每杀一头牲口，摊前赠一杯 gin。",
        erosion: 10,
        cost: null,
        feedback: "血与酒的气味黏合在一起。",
      },
      {
        key: "B",
        title: "雇人冒充检疫官",
        desc: "宣称「只有 gin 能杀菌」。",
        erosion: 30,
        cost: "lockLocation",
        lockTarget: "mayfair",
        feedback: "梅菲尔贵族闻之色变，闭门谢客——上流社交圈对你封锁。",
      },
      {
        key: "C",
        title: "掀翻啤酒马车",
        desc: "让市场只剩 gin 流通。",
        erosion: 50,
        cost: "extraAction",
        feedback: "麦芽洒满鹅卵石，杜松子主宰黎明。行动所剩无几。",
      },
    ],
  },
  {
    id: "southwark",
    name: "Southwark 萨瑟克",
    icon: "🍺",
    era: "南岸酿酒坊",
    x: 62, y: 72,
    intro:
      "泰晤士南岸弥漫着麦芽与蒸汽。大型蒸馏坊夜以继日，木桶顺流而下，供给整座城市的饥渴。",
    options: [
      {
        key: "A",
        title: "提高产能换口碑",
        desc: "让坊主公开宣称「南岸 gin 最醇」。",
        erosion: 10,
        cost: null,
        feedback: "木桶堆积如山，码头工人传唱品牌名。",
      },
      {
        key: "B",
        title: "兼并竞争对手",
        desc: "暴力收购啤酒坊改蒸馏线。",
        erosion: 30,
        cost: "conservativeNext",
        feedback: "黑道火并后，你成了南岸之王——也得暂避风头。",
      },
      {
        key: "C",
        title: "炸毁南岸水闸",
        desc: "污染净水，让 gin 成为「唯一安全液体」。",
        erosion: 50,
        cost: "bonusAction",
        feedback: "河水恶臭，酒却畅销。意外收获：你买通了河运帮，多得一程机会。",
      },
    ],
  },
  {
    id: "mayfair",
    name: "Mayfair 梅菲尔",
    icon: "🎭",
    era: "上流沙龙",
    x: 35, y: 22,
    intro:
      "贵族太太在沙龙里偷偷品尝「荷兰勇气」。她们用蕾丝手帕掩住杯沿，谈论时尚，也谈论堕落。",
    options: [
      {
        key: "A",
        title: "推出「金酒香水」",
        desc: "以奢侈品包装推销微量 gin。",
        erosion: 10,
        cost: null,
        feedback: "社交季流行「微醺礼仪」，侵蚀潜入高墙。",
      },
      {
        key: "B",
        title: "贿赂宫廷画师",
        desc: "让肖像画背景总有一杯 gin。",
        erosion: 30,
        cost: "conservativeNext",
        feedback: "画报太露骨，教会抗议——下一处宜谨慎。",
      },
      {
        key: "C",
        title: "在舞会泼洒浓缩液",
        desc: "整场沙龙醉倒，丑闻席卷伦敦。",
        erosion: 50,
        cost: "extraAction",
        feedback: "缎裙与假发堆满地板，明日头条已为你写好。",
      },
    ],
  },
  {
    id: "docks",
    name: "Thames Docks 泰晤士码头",
    icon: "⚓",
    era: "水手与关税站",
    x: 72, y: 55,
    intro:
      "从殖民地归来的水手带回甘蔗与故事，也带回对烈酒的胃口。码头是 gin 扩散到世界的跳板。",
    options: [
      {
        key: "A",
        title: "贿赂海关放行",
        desc: "让走私 gin 箱贴上「染料」标签。",
        erosion: 10,
        cost: null,
        feedback: "码头堆满标着靛蓝的木箱，里面全是酒瓶。",
      },
      {
        key: "B",
        title: "雇水手传唱 shanty",
        desc: "每艘出港船带走 gin 之歌。",
        erosion: 30,
        cost: "bonusAction",
        feedback: "歌声顺流漂向大海，你也赢得额外斡旋时间。",
      },
      {
        key: "C",
        title: "点燃关税仓库",
        desc: "让没收的 gin 倾泻进泰晤士河。",
        erosion: 50,
        cost: "extraAction",
        feedback: "河面漂浮着破碎瓶，鱼亦醉死——你耗尽心力。",
      },
    ],
  },
  {
    id: "temple",
    name: "Temple 圣殿律师区",
    icon: "📜",
    era: "法官与事务律师",
    x: 55, y: 58,
    intro:
      "黑衣律师在庭院讨论案例，酒杯从不离手。谁能把 gin 写进契约与判例，谁就能让狂潮成为「合法传统」。",
    options: [
      {
        key: "A",
        title: "资助「饮酒权」论文",
        desc: "法学界争论个人自由包括饮酒。",
        erosion: 10,
        cost: null,
        feedback: "法典注释里出现杜松子味的脚注。",
      },
      {
        key: "B",
        title: "收买法官书记",
        desc: "让所有偷 gin 案以「精神失常」撤销。",
        erosion: 30,
        cost: "conservativeNext",
        feedback: "法庭笑话百出，正义倾斜——你下一处须收敛。",
      },
      {
        key: "C",
        title: "在律所年会灌倒全员",
        desc: "逼他们在判例汇编里加入「Gin Holidays」。",
        erosion: 50,
        cost: "extraAction",
        feedback: "羊皮纸上墨迹歪斜，伦敦法律成了醉话。",
      },
    ],
  },
];

const ENDINGS = [
  { max: 49, title: "悄然消逝", text: "Gin 在伦敦悄然消失，仿佛从未存在。诗人不再提起杜松子，地图上的酒渍被雨水洗净。无人记得你。" },
  { max: 99, title: "普通流行", text: "Gin 成为众多饮品之一，留下零星歌谣与几张泛黄告示。史书上只有脚注记载这次骚动。" },
  { max: 149, title: "Gin Craze 爆发", text: "1720 年代的狂潮正式爆发！街头到处是「Drunk for a penny」的招牌，伦敦陷入廉价烈酒的狂欢。" },
  { max: 199, title: "伦敦沦陷", text: "犯罪率与死亡率飙升，婴儿死于醉母怀中。伦敦是一座巨大的酒馆，警笛只是背景音。" },
  { max: Infinity, title: "永远属于 Gin", text: "无人清醒。即使失明、病死，人们仍用颤抖的手伸向酒杯。伦敦永远属于 Gin——而你，是它的君主。" },
];

const COST_LABELS = {
  extraAction: "额外消耗 1 次行动",
  conservativeNext: "下一地点只能选保守选项",
  lockLocation: "永久锁定一处地点",
  bonusAction: "获得 +1 行动",
};

/** @type {GameState} */
let state;

function createInitialState() {
  return {
    erosion: 0,
    actions: 0,
    visited: new Set(),
    locked: new Set(),
    conservativeNext: false,
    journal: [],
    gameOver: false,
    currentLocationId: null,
  };
}

function showScreen(id) {
  if (id !== "screen-splash" && id !== "screen-start") {
    if (typeof window.stopSplashBubbles === "function") {
      window.stopSplashBubbles();
    }
  }
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
}

window.showScreen = showScreen;

function rollDice() {
  const diceEl = document.getElementById("dice");
  const resultEl = document.getElementById("dice-result");
  const btn = document.getElementById("btn-start");
  const area = document.getElementById("dice-area");

  area.classList.remove("hidden");
  btn.disabled = true;
  diceEl.classList.add("rolling");

  let ticks = 0;
  const interval = setInterval(() => {
    diceEl.textContent = Math.floor(Math.random() * 6) + 1;
    ticks++;
    if (ticks < 14) return;

    clearInterval(interval);
    diceEl.classList.remove("rolling");
    const roll = Math.floor(Math.random() * 6) + 1;
    const total = 3 + roll;
    diceEl.textContent = roll;
    state.actions = total;
    resultEl.textContent = `骰出 ${roll} — 本局行动次数：3 + ${roll} = ${total}`;

    setTimeout(() => {
      showScreen("screen-game");
      renderGame();
    }, 1200);
  }, 80);
}

function getEnding(erosion) {
  return ENDINGS.find((e) => erosion <= e.max) || ENDINGS[ENDINGS.length - 1];
}

function formatEffects(opt) {
  const parts = [`侵蚀度 +${opt.erosion}`];
  if (opt.cost && COST_LABELS[opt.cost]) {
    const label = COST_LABELS[opt.cost];
    if (opt.cost === "lockLocation" && opt.lockTarget) {
      const loc = LOCATIONS.find((l) => l.id === opt.lockTarget);
      parts.push(`${label}（${loc ? loc.name.split(" ")[0] : opt.lockTarget}）`);
    } else {
      parts.push(label);
    }
  }
  return parts.join(" · ");
}

function updateHUD() {
  document.getElementById("erosion-value").textContent = state.erosion;
  document.getElementById("actions-value").textContent = state.actions;
  const pct = Math.min(100, (state.erosion / 200) * 100);
  document.getElementById("erosion-bar").style.width = `${pct}%`;

  const flagsEl = document.getElementById("status-flags");
  flagsEl.innerHTML = "";
  if (state.conservativeNext) {
    flagsEl.innerHTML += '<span class="flag">下处仅可选 A</span>';
  }
}

function showFeedback(text, negative = false) {
  const el = document.getElementById("feedback");
  el.textContent = text;
  el.classList.remove("hidden", "negative");
  if (negative) el.classList.add("negative");
}

function renderMap() {
  const container = document.getElementById("map-pins");
  container.innerHTML = "";

  const unvisited = LOCATIONS.filter(
    (l) => !state.visited.has(l.id) && !state.locked.has(l.id)
  );
  const canPlay = state.actions > 0 && unvisited.length > 0 && !state.gameOver;

  LOCATIONS.forEach((loc) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pin";
    btn.style.left = `${loc.x}%`;
    btn.style.top = `${loc.y}%`;
    btn.title = loc.name;

    if (state.visited.has(loc.id)) btn.classList.add("visited");
    if (state.locked.has(loc.id)) btn.classList.add("locked");

    const disabled =
      state.visited.has(loc.id) ||
      state.locked.has(loc.id) ||
      !canPlay ||
      state.gameOver;
    btn.disabled = disabled;

    btn.innerHTML = `
      <div class="pin-inner"><span>${loc.icon}</span></div>
      <span class="pin-label">${loc.name.split(" ")[0]}</span>
    `;

    if (!disabled) {
      btn.addEventListener("click", () => enterLocation(loc.id));
    }

    container.appendChild(btn);
  });

  const hint = document.getElementById("game-hint");
  if (state.gameOver) {
    hint.textContent = "本局结束";
  } else if (state.actions <= 0) {
    hint.textContent = "行动次数已用尽";
  } else if (unvisited.length === 0) {
    hint.textContent = "所有可访问地点已完成";
  } else {
    hint.textContent = "选择一处尚未访问的地点（消耗 1 次行动）";
  }
}

function renderGame() {
  updateHUD();
  renderMap();
}

function enterLocation(id) {
  if (state.actions <= 0 || state.visited.has(id) || state.locked.has(id)) return;

  state.actions -= 1;
  state.currentLocationId = id;
  const loc = LOCATIONS.find((l) => l.id === id);

  document.getElementById("loc-icon").textContent = loc.icon;
  document.getElementById("loc-name").textContent = loc.name;
  document.getElementById("loc-era").textContent = loc.era;
  document.getElementById("loc-intro").textContent = loc.intro;

  const optionsEl = document.getElementById("loc-options");
  optionsEl.innerHTML = "";
  document.getElementById("btn-back-map").classList.add("hidden");

  loc.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";

    const isConservative = opt.key === "A";
    const blocked = state.conservativeNext && !isConservative;

    btn.disabled = blocked;
    btn.innerHTML = `
      <span class="opt-title">选项 ${opt.key} · ${opt.title}</span>
      <span class="opt-desc">${opt.desc}</span>
      <span class="opt-effects"><strong>${formatEffects(opt)}</strong></span>
    `;

    if (blocked) {
      btn.title = "受上一选项代价限制，仅可选保守选项";
    }

    btn.addEventListener("click", () => chooseOption(loc, opt));
    optionsEl.appendChild(btn);
  });

  showScreen("screen-location");
  updateHUD();
}

function applyCost(cost, lockTarget) {
  switch (cost) {
    case "extraAction":
      state.actions = Math.max(0, state.actions - 1);
      break;
    case "bonusAction":
      state.actions += 1;
      break;
    case "conservativeNext":
      state.conservativeNext = true;
      break;
    case "lockLocation":
      if (lockTarget) state.locked.add(lockTarget);
      break;
    default:
      break;
  }
}

function chooseOption(loc, opt) {
  state.erosion += opt.erosion;
  state.visited.add(loc.id);
  state.conservativeNext = false;

  if (opt.cost) {
    applyCost(opt.cost, opt.lockTarget);
  }

  state.journal.push({
    place: loc.name,
    choice: `${opt.key} · ${opt.title}`,
    erosion: opt.erosion,
  });

  showScreen("screen-game");
  showFeedback(opt.feedback, opt.cost === "extraAction");
  renderGame();
  checkEndGame();
}

function checkEndGame() {
  const remaining = LOCATIONS.filter(
    (l) => !state.visited.has(l.id) && !state.locked.has(l.id)
  );

  if (state.actions <= 0 || remaining.length === 0) {
    state.gameOver = true;
    setTimeout(showEnding, 1600);
  }
}

function showEnding() {
  const ending = getEnding(state.erosion);
  document.getElementById("ending-title").textContent = ending.title;
  document.getElementById("ending-score").textContent = `最终侵蚀度：${state.erosion}`;
  document.getElementById("ending-text").textContent = ending.text;

  const journalEl = document.getElementById("ending-journal");
  journalEl.innerHTML = state.journal
    .map(
      (j) =>
        `<li>${j.place} — ${j.choice}（+${j.erosion}）</li>`
    )
    .join("");

  showScreen("screen-ending");
}

function restart() {
  state = createInitialState();
  document.getElementById("dice-area").classList.add("hidden");
  document.getElementById("dice-result").textContent = "";
  document.getElementById("dice").textContent = "?";
  document.getElementById("btn-start").disabled = false;
  document.getElementById("feedback").classList.add("hidden");
  showScreen("screen-start");
}

function init() {
  state = createInitialState();

  document.getElementById("btn-start").addEventListener("click", rollDice);
  document.getElementById("btn-restart").addEventListener("click", restart);
  document.getElementById("btn-back-map").addEventListener("click", () => {
    showScreen("screen-game");
    renderGame();
  });
}

init();
