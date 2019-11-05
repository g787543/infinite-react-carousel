import React from 'react';
import enzyme from 'enzyme';
import { SliderWithScroll as Slider } from './testComponent';
import { resizeWindow, sendTouchEvent } from './test-helper';
import { getSwipeDirection } from '../src/carousel/utils';

describe('slider', () => {
  it('onInit', () => {
    let slide = null;
    const wrapper = enzyme.mount(
      <Slider
        onInit={(slider) => {
          slide = slider;
        }}
      />
    );
    const wrapperInstance = wrapper.instance();
    expect(slide).not.toBeNull();
    expect(slide).toEqual(wrapperInstance.innerSlider.innerSlider);
  });
  it('onReInit', () => {
    let initSlide = null;
    let reInitSlide = null;
    const wrapper = enzyme.mount(
      <Slider
        onInit={(slider) => {
          initSlide = slider;
        }}
      />
    );
    const wrapperInstance = wrapper.instance();
    expect(initSlide).not.toBeNull();
    expect(initSlide).toEqual(wrapperInstance.innerSlider.innerSlider);
    expect(reInitSlide).toBeNull();
    wrapper.setProps({
      onReInit: (slider) => {
        reInitSlide = slider;
      }
    }).update();
    expect(reInitSlide).not.toBeNull();
    expect(reInitSlide).toEqual(wrapperInstance.innerSlider.innerSlider);
  });
  it('onResize', () => {
    const { innerWidth, innerHeight } = window;
    enzyme.mount(
      <Slider
        onResize={(e) => {
          expect(
            [e.currentTarget.innerWidth, e.currentTarget.innerHeight]
          ).toEqual([1288, 768]);
          expect(
            [e.currentTarget.innerWidth, e.currentTarget.innerHeight]
          ).not.toEqual([innerWidth, innerHeight]);
        }}
      />
    );
    resizeWindow(1288, 768);
  });
  it('onSwipe', async () => {
    let direction = null;
    const wrapper = enzyme.mount(
      <Slider
        onSwipe={(e) => { direction = e; }}
        swipe
      />
    );
    const wrapperInstance = wrapper.instance();
    await wrapperInstance.testForScroll(() => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      sendTouchEvent(1400, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchstart', 'start');
      sendTouchEvent(100, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchmove');
      sendTouchEvent(100, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchend');
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
      expect(direction).toEqual(getSwipeDirection({
        startX: 1400,
        startY: 0,
        endX: 100,
        endY: 0
      }));
    }, 200);
    await wrapperInstance.testForScroll(() => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
      sendTouchEvent(100, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchstart', 'start');
      sendTouchEvent(1400, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchmove');
      sendTouchEvent(1400, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'touchend');
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      expect(direction).toEqual(getSwipeDirection({
        startX: 100,
        startY: 0,
        endX: 1400,
        endY: 0
      }));
    }, 200);
  });
});
