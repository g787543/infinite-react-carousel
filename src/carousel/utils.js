export const getSwipeDirection = (touchObject, verticalSwiping = false) => {
  let xDist = 0;
  let yDist = 0;
  let swipeAngle;
  xDist = touchObject.startX - touchObject.endX;
  yDist = touchObject.startY - touchObject.endY;
  const r = Math.atan2(yDist, xDist);
  swipeAngle = Math.round((r * 180) / Math.PI);
  if (swipeAngle < 0) {
    swipeAngle = 360 - Math.abs(swipeAngle);
  }
  if (
    (swipeAngle <= 45 && swipeAngle >= 0)
    || (swipeAngle <= 360 && swipeAngle >= 315)
  ) {
    return 'left';
  }
  if (swipeAngle >= 135 && swipeAngle <= 225) {
    return 'right';
  }
  if (verticalSwiping === true) {
    if (swipeAngle > 45 && swipeAngle < 135) {
      return 'up';
    }
    return 'down';
  }

  return 'vertical';
};

export const keyHandler = (e, accessibility, rtl) => {
  if (e.target.tagName.match('TEXTAREA|INPUT|SELECT') || !accessibility) return '';
  if (e.keyCode === 37) return rtl ? 'next' : 'previous';
  if (e.keyCode === 39) return rtl ? 'previous' : 'next';
  return '';
};
