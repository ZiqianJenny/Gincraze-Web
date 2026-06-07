# 第一页完整长卷

## 结构（同一界面，上下滚动）

1. **开屏** `#screen-splash` — Logo、引文、气泡  
2. **铜版条** `#opening-strips` — 五幅竖条（左→右：13th … 21st）  
3. **What is Gin** `#what-is-gin`  
4. **进入游戏** 底部按钮  

底图：`assets/page1/bg-page-canvas.png` 铺在 `#opening-longpage` 上。

## 预览

http://localhost:8080 → 强制刷新 → **向下滚动** 即可在同一页看完所有内容。

## 自行调整

| 区域 | 文件 |
|------|------|
| Logo / 引文 | `splash.css` |
| 整页底图 / 总高度 | `opening-layout.css` → `.opening-longpage` |
| 铜版条位置 | `page1.css` → `.opening-strips` |
| What is Gin | `page1.css` + `index.html` |
| 气泡参数 | `splash-config.json` |

铜版条交互预留见 `page1.js` → `ERA_STRIPS`。
