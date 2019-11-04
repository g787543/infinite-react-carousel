import { mount } from 'enzyme';
import React from 'react';
import '../examples/index.css';
import { delay } from './test-helper';
import { SliderWithScroll as Slider } from './testComponent';
import { defaultProps } from '../src/carousel/types';

describe('Slider - [Autoplay]', () => {
  const wrapper = mount(<Slider />);
  const wrapperInstance = wrapper.instance();
  describe('[autoplay]', () => {
    it('should not slides', async () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      await delay(defaultProps.autoplaySpeed + 200);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
    });
    it('should slides when autoplay is true', async () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      wrapper.setProps({ autoplay: true });
      wrapper.update();
      await delay(defaultProps.autoplaySpeed + 200);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
    });
  });

  describe('[pauseOnHover]', () => {
    it('should not autoplay when pauseOnHover is true', async () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
      wrapper.setProps({ pauseOnHover: true }).update();
      const timer = wrapperInstance.innerSlider.innerSlider.autoplayTimer;
      expect(typeof timer).toBe('number');
      const mouseOver = document.createEvent('Event');
      mouseOver.initEvent('mouseover');
      wrapperInstance.innerSlider.innerSlider.state.SliderRef.dispatchEvent(mouseOver);
      await delay(100);
      expect(wrapperInstance.innerSlider.innerSlider.autoplayTimer).toBeNull();
      const mouseLeave = document.createEvent('Event');
      mouseLeave.initEvent('mouseleave');
      wrapperInstance.innerSlider.innerSlider.state.SliderRef.dispatchEvent(mouseLeave);
      await delay(100);
      expect(wrapperInstance.innerSlider.innerSlider.autoplayTimer).not.toEqual(timer);
      await delay(defaultProps.autoplaySpeed + 200);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide3');
    });

    it('should slides when pauseOnHover is false', async () => {
      wrapper.setProps({
        pauseOnHover: false,
        autoplay: true
      }).update();
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide3');
      const timer = wrapperInstance.innerSlider.innerSlider.autoplayTimer;
      expect(typeof timer).toBe('number');
      const mouseOver = document.createEvent('Event');
      mouseOver.initEvent('mouseover');
      wrapperInstance.innerSlider.innerSlider.state.SliderRef.dispatchEvent(mouseOver);
      await delay(100);
      expect(wrapperInstance.innerSlider.innerSlider.autoplayTimer).not.toBeNull();
      expect(wrapperInstance.innerSlider.innerSlider.autoplayTimer).toEqual(timer);
      await delay(defaultProps.autoplaySpeed + 200);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide4');
      expect(wrapperInstance.innerSlider.innerSlider.autoplayTimer).toEqual(timer);
    });
  });

  let speed = 0;
  describe('[autoplaySpeed]', () => {
    it('should autoplay in 2000ms', async () => {
      speed = 2000;
      wrapper.setProps({
        autoplaySpeed: speed,
      }).update();
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide4');
      await delay(speed + 200);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide5slide5slide5');
    });

    it('should autoplay in 1000ms', async () => {
      speed = 1000;
      wrapper.setProps({
        autoplaySpeed: speed,
      }).update();
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide5slide5slide5');
      await delay(speed + 200);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide6');
    });
  });

  describe('[autoplayScroll]', () => {
    it('should slides 2 items when autoplay is true', async () => {
      wrapper.setProps({
        autoplayScroll: 2
      }).update();
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide6');
      await delay(speed + 300);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
    });

    it('should slides 3 items when autoplay is true', async () => {
      wrapper.setProps({
        autoplayScroll: 3
      }).update();
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
      await delay(speed + 400);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide5slide5slide5');
    });
  });
});
