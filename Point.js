export default class Point {
  static all = [];
  static count = 0;

  constructor(x, y, fillColor = 'blue') {
    this.x = x;
    this.y = y;
    this.fillColor = fillColor;
    // Point.all.push(this)
  }

  static createPermanentPoint(x, y) {
    const point = new Point(x, y);
    Point.all.push(point);

    return point;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = this.fillColor;
    ctx.fill();
  }

  update(x, y) {
    this.x = x;
    this.y = y;
  }

  add(x, y, fillColor) {
    Point.all.push(new Point(x, y, fillColor))
  }
}