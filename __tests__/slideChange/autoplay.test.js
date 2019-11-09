import React from 'react';
import { mount } from 'enzyme';
import { SliderWithBeforeChange } from '../testComponent';
import { delay } from '../test-helper';
import { defaultProps } from '../../src/carousel/types';

describe('[AutoPlay]', () => {
  const wrapper = mount(<SliderWithBeforeChange />);
  const wrapperInstance = wrapper.instance();
  wrapper.setProps({ autoplay: true }).update();
  it('should slide 1 item at once', async () => {
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide1');
    expect(wrapper.state()).toEqual({ currentSlide: null, nextSlide: null, endSlide: null });
    await delay(defaultProps.autoplaySpeed + 200);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide2');
    expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 1 });
    await delay(1500);
    expect(wrapper.state().endSlide).toEqual(1);
  });
  it('should slide 2 item at once', async () => {
    wrapper.setProps({ autoplayScroll: 2 }).update();
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide2');
    expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 1 });
    await delay(defaultProps.autoplaySpeed + 300);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide4');
    expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 1, nextSlide: 3 });
  });
  it('should slide 3 item at once', async () => {
    wrapper.setProps({ autoplayScroll: 3 }).update();
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide4');
    expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 1, nextSlide: 3 });
    // TODO: delay time have problem
    await delay(defaultProps.autoplaySpeed + 1900);
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
