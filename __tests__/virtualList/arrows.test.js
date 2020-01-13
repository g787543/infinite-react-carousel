import React from 'react';
import { mount } from 'enzyme';
import { SliderWithVirtualList } from '../testComponent';
import { delay } from '../test-helper';

describe('[Arrows]', () => {
  const wrapper = mount(<SliderWithVirtualList />);
  const wrapperInstance = wrapper.instance();
  wrapper.setProps({ virtualList: true }).update();
  it('should slide 1 item', async () => {
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
      wrapper.find('.carousel-arrow.carousel-next').simulate('click');
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 1 });
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(5);
    });
    await delay(1500);
    expect(wrapper.state().endSlide).toEqual(1);
    await wrapperInstance.testForScroll(() => {
      wrapper.find('.carousel-arrow.carousel-next').simulate('click');
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide3');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 1, nextSlide: 2 });
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(5);
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
      ).toEqual('slide2');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 2, nextSlide: 1 });
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(5);
    }, 600);
  });
  it('should slide 2 items', async () => {
    wrapper.setProps({ arrowsScroll: 2 }).update();
    await wrapperInstance.testForScroll(() => {
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(1000);
      expect(wrapper.props().arrowsScroll).toEqual(2);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 2, nextSlide: 1 });
      wrapper.find('.carousel-arrow.carousel-next').simulate('click');
    }, () => {
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
        .querySelectorAll('.carousel-item').length).toEqual(5);
    }, 800);
    await delay(1500);
    expect(wrapper.state().endSlide).toEqual(3);
    await wrapperInstance.testForScroll(() => {
      wrapper.find('.carousel-arrow.carousel-prev').simulate('click');
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 3, nextSlide: 1 });
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(5);
    }, 1200);
  });
  it('should slide 3 items', async () => {
    wrapper.setProps({ arrowsScroll: 3 }).update();
    await wrapperInstance.testForScroll(() => {
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(1000);
      expect(wrapper.props().arrowsScroll).toEqual(3);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 3, nextSlide: 1 });
      wrapper.find('.carousel-arrow.carousel-next').simulate('click');
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide5');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 1, nextSlide: 4 });
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(5);
    }, 1400);
    await delay(1500);
    expect(wrapper.state().endSlide).toEqual(4);
    await wrapperInstance.testForScroll(() => {
      wrapper.find('.carousel-arrow.carousel-prev').simulate('click');
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 4, nextSlide: 1 });
    }, 1600);
  });
  it('test big arrowsScroll', async () => {
    wrapper.setProps({ arrowsScroll: 10 }).update();
    await wrapperInstance.testForScroll(() => {
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(1000);
      expect(wrapper.props().arrowsScroll).toEqual(10);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 4, nextSlide: 1 });
      wrapper.find('.carousel-arrow.carousel-next').simulate('click');
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide12');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 1, nextSlide: 11 });
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(5);
    }, 1800);
    await delay(1500);
    expect(wrapper.state().endSlide).toEqual(11);
    await wrapperInstance.testForScroll(() => {
      wrapper.find('.carousel-arrow.carousel-prev').simulate('click');
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 11, nextSlide: 1 });
    }, 2000);
    await delay(1500);
    expect(wrapper.state().endSlide).toEqual(1);
  }, 25000);
});
