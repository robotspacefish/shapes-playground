export default class Arc {
  static all = [];
  static ID = 1; // TODO change id method

  constructor(x, y, radius, strokeColor = 'green', startAngle = 0, endAngle = 2 * Math.PI) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.strokeColor = strokeColor;
  }

  static createPermanentArc(temp) {
    // const arc = new Arc(temp.x, temp.y, temp.radius);
    const arc = temp;
    Arc.save(arc);

    return arc;
  }

  static save(arc) {
    arc.id = Arc.ID;

    Arc.ID++;
    Arc.all.push(arc);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.strokeColor = this.strokeColor;
    ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
    ctx.stroke();
  }
}