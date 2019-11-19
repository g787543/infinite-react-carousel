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

export function sendTouchEvent(x, y, element, eventType) {
  const touchObj = {
    identifier: Date.now(),
    target: element,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 10,
    force: 0.5,
    clientX: x,
    clientY: y
  };
  const touchEvent = new TouchEvent(eventType, {
    cancelable: true,
    bubbles: true,
    targetTouches: [touchObj],
    shiftKey: true,
  });
  element.dispatchEvent(touchEvent);
}

export function sendWheelEvent(x, y, element, eventType) {
  const touchObj = {
    identifier: Date.now(),
    target: element,
    deltaX: x,
    deltaY: y
  };
  const touchEvent = new WheelEvent(eventType, {
    cancelable: true,
    bubbles: true,
    ...touchObj,
    shiftKey: true,
  });
  element.dispatchEvent(touchEvent);
}

export function sendMouseEvent(x, y, element, eventType) {
  const touchObj = {
    identifier: Date.now(),
    target: element,
    clientX: x,
    clientY: y
  };
  const touchEvent = new MouseEvent(eventType, {
    cancelable: true,
    bubbles: true,
    ...touchObj,
    shiftKey: true,
  });
  element.dispatchEvent(touchEvent);
}
