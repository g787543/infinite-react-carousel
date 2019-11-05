import { getSwipeDirection, keyHandler } from '../src/carousel/utils';

describe('utils', () => {
  describe('getSwipeDirection', () => {
    const obj = {};
    it('direction is left', () => {
      // 0~45 && 315 ~360
      Object.assign(obj, {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
      });
      expect(getSwipeDirection(obj)).toEqual('left');
      Object.assign(obj, {
        startX: 1000,
        startY: 0,
        endX: 0,
        endY: 0
      });
      expect(getSwipeDirection(obj)).toEqual('left');
      Object.assign(obj, {
        startX: 1000,
        startY: 1000,
        endX: 0,
        endY: 0
      });
      expect(getSwipeDirection(obj)).toEqual('left');
      Object.assign(obj, {
        startX: 1000,
        startY: 0,
        endX: 0,
        endY: 1000
      });
      expect(getSwipeDirection(obj)).toEqual('left');
    });

    it('direction is right', () => {
      // 135 ~ 225
      Object.assign(obj, {
        startX: 0,
        startY: 0,
        endX: 1,
        endY: 0
      });
      expect(getSwipeDirection(obj)).toEqual('right');
      Object.assign(obj, {
        startX: 0,
        startY: 0,
        endX: 1000,
        endY: 0
      });
      expect(getSwipeDirection(obj)).toEqual('right');
      Object.assign(obj, {
        startX: 0,
        startY: 0,
        endX: 1000,
        endY: 1000
      });
      expect(getSwipeDirection(obj)).toEqual('right');
      Object.assign(obj, {
        startX: 0,
        startY: 1000,
        endX: 1000,
        endY: 0
      });
      expect(getSwipeDirection(obj)).toEqual('right');
    });

    it('direction is up', () => {
      // 46 ~ 134
      Object.assign(obj, {
        startX: 0,
        startY: 105,
        endX: 100,
        endY: 0
      });
      expect(getSwipeDirection(obj, true)).toEqual('up');
      Object.assign(obj, {
        startX: 0,
        startY: 100,
        endX: 0,
        endY: 0
      });
      expect(getSwipeDirection(obj, true)).toEqual('up');
      Object.assign(obj, {
        startX: 100,
        startY: 105,
        endX: 0,
        endY: 0
      });
      expect(getSwipeDirection(obj, true)).toEqual('up');
    });

    it('direction is down', () => {
      // 226 ~ 314
      Object.assign(obj, {
        startX: 100,
        startY: 0,
        endX: 0,
        endY: 105
      });
      expect(getSwipeDirection(obj, true)).toEqual('down');
      Object.assign(obj, {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 100
      });
      expect(getSwipeDirection(obj, true)).toEqual('down');
      Object.assign(obj, {
        startX: 0,
        startY: 0,
        endX: 100,
        endY: 105
      });
      expect(getSwipeDirection(obj, true)).toEqual('down');
    });

    it('direction is vertical', () => {
      // verticalSwiping is false, 46 ~ 134 && 226 ~314
      Object.assign(obj, {
        startX: 0,
        startY: 105,
        endX: 100,
        endY: 0
      });
      expect(getSwipeDirection(obj)).toEqual('vertical');
      Object.assign(obj, {
        startX: 100,
        startY: 105,
        endX: 0,
        endY: 0
      });
      expect(getSwipeDirection(obj)).toEqual('vertical');
      Object.assign(obj, {
        startX: 0,
        startY: 0,
        endX: 100,
        endY: 105
      });
      expect(getSwipeDirection(obj)).toEqual('vertical');
      Object.assign(obj, {
        startX: 100,
        startY: 0,
        endX: 0,
        endY: 105
      });
      expect(getSwipeDirection(obj)).toEqual('vertical');
    });
  });
  describe('keyHandler', () => {
    const obj = {
      target: {
        tagName: 'DIV'
      }
    };
    it('rtl is true, click → return previous', () => {
      Object.assign(obj, {
        keyCode: 39
      });
      expect(keyHandler(obj, true, true)).toEqual('previous');
    });
    it('rtl is true, click ← return next', () => {
      Object.assign(obj, {
        keyCode: 37
      });
      expect(keyHandler(obj, true, true)).toEqual('next');
    });
    it('rtl is false, click ← return previous', () => {
      Object.assign(obj, {
        keyCode: 37
      });
      expect(keyHandler(obj, true, false)).toEqual('previous');
    });
    it('rtl is false, click → return next', () => {
      Object.assign(obj, {
        keyCode: 39
      });
      expect(keyHandler(obj, true, false)).toEqual('next');
    });
    it('return \'\'', () => {
      expect(keyHandler(obj, false, false)).toEqual('');
      ;
      expect(
        keyHandler(
          Object.assign(obj, {
            target: {
              tagName: 'TEXTAREA'
            }
          }), true, false
        )
      ).toEqual('');
      expect(
        keyHandler(
          Object.assign(obj, {
            target: {
              tagName: 'INPUT'
            }
          }), true, false
        )
      ).toEqual('');
      expect(
        keyHandler(
          Object.assign(obj, {
            target: {
              tagName: 'SELECT'
            }
          }), true, false
        )
      ).toEqual('');
      expect(
        keyHandler(
          Object.assign(obj, {
            target: {
              tagName: 'DIV'
            },
            keyCode: 36
          }), true, false
        )
      ).toEqual('');
      expect(
        keyHandler(
          Object.assign(obj, {
            target: {
              tagName: 'DIV'
            },
            keyCode: 39
          }), true, false
        )
      ).toEqual('next');
    });
  });
});
