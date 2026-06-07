/**
 * 第一页长卷模式：整页滚动，游戏入口在底部按钮
 */

function initOpeningScroll() {
  document.body.classList.add("mode-opening");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initOpeningScroll);
} else {
  initOpeningScroll();
}
