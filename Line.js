import Shape from './Shape.js';

export default class Line extends Shape {
  constructor(sx, sy, ex, ey, color = 'black') {
    super(color);
    this.sx = sx;
    this.sy = sy;
    this.ex = ex;
    this.ey = ey;
  }

  static createPermanentLine(temp) {
    const line = new Line(temp.sx, temp.sy, temp.ex, temp.ey);
    Shape.save(line);
    return line;
  }

  draw(ctx) {
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.sx, this.sy);
    ctx.lineTo(this.ex, this.ey);
    ctx.stroke();
  }

  renderDescription(output) {
    const fragment = document.createDocumentFragment();
    const p = document.createElement('p');
    p.innerText = `Line ${Line.count}: (${this.sx}, ${this.sy}) to (${this.ex}, ${this.ey})`;
    p.id = this.id;
    fragment.appendChild(p);
    output.appendChild(fragment);
  }
}