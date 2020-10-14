import Shape from './Shape.js';

export default class Arc extends Shape {
  constructor(x, y, radius, color = 'green', startAngle = 0, endAngle = 2 * Math.PI) {
    super(color);
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
  }

  static createPermanentArc(temp) {
    // const arc = new Arc(temp.x, temp.y, temp.radius);
    const arc = temp;
    arc.color = 'green';
    Shape.save(arc);

    return arc;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
    ctx.stroke();
  }

  renderDescription(output) {
    const fragment = document.createDocumentFragment();
    const p = document.createElement('p');
    p.innerText = `Arc ${Arc.count}: center: (${this.x}, ${this.y}), radius:${this.radius}`;
    p.id = this.id;
    fragment.appendChild(p);
    output.appendChild(fragment);
  }

}