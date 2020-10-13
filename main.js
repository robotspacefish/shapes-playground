import Line from './Line.js';
import Point from './Point.js';

// ====== GLOBAL CONSTANTS ==================================
const ctx = document.getElementById('js-canvas').getContext('2d'),
  canvasContainer = document.getElementById('js-canvas-container'),
  clearCanvasBtn = document.getElementById('js-clear'),
  output = document.getElementById('js-output'),
  WIDTH = ctx.canvas.width, HEIGHT = ctx.canvas.height,
  mouse = { x: null, y: null, textX: null, texY: null };

let startPoint, endPoint, tempLine;

function draw() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (tempLine) tempLine.draw(ctx);

  Point.all.forEach(p => p.draw(ctx));
  Line.all.forEach(l => l.draw(ctx));

  if (mouse.x && mouse.y) drawMouseCoords();
}

function update() {
  if (endPoint) endPoint.update(mouse.x, mouse.y);
  if (tempLine) {
    tempLine.ex = endPoint.x;
    tempLine.ey = endPoint.y;
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function clear() {
  Line.all = [];
  Point.all = [];
  output.innerText = '';
}

// ====== HELPERS ============================================
function drawMouseCoords() {
  ctx.lineWidth = 2;
  ctx.fillStyle = 'red';
  ctx.strokeStyle = 'red';
  ctx.fillText(`(x: ${mouse.x}, y: ${mouse.y})`, mouse.textX, mouse.textY);

  // cursor
  ctx.beginPath();
  ctx.moveTo(mouse.x - 10, mouse.y);
  ctx.lineTo(mouse.x + 10, mouse.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(mouse.x, mouse.y - 10);
  ctx.lineTo(mouse.x, mouse.y + 10);
  ctx.stroke();
}

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

// ====== EVENT LISTENERS ===================================
window.addEventListener('load', () => {
  resize();
})

window.addEventListener('resize', () => {
  resize();
})

ctx.canvas.addEventListener('mousemove', (e) => {
  const rect = ctx.canvas.getBoundingClientRect(),
    scaleX = ctx.canvas.width / rect.width,
    scaleY = ctx.canvas.height / rect.height;

  mouse.x = Math.floor((e.clientX - rect.left) * scaleX);
  mouse.y = Math.floor((e.clientY - rect.top) * scaleY);
  mouse.textX = mouse.x;
  mouse.textY = mouse.y - 10;

  // move text if too close to edges
  mouse.textX += mouse.x > ctx.canvas.width - 45 ? -70 : 10;

  if (mouse.y > ctx.canvas.height - 30) {
    mouse.textY = mouse.y - 20;
  } else if (mouse.y < 30) {
    mouse.textY = mouse.y + 20;
  } else {
    mouse.textY -= 10
  }
})


ctx.canvas.addEventListener('click', () => {
  Point.count++;

  if (!startPoint) {
    startPoint = new Point(mouse.x, mouse.y);
    endPoint = new Point(mouse.x, mouse.y);
    tempLine = new Line(startPoint.x, startPoint.y, endPoint.x, endPoint.y, 'lightgrey');
  }

  if (Point.count === 2) {
    // place permanent line
    const line = Line.createPermanentLine(tempLine);
    line.renderDescription(output);

    // reset point count & start/end points
    Point.count = 0;
    startPoint = null;
    endPoint = null;
    tempLine = null;

  }
});

clearCanvasBtn.addEventListener('click', clear);
// ====== START ==============================================
loop();

