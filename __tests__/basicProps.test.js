import React from 'react';
import { mount } from 'enzyme';
import {
  sendTouchEvent,
  resizeWindow,
  delay
} from './test-helper';
import { SliderWithScroll as Slider } from './testComponent';
import { defaultProps } from '../src/carousel/types';
import '../examples/index.css';

describe('Slider - [Basic]', () => {
  const wrapper = mount(<Slider />);
  const wrapperInstance = wrapper.instance();
  describe('BasicTest', () => {
    it('init', () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
    });
    it('centerMode', () => {
      // centerMode: false
      expect(
        wrapper
          .find('.carousel-initialized')
          .props()
          .style
          .padding
      ).toBe(0);
    });
    it('className', () => {
      // className: swipe
      expect(
        wrapper
          .find('.test-carousel')
          .exists()
      ).toEqual(false);
    });
    it('swipe', async () => {
      // swipe: true
      await wrapperInstance.testForScroll(() => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide1');
        sendTouchEvent(1200, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchstart', 'start');
        sendTouchEvent(100, 10, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchmove');
        sendTouchEvent(100, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchend');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide2');
      });
      await wrapperInstance.testForScroll(() => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide2');
        sendTouchEvent(100, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchstart', 'start');
        sendTouchEvent(1200, 10, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchmove');
        sendTouchEvent(1200, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchend');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide1');
      });
    });
    it('adaptiveHeight', async () => {
      // adaptiveHeight: false
      resizeWindow(1024, 768);
      // console.log(wrapper.find('.carousel-track').props().style)
      // console.log(wrapper.instance().innerSlider);
      // console.log(wrapper.instance().innerSlider.resizeObserver);
      
    });
    it('accessibility', async () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      const rightEvent = new KeyboardEvent('keydown', {
        bubbles: true, cancelable: true, key: 'ArrowRight', char: undefined, keyCode: 39
      });
      wrapperInstance.innerSlider.innerSlider.state.SliderRef.dispatchEvent(rightEvent);
      await delay(200);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
      const leftEvent = new KeyboardEvent('keydown', {
        bubbles: true, cancelable: true, key: 'ArrowLeft', char: undefined, keyCode: 37
      });
      wrapperInstance.innerSlider.innerSlider.state.SliderRef.dispatchEvent(leftEvent);
      await delay(200);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
    });
    it('duration', async () => {
      await wrapperInstance.testForScroll(() => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide1');
        wrapperInstance.innerSlider.slickNext();
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide2');
      });
      await wrapperInstance.testForScroll(() => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide2');
        wrapperInstance.innerSlider.slickPrev();
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide1');
      });
    });
    it('slidesToshow', async () => {
      const item = wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active');
      const { innerWidth } = window;
      expect(item.style.width).toEqual(`${innerWidth}px`);
    });
    it('rows', () => {
      const { rows } = defaultProps;
      expect(rows).toEqual(wrapper.find('.carousel-track').getDOMNode().querySelectorAll('.carousel-item.active .carousel-row').length);
    });
    it('slidesPerRow', () => {
      const { slidesPerRow } = defaultProps;
      expect(slidesPerRow).toEqual(wrapper.find('.carousel-track').getDOMNode().querySelectorAll('.carousel-item.active .carousel-row > div').length);
    });
  });

  it('[Props]centerMode', async () => {
    await wrapperInstance.testForScroll(() => {
      wrapper.setProps({ centerMode: true }).update();
    }, () => {
      expect(
        wrapper
          .find('.carousel-initialized')
          .props()
          .style
          .padding
      ).toBe('0 50px');
    });
  });
  it('[Props]centerPadding', async () => {
    await wrapperInstance.testForScroll(() => {
      wrapper.setProps({ centerPadding: 100 }).update();
    }, () => {
      expect(
        wrapper
          .find('.carousel-initialized')
          .props()
          .style
          .padding
      ).toBe('0 100px');
    });
  });
  it('[Props]initialSlide', async () => {
    await wrapperInstance.testForScroll(() => {
      wrapper.setProps({ initialSlide: 3 }).update();
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide4');
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
      ).toEqual('slide3');
    });
  });
  it('[Props]className', async () => {
    wrapper.setProps({ className: 'test-carousel' }).update();
    expect(
      wrapper
        .find('.test-carousel')
        .exists()
    ).toEqual(true);
  });
  it('[Props]swipe', async () => {
    wrapper.setProps({ swipe: false }).update();
    await wrapperInstance.testForScroll(() => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide3');
      sendTouchEvent(1200, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchstart', 'start');
      sendTouchEvent(100, 10, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchmove');
      sendTouchEvent(100, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchend');
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide3');
    });
    await wrapperInstance.testForScroll(() => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide3');
      sendTouchEvent(100, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchstart', 'start');
      sendTouchEvent(1200, 10, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchmove');
      sendTouchEvent(1200, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchend');
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide3');
    });
  });
  it('[Props]adaptiveHeight', async () => {
    // TODO
  });
  it('[Props]accessibility', async () => {
    wrapper.setProps({ accessibility: false }).update();
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide3');
    const rightEvent = new KeyboardEvent('keydown', {
      bubbles: true, cancelable: true, key: 'ArrowRight', char: undefined, keyCode: 39
    });
    wrapperInstance.innerSlider.innerSlider.state.SliderRef.dispatchEvent(rightEvent);
    await delay(200);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide3');
  });
  it('[Props]duration', async () => {
    wrapper.setProps({ duration: 100 }).update();
    await wrapperInstance.testForScroll(() => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide3');
      wrapperInstance.innerSlider.slickNext();
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide4');
    }, 100);
  });
  it('[Props]slidesToshow', async () => {
    wrapper.setProps({ slidesToShow: 2 }).update();
    const item = wrapper
      .find('.carousel-track')
      .getDOMNode()
      .querySelector('.carousel-item.active');
    const { innerWidth } = window;
    expect(item.style.width).toEqual(`${(innerWidth - 200) / 2}px`);
  });
  it('[Props]rows', () => {
    let rows = 2;
    wrapper.setProps({ rows }).update();
    expect(rows).toEqual(wrapper.find('.carousel-track').getDOMNode().querySelectorAll('.carousel-item.active .carousel-row').length);
    rows = 3;
    wrapper.setProps({ rows }).update();
    expect(rows).toEqual(wrapper.find('.carousel-track').getDOMNode().querySelectorAll('.carousel-item.active .carousel-row').length);
    wrapper.setProps({ rows: 1 }).update();
  });
  it('[Props]slidesPerRow', () => {
    let slidesPerRow = 2;
    wrapper.setProps({ slidesPerRow }).update();
    expect(slidesPerRow).toEqual(wrapper.find('.carousel-track').getDOMNode().querySelectorAll('.carousel-item.active .carousel-row > div').length);
    slidesPerRow = 3;
    wrapper.setProps({ slidesPerRow }).update();
    expect(slidesPerRow).toEqual(wrapper.find('.carousel-track').getDOMNode().querySelectorAll('.carousel-item.active .carousel-row > div').length);
    wrapper.setProps({ slidesPerRow: 1 }).update();
  });
});
