/**
 * 第一页长卷模式：整页滚动 + Plan B 固定设计稿舞台缩放
 */

/* ★ 设计基准宽度 = 你 MacBook 的视口宽度。
   网页会按 (屏幕宽 / 这个值) 整体缩放，任何屏幕都是 MacBook 画面的等比放大/缩小。
   如果在你的 MacBook 上整体偏大/偏小，把这个数调成你真实的浏览器视口宽度即可。 */
var STAGE_BASE_WIDTH = 1512;

function fitStage() {
  var app    = document.getElementById("app");
  var scroll = document.getElementById("opening-scroll");
  if (!app || !scroll) return;
  var s = window.innerWidth / STAGE_BASE_WIDTH;
  app.style.setProperty("--page-scale", s);
  /* app.scrollHeight = 未缩放的设计内容高度；× s = 视觉高度，
     设给 #opening-scroll 让 body 的滚动条长度正确。 */
  scroll.style.height = (app.scrollHeight * s) + "px";
}

function initOpeningScroll() {
  document.body.classList.add("mode-opening");
  fitStage();

  /* 屏幕尺寸变化时重算 */
  window.addEventListener("resize", fitStage, { passive: true });
  /* 字体/图片加载完成后内容高度会变，多次重算确保滚动高度准确 */
  window.addEventListener("load", fitStage);
  [150, 400, 900, 1800, 3500].forEach(function (t) { setTimeout(fitStage, t); });
  /* 内容高度变化（图片加载等）时自动重算 */
  if (window.ResizeObserver) {
    try { new ResizeObserver(fitStage).observe(document.getElementById("app")); } catch (e) {}
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initOpeningScroll);
} else {
  initOpeningScroll();
}
