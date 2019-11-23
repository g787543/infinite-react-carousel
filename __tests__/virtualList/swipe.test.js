import React from 'react';
import { mount } from 'enzyme';
import { SliderWithVirtualList } from '../testComponent';
import { sendTouchEvent, sendMouseEvent } from '../test-helper';

describe('[Swipe]', () => {
  const wrapper = mount(<SliderWithVirtualList />);
  const wrapperInstance = wrapper.instance();
  wrapper.setProps({ virtualList: true }).update();
  it('should slide item', async () => {
    expect(wrapper.state()).toEqual({ currentSlide: null, nextSlide: null, endSlide: null });
    await wrapperInstance.testForScroll(() => {
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(1000);
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
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(5);
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 1, nextSlide: undefined });
    }, 1500);
    await wrapperInstance.testForScroll(() => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
      sendMouseEvent(100, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'mousedown', 'start');
      sendMouseEvent(1200, 10, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'mousemove');
      sendMouseEvent(1200, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'mouseup');
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(5);
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: undefined });
      expect(wrapper.state().endSlide).toEqual(0);
    }, 3000);
  });
});
