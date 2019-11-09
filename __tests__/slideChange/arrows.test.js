import React from 'react';
import { mount } from 'enzyme';
import { SliderWithBeforeChange } from '../testComponent';
import { delay } from '../test-helper';

describe('[Arrows]', () => {
  const wrapper = mount(<SliderWithBeforeChange />);
  const wrapperInstance = wrapper.instance();
  it('should slide 1 item', async () => {
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide1');
    expect(wrapper.state()).toEqual({ currentSlide: null, nextSlide: null, endSlide: null });
    await wrapperInstance.testForScroll(
      () => {
        wrapper.find('.carousel-arrow.carousel-next').simulate('click');
      }, async () => {
        expect(
          wrapper
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide2');
        expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 0, nextSlide: 1 });
      }
    );
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
    }, 600);
  });
  it('should slide 2 items', async () => {
    wrapper.setProps({ arrowsScroll: 2 });
    wrapper.update();
    expect(wrapper.props().arrowsScroll).toEqual(2);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide2');
    expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 2, nextSlide: 1 });
    await wrapperInstance.testForScroll(
      () => {
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
      },
      800
    );

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
    }, 1000);
  });
  it('should slide 3 items', async () => {
    wrapper.setProps({ arrowsScroll: 3 }).update();
    expect(wrapper.props().arrowsScroll).toEqual(3);
    expect(
      wrapper
        .find('.carousel-track')
        .getDOMNode()
        .querySelector('.carousel-item.active')
        .textContent
    ).toEqual('slide2');
    expect(wrapperInstance.getBeforeState()).toEqual({ currentSlide: 3, nextSlide: 1 });
    await wrapperInstance.testForScroll(
      () => {
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
      },
      1200
    );
    await wrapperInstance.testForScroll(
      () => {
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
      },
      1400
    );
  });
});
