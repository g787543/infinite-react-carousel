import { dotsDefaultProps, arrowsDefaultProps } from '../src/carousel/types';

describe('test type', () => {
  describe('[dots]', () => {
    it('clickHandler', () => {
      dotsDefaultProps.clickHandler();
      expect(dotsDefaultProps.clickHandler).toBeDefined();
    });
    it('onMouseEnter', () => {
      dotsDefaultProps.onMouseEnter();
      expect(dotsDefaultProps.onMouseEnter).toBeDefined();
    });
    it('onMouseOver', () => {
      dotsDefaultProps.onMouseOver();
      expect(dotsDefaultProps.onMouseOver).toBeDefined();
    });
    it('onMouseLeave', () => {
      dotsDefaultProps.onMouseLeave();
      expect(dotsDefaultProps.onMouseLeave).toBeDefined();
    });
    it('customPaging', () => {
      dotsDefaultProps.customPaging();
      expect(dotsDefaultProps.customPaging).toBeDefined();
    });
    it('appendDots', () => {
      dotsDefaultProps.appendDots();
      expect(dotsDefaultProps.appendDots).toBeDefined();
    });
  });
  describe('[arrows]', () => {
    it('clickHandler', () => {
      arrowsDefaultProps.clickHandler();
      expect(arrowsDefaultProps.clickHandler).toBeDefined();
    });
  });
});
