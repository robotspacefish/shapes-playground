export default class Line {
  static all = [];
  static ID = 1;

  constructor(sx, sy, ex, ey, color = 'black') {
    this.sx = sx;
    this.sy = sy;
    this.ex = ex;
    this.ey = ey;
    this.color = color;
  }

  static createPermanentLine(temp) {
    const line = new Line(temp.sx, temp.sy, temp.ex, temp.ey);
    Line.save(line);

    return line;
  }

  static save(line) {
    line.id = Line.ID;

    Line.ID++;
    Line.all.push(line);
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
    p.innerText = `Line ${this.id}: (${this.sx}, ${this.sy}) to (${this.ex}, ${this.ey})`;

    fragment.appendChild(p);
    output.appendChild(fragment);
  }
}