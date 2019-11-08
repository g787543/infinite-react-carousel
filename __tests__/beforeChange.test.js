import React from 'react';
import { mount } from 'enzyme';
import { SliderWithBeforeChange } from './testComponent';
import { delay, sendWheelEvent } from './test-helper';
import { defaultProps } from '../src/carousel/types';

describe('beforeChange', () => {
  describe('[Arrows]', () => {
    const wrapper = mount(<SliderWithBeforeChange />);
    const wrapperInstance = wrapper.instance();
    it('should slide 1 item', async () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      expect(wrapper.state()).toEqual({ currentSlide: null, nextSlide: null });
      await wrapperInstance.testForScroll(
        () => {
          wrapper.find('.carousel-arrow.carousel-next').simulate('click');
        }, () => {
          expect(
            wrapper
              .find('.carousel-track')
              .getDOMNode()
              .querySelector('.carousel-item.active')
              .textContent
          ).toEqual('slide2');
          expect(wrapper.state()).toEqual({ currentSlide: 0, nextSlide: 1 });
        }
      );

      await wrapperInstance.testForScroll(() => {
        wrapper.find('.carousel-arrow.carousel-next').simulate('click');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide3');
        expect(wrapper.state()).toEqual({ currentSlide: 1, nextSlide: 2 });
      }, 400);

      await wrapperInstance.testForScroll(() => {
        wrapper.find('.carousel-arrow.carousel-prev').simulate('click');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide2');
        expect(wrapper.state()).toEqual({ currentSlide: 2, nextSlide: 1 });
      }, 600);
    });

    it('should slide 2 items', async () => {
      wrapper.setProps({ arrowsScroll: 2 });
      wrapper.update();
      expect(wrapper.props().arrowsScroll).toEqual(2);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
      expect(wrapper.state()).toEqual({ currentSlide: 2, nextSlide: 1 });
      await wrapperInstance.testForScroll(
        () => {
          wrapper.find('.carousel-arrow.carousel-next').simulate('click');
        }, () => {
          expect(
            wrapper
              .find('.carousel-track')
              .getDOMNode()
              .querySelector('.carousel-item.active')
              .textContent
          ).toEqual('slide4');
          expect(wrapper.state()).toEqual({ currentSlide: 1, nextSlide: 3 });
        },
        800
      );

      await wrapperInstance.testForScroll(() => {
        wrapper.find('.carousel-arrow.carousel-prev').simulate('click');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide2');
        expect(wrapper.state()).toEqual({ currentSlide: 3, nextSlide: 1 });
      }, 1000);
    });

    it('should slide 3 items', async () => {
      wrapper.setProps({ arrowsScroll: 3 });
      wrapper.update();
      expect(wrapper.props().arrowsScroll).toEqual(3);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
      expect(wrapper.state()).toEqual({ currentSlide: 3, nextSlide: 1 });
      await wrapperInstance.testForScroll(
        () => {
          wrapper.find('.carousel-arrow.carousel-next').simulate('click');
        }, () => {
          expect(
            wrapper
              .find('.carousel-track')
              .getDOMNode()
              .querySelector('.carousel-item.active')
              .textContent
          ).toEqual('slide5');
          expect(wrapper.state()).toEqual({ currentSlide: 1, nextSlide: 4 });
        },
        1200
      );
      await wrapperInstance.testForScroll(
        () => {
          wrapper.find('.carousel-arrow.carousel-prev').simulate('click');
        }, () => {
          expect(
            wrapper
              .find('.carousel-track')
              .getDOMNode()
              .querySelector('.carousel-item.active')
              .textContent
          ).toEqual('slide2');
          expect(wrapper.state()).toEqual({ currentSlide: 4, nextSlide: 1 });
        },
        1400
      );
    });
  });
  describe('[Dots]', () => {
    const wrapper = mount(<SliderWithBeforeChange />);
    const wrapperInstance = wrapper.instance();
    wrapper.setProps({ dots: true });
    wrapper.update();
    it('1 dots should slide 1 item', async () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      expect(wrapper.state()).toEqual({ currentSlide: null, nextSlide: null });
      expect(wrapper.find('.carousel-dots .carousel-dots-active').text()).toEqual('1');
      expect(wrapper.find('.carousel-dots').children().length).toEqual(6);
      await wrapperInstance.testForScroll(() => {
        wrapper.find('.carousel-dots .carousel-dot-3 button').simulate('click');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide3');
        expect(wrapper.state()).toEqual({ currentSlide: 0, nextSlide: 2 });
      },
      400);
      await wrapperInstance.testForScroll(() => {
        wrapper.find('.carousel-dots .carousel-dot-1 button').simulate('click');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide1');
        expect(wrapper.state()).toEqual({ currentSlide: 2, nextSlide: 0 });
      },
      600);
    });

    it('1 dots should slide 2 item', async () => {
      wrapper.setProps({ dotsScroll: 2 });
      wrapper.update();
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      expect(wrapper.state()).toEqual({ currentSlide: 2, nextSlide: 0 });
      expect(wrapper.find('.carousel-dots .carousel-dots-active').text()).toEqual('1');
      expect(wrapper.find('.carousel-dots').children().length).toEqual(3);
      await wrapperInstance.testForScroll(() => {
        wrapper.find('.carousel-dots .carousel-dot-3 button').simulate('click');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide5');
        expect(wrapper.state()).toEqual({ currentSlide: 0, nextSlide: 4 });
      },
      400);
      await wrapperInstance.testForScroll(() => {
        wrapper.find('.carousel-dots .carousel-dot-2 button').simulate('click');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide3');
        expect(wrapper.state()).toEqual({ currentSlide: 4, nextSlide: 2 });
      },
      600);
      await wrapperInstance.testForScroll(() => {
        wrapper.find('.carousel-dots .carousel-dot-1 button').simulate('click');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide1');
        expect(wrapper.state()).toEqual({ currentSlide: 2, nextSlide: 0 });
      },
      800);
    });

    it('1 dots should slide 3 item', async () => {
      wrapper.setProps({ dotsScroll: 3 });
      wrapper.update();
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      expect(wrapper.state()).toEqual({ currentSlide: 2, nextSlide: 0 });
      expect(wrapper.find('.carousel-dots .carousel-dots-active').text()).toEqual('1');
      expect(wrapper.find('.carousel-dots').children().length).toEqual(2);
      await wrapperInstance.testForScroll(() => {
        wrapper.find('.carousel-dots .carousel-dot-2 button').simulate('click');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide4');
        expect(wrapper.state()).toEqual({ currentSlide: 0, nextSlide: 3 });
      },
      400);
      await wrapperInstance.testForScroll(() => {
        wrapper.find('.carousel-dots .carousel-dot-1 button').simulate('click');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide1');
        expect(wrapper.state()).toEqual({ currentSlide: 3, nextSlide: 0 });
      },
      600);
    });
  });
  describe('[AutoPlay]', () => {
    const wrapper = mount(<SliderWithBeforeChange />);
    wrapper.setProps({
      autoplay: true
    }).update();
    it('should slide 1 item at once', async () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide4');
      expect(wrapper.state()).toEqual({ currentSlide: 2, nextSlide: 3 });
      await delay(defaultProps.autoplaySpeed + 200);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide5');
      expect(wrapper.state()).toEqual({ currentSlide: 3, nextSlide: 4 });
    });

    it('should slide 2 item at once', async () => {
      wrapper.setProps({ autoplayScroll: 2 }).update();
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide5');
      expect(wrapper.state()).toEqual({ currentSlide: 3, nextSlide: 4 });
      await delay(defaultProps.autoplaySpeed + 300);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      expect(wrapper.state()).toEqual({ currentSlide: 4, nextSlide: 0 });
    });

    it('should slide 3 item at once', async () => {
      wrapper.setProps({ autoplayScroll: 3 }).update();
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      expect(wrapper.state()).toEqual({ currentSlide: 4, nextSlide: 0 });
      await delay(defaultProps.autoplaySpeed + 400);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide4');
      expect(wrapper.state()).toEqual({ currentSlide: 0, nextSlide: 3 });
    });
  });
  describe('[Wheel]', () => {
    it('should slide 1 item at once', async () => {
      const wrapper = mount(<SliderWithBeforeChange />);
      wrapper.setProps({ wheel: true }).update();
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      expect(wrapper.state()).toEqual({ currentSlide: null, nextSlide: null });
      sendWheelEvent(0, 100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
      await delay(1500);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
      expect(wrapper.state()).toEqual({ currentSlide: 0, nextSlide: 1 });
      sendWheelEvent(0, -100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
      await delay(1500);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      expect(wrapper.state()).toEqual({ currentSlide: 1, nextSlide: 0 });
    });
    it('should slide 2 item at once', async () => {
      const wrapper = mount(<SliderWithBeforeChange />);
      wrapper.setProps({ wheel: true, wheelScroll: 2 }).update();
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      expect(wrapper.state()).toEqual({ currentSlide: null, nextSlide: null });
      sendWheelEvent(0, 100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
      await delay(2000);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide3');
      expect(wrapper.state()).toEqual({ currentSlide: 0, nextSlide: 2 });
      sendWheelEvent(0, -100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
      await delay(2000);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      expect(wrapper.state()).toEqual({ currentSlide: 2, nextSlide: 0 });
    });
    it('should slide 3 item at once', async () => {
      const wrapper = mount(<SliderWithBeforeChange />);
      wrapper.setProps({ wheel: true, wheelScroll: 3 }).update();
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      expect(wrapper.state()).toEqual({ currentSlide: null, nextSlide: null });
      sendWheelEvent(0, 100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
      await delay(2000);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide4');
      expect(wrapper.state()).toEqual({ currentSlide: 0, nextSlide: 3 });
      sendWheelEvent(0, -100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
      await delay(2000);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      expect(wrapper.state()).toEqual({ currentSlide: 3, nextSlide: 0 });
    });
  });
  describe('[Swipe]', () => {
    // TODO
  });
});
