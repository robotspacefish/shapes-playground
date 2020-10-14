import Line from './Line.js';
import Point from './Point.js';
import Arc from './Arc.js';

// ====== GLOBALS ==================================
const ctx = document.getElementById('js-canvas').getContext('2d'),
  canvasContainer = document.getElementById('js-canvas-container'),
  clearCanvasBtn = document.getElementById('js-clear'),
  createLineBtn = document.getElementById('js-create-line'),
  createArcBtn = document.getElementById('js-create-arc'),
  createButtons = document.querySelectorAll('.shape-create-btn'),
  output = document.getElementById('js-output'),
  WIDTH = ctx.canvas.width, HEIGHT = ctx.canvas.height,
  mouse = { x: null, y: null, textX: null, texY: null };

let startPoint, endPoint, tempShape, shape;

// ====== MAIN ======================================
function draw() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (tempShape) tempShape.draw(ctx);

  Point.all.forEach(p => p.draw(ctx));
  Line.all.forEach(l => l.draw(ctx));
  Arc.all.forEach(a => a.draw(ctx));

  if (mouse.x && mouse.y) drawMouseCoords();
}

function update() {
  if (endPoint) endPoint.update(mouse.x, mouse.y);

  switch (shape) {
    case 'arc':
      if (tempShape) {
        tempShape.radius = Math.abs(Math.floor(endPoint.x - startPoint.x));
      }
      break;
    case 'line':
      if (tempShape) {
        tempShape.ex = endPoint.x;
        tempShape.ey = endPoint.y;
      }
      break;
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
  Arc.all = [];
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

function createClickHandler(e) {
  if (e.target.id === 'js-create-line') shape = 'line';
  else if (e.target.id === 'js-create-arc') shape = 'arc';

  createButtons.forEach(btn => {
    if (btn.classList.contains('selected')) btn.classList.remove('selected');
  });

  e.target.classList.add('selected');
}
// ====== EVENT LISTENERS ===================================
window.addEventListener('load', () => {
  resize();
})

window.addEventListener('resize', () => {
  resize();
})

createButtons.forEach(btn => {
  btn.addEventListener('click', createClickHandler)
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
    mouse.textY -= 10;
  }
})

ctx.canvas.addEventListener('click', () => {
  if (shape) {
    Point.count++;
    if (!startPoint) {
      // startPoint = new Point(mouse.x, mouse.y);
      startPoint = Point.createPermanentPoint(mouse.x, mouse.y);
      endPoint = new Point(mouse.x, mouse.y);

      if (shape === 'arc') tempShape = new Arc(startPoint.x, startPoint.y, Math.abs(Math.floor(endPoint.x - startPoint.x)), 'lightgrey');
      else if (shape === 'line') tempShape = new Line(startPoint.x, startPoint.y, endPoint.x, endPoint.y, 'lightgrey');

      console.log(tempShape)
    }

    if (Point.count === 2) {
      switch (shape) {
        case 'arc':
          const arc = Arc.createPermanentArc(tempShape);
          break;
        case 'line':
          const line = Line.createPermanentLine(tempShape);
          Point.createPermanentPoint(endPoint.x, endPoint.y); // finalize endpoint
          line.renderDescription(output);
          break;
      }

      // reset point count & start/end points
      Point.count = 0;
      startPoint = null;
      endPoint = null;
      tempShape = null;

    }

  }

});

clearCanvasBtn.addEventListener('click', clear);
// ====== START ==============================================
loop();

