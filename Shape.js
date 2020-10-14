import { createID } from './helpers.js';

export default class Shape {
  static all = [];
  static count = 0;

  constructor(color) {
    this.color = color;
    this.points = { start: null, end: null }
  }

  addPoints(start, end) {
    this.points = { start, end };
  }

  static save(shape) {
    shape.id = createID(shape);
    Shape.all.push(shape);
  }
}