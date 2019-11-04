import React from 'react';
import { mount } from 'enzyme';
import { delay } from './test-helper';
import { SliderWithScroll as Slider } from './testComponent';
import { defaultProps } from '../src/carousel/types';

describe('test functions', () => {
  const wrapper = mount(<Slider />);
  const {
    slickNext,
    slickPrev,
    slickPlay,
    slickPause,
    slickGoTo
  } = wrapper.instance().innerSlider;
  it('[slickNext]', async () => {
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide1');
    slickNext();
    await delay(200);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide2');
  });
  it('[slickPrev]', async () => {
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide2');
    slickPrev();
    await delay(200);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide1');
  });
  it('[slickGoTo]', async () => {
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide1');
    slickGoTo(3);
    await delay(400);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide4');

    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide4');
    slickGoTo(0);
    await delay(400);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide1');
  });

  it('[slickPlay]', async () => {
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide1');
    slickPlay();
    await delay(defaultProps.autoplaySpeed + defaultProps.duration);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide2');
  });
  
  it('[slickPause]', async () => {
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide2');
    slickPause();
    await delay(defaultProps.autoplaySpeed + defaultProps.duration);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide2');
  });
});
