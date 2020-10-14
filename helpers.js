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