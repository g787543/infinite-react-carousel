import React from 'react';
import { mount } from 'enzyme';
import { SliderWithBeforeChange } from '../testComponent';
import { delay, sendWheelEvent } from '../test-helper';

describe('[Wheel]', () => {
  const wrapper = mount(<SliderWithBeforeChange />);
  const wrapperInstance = wrapper.instance();
  wrapper.setProps({ wheel: true }).update();
  it('should slide 1 item at once', async () => {
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide1');
    expect(wrapper.state()).toEqual({ currentSlide: null, nextSlide: null, endSlide: null });
    sendWheelEvent(0, 100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
    await delay(1500);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide2');
    expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 1 });
    expect(wrapper.state().endSlide).toEqual(1);
    sendWheelEvent(0, -100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
    await delay(1500);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide1');
    expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 1, nextSlide: 0 });
  });
  it('should slide 2 item at once', async () => {
    wrapper.setProps({ wheelScroll: 2 }).update();
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide1');
    expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 1, nextSlide: 0 });
    sendWheelEvent(0, 100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
    await delay(2000);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide3');
    expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 2 });
    sendWheelEvent(0, -100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
    await delay(2000);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide1');
    expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 2, nextSlide: 0 });
  });
  it('should slide 3 item at once', async () => {
    wrapper.setProps({ wheelScroll: 3 }).update();
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide1');
    expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 2, nextSlide: 0 });
    sendWheelEvent(0, 100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
    await delay(2000);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide4');
    expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 3 });
    sendWheelEvent(0, -100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
    await delay(2000);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide1');
    expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 3, nextSlide: 0 });
  });
  it('close wheel will unsign eventlistener', async () => {
    wrapper.setProps({ wheel: false }).update();
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide1');
    expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 3, nextSlide: 0 });
    sendWheelEvent(0, 100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
    await delay(2000);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide1');
    expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 3, nextSlide: 0 });
  });
});