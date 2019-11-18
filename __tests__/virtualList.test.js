import React from 'react';
import { mount } from 'enzyme';
import { SliderWithVirtualList } from './testComponent';
import { delay, sendWheelEvent } from './test-helper';

describe('[VirtualList]', () => {
  const wrapper = mount(<SliderWithVirtualList />);
  const wrapperInstance = wrapper.instance();
  describe('virtualList is false', () => {
    wrapper.setProps({
      dots: true,
      arrowsScroll: 10,
      slidesToShow: 3,
      centerMode: true,
      wheel: true,
      wheelScroll: 10
    }).update();
    it('test arrows scroll', async () => {
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
      await delay(1500);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide991');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 990 });
      wrapper.find('.carousel-next').simulate('click');      
      await delay(1500);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 990, nextSlide: 0 });
    });
    it('test wheel scroll', async () => {
      expect(wrapper.state()).toEqual({ currentSlide: 990, nextSlide: 0, endSlide: null });
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      sendWheelEvent(0, 100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
      await delay(1500);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide11');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 10 });
      sendWheelEvent(0, -100, wrapper.find('.carousel-track').getDOMNode(), 'wheel');
      await delay(1500);
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 10, nextSlide: 0 });
      wrapper.setState({ currentSlide: null, nextSlide: null, endSlide: null });
    });
  });
  describe('virtualList is true', () => {
    wrapper.setProps({ virtualList: true }).update();
    it ('test arrows scroll', async () => {

    });
  });
});
