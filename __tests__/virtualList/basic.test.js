import React from 'react';
import { mount } from 'enzyme';
import { SliderWithVirtualList } from '../testComponent';
import { delay } from '../test-helper';

describe('[VirtualList]', () => {
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
          .querySelectorAll('.carousel-item').length).toEqual(7);
      }, 2000);
      await wrapperInstance.testForScroll(() => {
        wrapper.find('.carousel-next').simulate('click');
        expect(wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelectorAll('.carousel-item').length).toEqual(7);
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
          .querySelectorAll('.carousel-item').length).toEqual(7);
      }, 2000);
    });
    it('set overScan to 3', async () => {
      wrapper.setProps({ overScan: 3 }).update();
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
        wrapper.find('.carousel-next').simulate('click');
      }, () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide11');
        expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 10 });
        expect(wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelectorAll('.carousel-item').length).toEqual(9);
      }, 2000);
    });
    it('set centerMode is true', async () => {
      wrapper.setProps({ centerMode: true }).update();
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(9);
      wrapper.setProps({ slidesToShow: 4 }).update();
      wrapper.find('.carousel-next').simulate('click');
      await delay(2000);
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(10);
      wrapper.setProps({ centerMode: false, slidesToShow: 5 }).update();
      wrapper.find('.carousel-next').simulate('click');
      await delay(2000);
      expect(wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelectorAll('.carousel-item').length).toEqual(11);
      try {
        wrapper.setProps({ overScan: 0 }).update();
      } catch (error) {
        expect(error.message).toEqual('overScan shoud be greater or equal to 1 when you are useing virtualList and centerMode');
      }
    });
  });
});
