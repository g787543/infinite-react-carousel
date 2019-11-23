import React from 'react';
import { mount } from 'enzyme';
import { SliderWithVirtualList } from '../testComponent';

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
          .querySelectorAll('.carousel-item').length).toEqual(11);
      }, 2000);
    });
  });
});
