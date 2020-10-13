// ====== GLOBAL CONSTANTS ==================================
const ctx = document.getElementById('js-canvas').getContext('2d'),
  canvasContainer = document.getElementById('js-canvas-container'),
  clearCanvasBtn = document.getElementById('js-clear'),
  WIDTH = ctx.canvas.width, HEIGHT = ctx.canvas.height,
  mouse = { x: null, y: null, textX: null, texY: null };

let points = [],
  lines = [],
  pointCount = 0,
  startPoint,
  endPoint;

function draw() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // once a point is created, create end point
  if (startPoint) {
    endPoint = { x: mouse.x, y: mouse.y }
    point(startPoint.x, startPoint.y)
    point(endPoint.x, endPoint.y)
    line(startPoint.x, startPoint.y, endPoint.x, endPoint.y)
  }

  points.forEach(p => point(p.x, p.y));
  lines.forEach(l => line(l.startX, l.startY, l.endX, l.endY));

  if (mouse.x && mouse.y) drawMouseCoords();

  requestAnimationFrame(draw);
}

function point(x, y, fillColor = 'blue') {
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, 2 * Math.PI);

  ctx.fillStyle = fillColor;
  ctx.fill();
}

function addPoint(x, y) {
  points.push({ x, y })
  pointCount++;
}

function line(startX, startY, endX, endY, strokeColor = 'black') {
  ctx.strokeStyle = strokeColor;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

function createLine() {
  if (points.length >= 2) {
    const start = points[points.length - 2],
      end = points[points.length - 1];
    lines.push({ startX: start.x, startY: start.y, endX: end.x, endY: end.y })
    lines.push()
  }
}

function clear() {
  lines = [];
  points = [];
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
  pointCount++;

  if (!startPoint) startPoint = { x: mouse.x, y: mouse.y };

  if (pointCount === 2) {
    // place line
    points.push(startPoint);
    points.push(endPoint);
    createLine();
    // reset point count & start/end points
    pointCount = 0;
    startPoint = null;
    endPoint = null;
  }
});

clearCanvasBtn.addEventListener('click', clear);
// ====== START ==============================================
draw();

