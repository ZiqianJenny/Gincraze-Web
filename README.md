# Gin Craze London

18 世纪伦敦 Gin Craze 主题的单页网页游戏：地图探索 + 选择驱动 + 资源管理。

## 如何运行

无需安装依赖。任选其一：

1. **直接打开**：双击 `index.html` 用浏览器打开
2. **本地服务器**（推荐，避免部分浏览器限制）：
   ```bash
   cd "gin-craze-london的完整路径"
   python3 -m http.server 8080
   ```
   终端里出现 `Serving HTTP on ... port 8080` 后，再打开：**http://localhost:8080**

   若 8080 已被占用，可改用其他端口，例如：
   ```bash
   python3 -m http.server 8765
   ```
   则访问 **http://localhost:8765**（端口号必须与命令里一致）

## 游戏规则摘要

- **侵蚀度**：从 0 开始，越高结局越极端（0–49 / 50–99 / 100–149 / 150–199 / 200+）
- **行动次数**：开局 `3 + 1d6`（3–8 次）
- **地图**：10 个地点，各只能访问一次；访问后图标变灰锁定
- **每处三选项**：保守 A（+10）、激进 B（+30，常带限制）、高风险 C（+50，常多耗 1 行动）

## 开屏页

首次打开显示全屏开屏（对齐 P1 设计稿）：

- 背景：`assets/bg-splash-main.png`（橙渐变 + 版画整图）
- 中央：P2 Logo + Bernard DeVoto 引文（Baskerville 10pt / 行高 11pt / 字宽 90%）
- 动效：白点、虚线圆，自 Logo 中线以下升至**页面顶边**后炸开消失（Canvas）
- **调气泡参数**：编辑 `splash-config.json` 里的 `computed` → 保存 → 在 http://localhost:8080 强制刷新（`Cmd+Shift+R`）。不要只双击 `index.html`，否则读不到 json。
- 进入游戏：向上滑动、点击画面、或按 Enter

## 文件结构

- `index.html` — 页面结构
- `splash.css` / `splash.js` — 开屏视觉与气泡动效
- `styles.css` — 18 世纪羊皮纸 / 金箔 UI
- `game.js` — 全部逻辑与地点数据
- `assets/` — Logo（P2）、底图（P3/P4）
