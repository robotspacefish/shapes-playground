import Arc from './Arc.js';
import Shape from './Shape.js';

export default class Point extends Arc {
  constructor(x, y, color = 'blue', radius = 4,) {
    super(x, y, radius, color)
  }

  static createPermanentPoint(x, y, color) {
    const point = new Point(x, y, color);
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