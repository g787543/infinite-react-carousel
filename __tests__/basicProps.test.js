import React from 'react';
import { mount } from 'enzyme';
import {
  sendTouchEvent,
  resizeWindow
} from './test-helper';
import { SliderWithScroll as Slider } from './testComponent';
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
});
