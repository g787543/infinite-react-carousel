import React from 'react';
import { mount } from 'enzyme';
import { SliderWithBeforeChange } from '../testComponent';
import { sendTouchEvent } from '../test-helper';

describe('[Swipe]', () => {
  const wrapper = mount(<SliderWithBeforeChange />);
  const wrapperInstance = wrapper.instance();
  it('should slide item', async () => {
    expect(wrapper.state()).toEqual({ currentSlide: null, nextSlide: null, endSlide: null });
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
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 1, nextSlide: undefined });
      expect(wrapper.state().endSlide).toEqual(1);
    }, 1500);
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
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: undefined });
      expect(wrapper.state().endSlide).toEqual(0);
    }, 3000);
  });
});
