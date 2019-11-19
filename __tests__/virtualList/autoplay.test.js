import React from 'react';
import { mount } from 'enzyme';
import { SliderWithVirtualList } from '../testComponent';
import { delay } from '../test-helper';
import { defaultProps } from '../../src/carousel/types';

describe('[AutoPlay]', () => {
  const wrapper = mount(<SliderWithVirtualList />);
  const wrapperInstance = wrapper.instance();
  wrapper.setProps({ autoplay: true, virtualList: true }).update();
  it('should slide 1 item at once', async () => {
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
      expect(wrapper.state()).toEqual({ currentSlide: null, nextSlide: null, endSlide: null });
    }, async () => {
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
        .querySelectorAll('.carousel-item').length).toEqual(6);
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 1 });
      await delay(1500);
      expect(wrapper.state().endSlide).toEqual(1);
    }, defaultProps.autoplaySpeed + 200);
  });
  it('should slide 2 item at once', async () => {
    wrapper.setProps({ autoplayScroll: 2 }).update();
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
      ).toEqual('slide2');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 1 });
    }, async () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide4');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 1, nextSlide: 3 });
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(6);
      await delay(1500);
      expect(wrapper.state().endSlide).toEqual(3);
    }, defaultProps.autoplaySpeed + 200);
  });
  it('should slide 3 item at once', async () => {
    wrapper.setProps({ autoplayScroll: 3 }).update();
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
      ).toEqual('slide4');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 1, nextSlide: 3 });
    }, async () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide7');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 3, nextSlide: 6 });
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(6);
      await delay(1500);
      expect(wrapper.state().endSlide).toEqual(6);
    }, defaultProps.autoplaySpeed + 200);
  });
  it('test big autoplayScroll', async () => {
    wrapper.setProps({ autoplayScroll: 10 }).update();
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
      ).toEqual('slide7');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 3, nextSlide: 6 });
    }, async () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide17');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 6, nextSlide: 16 });
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(5);
      await delay(1500);
      expect(wrapper.state().endSlide).toEqual(16);
    }, defaultProps.autoplaySpeed + 200);
  });
});
