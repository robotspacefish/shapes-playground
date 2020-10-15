import Line from './Line.js';
import Point from './Point.js';
import Arc from './Arc.js';
import Shape from './Shape.js';
import ArcedLine from './ArcedLine.js';

// ====== GLOBALS ==================================
const ctx = document.getElementById('js-canvas').getContext('2d'),
  canvasContainer = document.getElementById('js-canvas-container'),
  clearCanvasBtn = document.getElementById('js-clear'),
  createButtons = document.querySelectorAll('.shape-create-btn'),
  output = document.getElementById('js-output'),
  WIDTH = ctx.canvas.width, HEIGHT = ctx.canvas.height,
  mouse = { x: null, y: null, textX: null, texY: null };

let startPoint, endPoint, tempShape, shape, arcPoint;

// ====== MAIN ======================================
function draw() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (tempShape) tempShape.draw(ctx);

  Shape.all.forEach(s => s.draw(ctx))

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
    case 'arced-line':
      if (tempShape) {
        console.log('updating')
        tempShape.ex = endPoint.x;
        tempShape.ey = endPoint.y;
        arcPoint.update(tempShape.ex, tempShape.sy);
        tempShape.ax = arcPoint.x;
        tempShape.ay = arcPoint.y;
        tempShape.updateRadius();

      }
  }


}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function clear() {
  Shape.all = [];
  output.innerText = '';
}

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
  else if (e.target.id === 'js-create-arced-line') shape = 'arced-line';
  console.log(shape)
  createButtons.forEach(btn => {
    if (btn.classList.contains('selected')) btn.classList.remove('selected');
  });

  e.target.classList.add('selected');
}

function isExistingPointClicked() {
  const point = Point.all.find(p => {
    return p.x - 4 <= mouse.x && p.x + 4 >= mouse.x && p.y - 4 <= mouse.y && p.y + 4 >= mouse.y
  })

  return point ? point : false;
}

function reset() {
  startPoint = null;
  endPoint = null;
  tempShape = null;
}

// ====== EVENT LISTENERS ===================================
window.addEventListener('load', () => {
  resize();
})

window.addEventListener('resize', () => {
  resize();
})

createButtons.forEach(btn => {
  //  TODO clear any in progress shape
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
  mouse.textX += mouse.x > ctx.canvas.width - 100 ? -70 : 10;

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
    const existingPoint = isExistingPointClicked();

    if (existingPoint) {
      if (!startPoint) {
        startPoint = existingPoint;
        endPoint = new Point(mouse.x, mouse.y);

        if (shape === 'arc') tempShape = new Arc(startPoint.x, startPoint.y, Math.abs(Math.floor(endPoint.x - startPoint.x)), 'lightgrey');
        else if (shape === 'line') tempShape = new Line(startPoint.x, startPoint.y, endPoint.x, endPoint.y, 'lightgrey');
        else if (shape === 'arced-line') {
          arcPoint = Point.createPermanentPoint(startPoint.x, endPoint.y, 'red');
          tempShape = new ArcedLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y, arcPoint.x, arcPoint.y, 'lightgrey')
        }
      } else {
        //endpoint
        // TODO
      }

    } else {
      if (!startPoint) {
        startPoint = Point.createPermanentPoint(mouse.x, mouse.y);
        endPoint = new Point(mouse.x, mouse.y);

        if (shape === 'arc') tempShape = new Arc(startPoint.x, startPoint.y, Math.abs(Math.floor(endPoint.x - startPoint.x)), 'lightgrey');
        else if (shape === 'line') tempShape = new Line(startPoint.x, startPoint.y, endPoint.x, endPoint.y, 'lightgrey');
        else if (shape === 'arced-line') {
          arcPoint = Point.createPermanentPoint(startPoint.x, endPoint.y, 'red');
          tempShape = new ArcedLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y, arcPoint.x, arcPoint.y, 'lightgrey')
        }

      } else if (endPoint) {
        switch (shape) {
          case 'arc':
            const arc = Arc.createPermanentArc(tempShape);
            arc.renderDescription(output);
            break;
          case 'line':
            const line = Line.createPermanentLine(tempShape);
            Point.createPermanentPoint(endPoint.x, endPoint.y); // finalize endpoint
            tempShape.addPoints(startPoint, endPoint);
            line.renderDescription(output);
            break;
          case 'arced-line':
            const arcedLine = ArcedLine.createPermanentArcedLine(tempShape);
            endPoint.y = arcedLine.ay + arcedLine.radius * (endPoint.y < arcedLine.sy ?
              -1 : 1);
            endPoint.x = arcedLine.ax;
            Point.createPermanentPoint(endPoint.x, endPoint.y);
            tempShape.addPoints(startPoint, endPoint);

        }

        reset();
      }


    }

  }

});

window.addEventListener('keydown', (e) => {
  console.log('Debugging:', Shape.all)
  console.log('tempShape', tempShape)
})
clearCanvasBtn.addEventListener('click', clear);
// ====== START ==============================================
loop();

