import Point from './Point.js';

// ====== GLOBAL CONSTANTS ==================================
const ctx = document.getElementById('js-canvas').getContext('2d'),
  canvasContainer = document.getElementById('js-canvas-container'),
  clearCanvasBtn = document.getElementById('js-clear'),
  output = document.getElementById('js-output'),
  WIDTH = ctx.canvas.width, HEIGHT = ctx.canvas.height,
  mouse = { x: null, y: null, textX: null, texY: null };

let lines = [],
  startPoint,
  endPoint;

function draw() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (startPoint && endPoint) {
    line(startPoint.x, startPoint.y, endPoint.x, endPoint.y, 'lightgrey')
  }

  Point.all.forEach(p => p.draw(ctx));
  lines.forEach((l, i) => line(l.startX, l.startY, l.endX, l.endY));

  if (mouse.x && mouse.y) drawMouseCoords();
}

function update() {
  if (endPoint) endPoint.update(mouse.x, mouse.y);
}

function loop() {
  update();
  draw();

  requestAnimationFrame(loop);
}

function addLineDescription(line) {
  output.innerText += `
      Line ${line.id}: (${line.startX}, ${line.startY}) to (${line.endX}, ${line.endY})
    `;
}

function line(startX, startY, endX, endY, strokeColor = 'black') {
  ctx.strokeStyle = strokeColor;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

function createLine() {
  if (Point.all.length >= 2) {
    const line = { startX: startPoint.x, startY: startPoint.y, endX: endPoint.x, endY: endPoint.y, id: lines.length + 1 };
    // add 1 to lines.length because line isnt pushed in yet
    lines.push(line);

    return line;
  }
}

function clear() {
  lines = [];
  // points = [];
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
    endPoint = new Point(mouse.x, mouse.y)
  }

  if (Point.count === 2) {
    // place line
    const line = createLine();
    addLineDescription(line);

    // reset point count & start/end points
    Point.count = 0;
    startPoint = null;
    endPoint = null;

  }
});

clearCanvasBtn.addEventListener('click', clear);
// ====== START ==============================================
loop();

