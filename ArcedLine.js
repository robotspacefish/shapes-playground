import Shape from './Shape.js';

export default class ArcedLine extends Shape {
  constructor(sx, sy, ex, ey, ax, ay, color = 'black') {
    super(color);
    this.sx = sx;
    this.sy = sy;
    this.ex = ex;
    this.ey = ey;
    this.ax = ax; // arc poiints
    this.ay = ay;
    this.radius = 50;
  }

  static createPermanentLine(temp) {
    const line = temp;
    Shape.save(line);
    return line;
  }

  static createPermanentArcedLine(temp) {
    const arcedLine = temp;
    return arcedLine;
  }

  draw(ctx) {
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.sx, this.sy);
    ctx.arcTo(this.ax, this.ay, this.ex, this.ey, this.radius);
    ctx.stroke();
  }
}