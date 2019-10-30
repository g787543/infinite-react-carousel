export function repeatClicks(node, count) {
  for (let i = 0; i < count; i += 1) {
    node.simulate('click');
  }
}

export function resizeWindow(x, y) {
  window.innerWidth = x;
  window.innerHeight = y;
  window.dispatchEvent(new Event('resize'));
}

export function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

function createClientXY(x, y) {
  return { clientX: x, clientY: y };
}

export function createStartTouchEventObject({ x = 0, y = 0 }) {
  return { touches: [createClientXY(x, y)] };
}

export function createMoveTouchEventObject({ x = 0, y = 0 }) {
  return { changedTouches: [createClientXY(x, y)] };
}
