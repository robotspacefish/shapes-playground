const ctx = document.getElementById('js-canvas').getContext('2d');
const canvasContainer = document.getElementById('js-canvas-container');
const WIDTH = ctx.canvas.width, HEIGHT = ctx.canvas.height;

function resize() {
  let cWidth = canvasContainer.clientWidth,
    cHeight = canvasContainer.clientHeight;

  const nativeRatio = WIDTH / HEIGHT,
    browserWindowRatio = cWidth / cHeight;

  if (browserWindowRatio > nativeRatio) {
    cHeight = Math.floor(cHeight * 0.9);
    cWidth = Math.floor(cHeight * nativeRatio);
  } else {
    cWidth = Math.floor(cWidth * 0.9);
    cHeight = Math.floor(cWidth / nativeRatio)
  }

  ctx.canvas.style.width = `${cWidth}px`;
  ctx.canvas.style.height = `${cHeight}px`;
}

window.addEventListener('load', () => {
  resize();
})

window.addEventListener('resize', () => {
  resize();
})
