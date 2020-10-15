export function createID(s) {
  const constructor = s.constructor.name.toLowerCase();
  let id = '';

  switch (constructor) {
    case 'line':
      id = `${constructor}-${s.sx}-${s.sy}-${s.ex}-${s.ey}`;
      break;
    case 'arc':
      id = `${constructor}-${s.x}-${s.y}-${s.radius}`;
      break;
  }

  return `${id}-${Math.random()}`
}

export function distance(p1x, p1y, p2x, p2y) {
  return Math.floor(Math.sqrt((p2x - p1x) ** 2 + (p2y - p1y) ** 2))
}

export function midPoint(p1, p2) {
  return Math.floor((p1 + p2) / 2);
}