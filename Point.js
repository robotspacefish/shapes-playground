import Arc from './Arc.js';
import Shape from './Shape.js';

export default class Point extends Arc {
  static count = 0;

  constructor(x, y, radius = 4, color = 'blue') {
    super(x, y, radius, color)
  }

  static createPermanentPoint(x, y) {
    const point = new Point(x, y);
    Shape.save(point);
    return point;
  }

  draw(ctx) {
    super.draw(ctx);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(x, y) {
    this.x = x;
    this.y = y;
  }

  add(x, y, color) {
    Point.all.push(new Point(x, y, color))
  }
}