import React from 'react';
import { mount } from 'enzyme';
import { SliderWithVirtualList } from '../testComponent';
import { sendMouseEvent, sendWheelEvent } from '../test-helper';

describe('[VirtualList]', () => {
  describe('virtualList is false', () => {
    const wrapper = mount(<SliderWithVirtualList />);
    const wrapperInstance = wrapper.instance();
    wrapper.setProps({
      dots: true,
      arrowsScroll: 10,
      slidesToShow: 3,
      centerMode: true,
      wheel: true,
      wheelScroll: 10
    }).update();
    it('test arrows scroll', async () => {
      await wrapperInstance.testForScroll(() => {
        expect(wrapper.find('.carousel-item').length).toEqual(1000);
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide1');
        expect(wrapper.state()).toEqual({ currentSlide: null, nextSlide: null, endSlide: null });
        wrapper.find('.carousel-prev').simulate('click');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide991');
        expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 990 });
      }, 2000);
      await wrapperInstance.testForScroll(() => {
        wrapper.find('.carousel-next').simulate('click');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide1');
        expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 990, nextSlide: 0 });
      }, 2000);
    });
    it('test wheel scroll', async () => {
      await wrapperInstance.testForScroll(() => {
        expect(wrapper.state()).toEqual({ currentSlide: 990, nextSlide: 0, endSlide: 0 });
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide1');
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
      }, 2000);

      await wrapperInstance.testForScroll(() => {
        sendWheelEvent(0, -100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide1');
        expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 10, nextSlide: 0 });
        wrapper.setState({ currentSlide: null, nextSlide: null, endSlide: null });
      }, 2000);
    });
  });
  describe('virtualList is true', () => {
    const wrapper = mount(<SliderWithVirtualList />);
    const wrapperInstance = wrapper.instance();
    wrapper.setProps({
      virtualList: true,
      dots: true,
      arrowsScroll: 10,
      slidesToShow: 3,
      centerMode: true,
      wheel: true,
      wheelScroll: 10
    }).update();
    it('test arrows scroll', async () => {
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
        wrapper.find('.carousel-prev').simulate('click');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide991');
        expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 990 });
        expect(wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelectorAll('.carousel-item').length).toEqual(9);
      }, 2000);
      await wrapperInstance.testForScroll(() => {
        wrapper.find('.carousel-next').simulate('click');
        expect(wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelectorAll('.carousel-item').length).toEqual(9);
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide1');
        expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 990, nextSlide: 0 });
        expect(wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelectorAll('.carousel-item').length).toEqual(9);
      }, 2000);
    });
    it('change slide items length', async () => {
      wrapper.setProps({
        overScan: 1,
        slidesToShow: 1
      }).update();
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
        expect(wrapper.state()).toEqual({ currentSlide: 990, nextSlide: 0, endSlide: 0 });
        sendMouseEvent(100, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'mousedown');
        sendMouseEvent(1200, 10, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'mousemove');
        sendMouseEvent(1200, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'mouseup');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide1000');
        expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 999, nextSlide: undefined });
        expect(wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelectorAll('.carousel-item').length).toEqual(3);
      }, 2000);
      await wrapperInstance.testForScroll(() => {
        expect(wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelectorAll('.carousel-item').length).toEqual(3);
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide1000');
        sendMouseEvent(1200, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'mousedown');
        sendMouseEvent(100, 10, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'mousemove');
        sendMouseEvent(100, 0, wrapperInstance.innerSlider.innerSlider.state.SliderRef, 'mouseup');
        console.log('trigger');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide1');
        expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: undefined });
        expect(wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelectorAll('.carousel-item').length).toEqual(3);
      }, 2500);
    });
  });
});
