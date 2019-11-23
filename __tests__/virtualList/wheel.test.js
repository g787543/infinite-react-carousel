import React from 'react';
import { mount } from 'enzyme';
import { SliderWithVirtualList } from '../testComponent';
import { sendWheelEvent } from '../test-helper';

describe('[Wheel]', () => {
  const wrapper = mount(<SliderWithVirtualList />);
  const wrapperInstance = wrapper.instance();
  wrapper.setProps({ wheel: true, virtualList: true }).update();
  it('should slide 1 item at once', async () => {
    await wrapperInstance.testForScroll(() => {
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
        .querySelectorAll('.carousel-item').length).toEqual(1000);
      expect(wrapper.state()).toEqual({ currentSlide: null, nextSlide: null, endSlide: null });
      sendWheelEvent(0, 100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 1 });
      expect(wrapper.state().endSlide).toEqual(1);
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(5);
    }, 2000);
    await wrapperInstance.testForScroll(() => {
      sendWheelEvent(0, -100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
    }, () => {
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 1, nextSlide: 0 });
      expect(wrapper.state().endSlide).toEqual(0);
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
    }, 2000);
  });
  it('should slide 2 item at once', async () => {
    wrapper.setProps({ wheelScroll: 2 }).update();
    expect(wrapper
      .find('.carousel-track')
      .getDOMNode()
      .querySelectorAll('.carousel-item').length).toEqual(1000);
    await wrapperInstance.testForScroll(() => {
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
        .querySelectorAll('.carousel-item').length).toEqual(1000);
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 1, nextSlide: 0 });
      sendWheelEvent(0, 100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide3');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 2 });
      expect(wrapper.state().endSlide).toEqual(2);
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(5);
    }, 2000);
    await wrapperInstance.testForScroll(() => {
      sendWheelEvent(0, -100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
    }, () => {
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 2, nextSlide: 0 });
      expect(wrapper.state().endSlide).toEqual(0);
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
    }, 2000);
  });
  it('should slide 3 item at once', async () => {
    wrapper.setProps({ wheelScroll: 3 }).update();
    expect(wrapper
      .find('.carousel-track')
      .getDOMNode()
      .querySelectorAll('.carousel-item').length).toEqual(1000);
    await wrapperInstance.testForScroll(() => {
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
        .querySelectorAll('.carousel-item').length).toEqual(1000);
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 2, nextSlide: 0 });
      sendWheelEvent(0, 100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide4');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 3 });
      expect(wrapper.state().endSlide).toEqual(3);
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(5);
    }, 2000);
    await wrapperInstance.testForScroll(() => {
      sendWheelEvent(0, -100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
    }, () => {
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 3, nextSlide: 0 });
      expect(wrapper.state().endSlide).toEqual(0);
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
    }, 2000);
  });
  it('test big wheelScroll', async () => {
    wrapper.setProps({ wheelScroll: 10 }).update();
    expect(wrapper
      .find('.carousel-track')
      .getDOMNode()
      .querySelectorAll('.carousel-item').length).toEqual(1000);
    await wrapperInstance.testForScroll(() => {
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
        .querySelectorAll('.carousel-item').length).toEqual(1000);
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 3, nextSlide: 0 });
      sendWheelEvent(0, 100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide11');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 10 });
      expect(wrapper.state().endSlide).toEqual(10);
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(5);
    }, 2000);
    await wrapperInstance.testForScroll(() => {
      sendWheelEvent(0, 100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
    }, () => {
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 10, nextSlide: 20 });
      expect(wrapper.state().endSlide).toEqual(20);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide21');
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(5);
    }, 2000);
  });
});
