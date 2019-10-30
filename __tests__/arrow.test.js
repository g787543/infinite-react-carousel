import { mount } from 'enzyme';
import React from 'react';
import '../examples/index.css';
import { delay } from './test-helper';
import { SliderWithScroll as Slider, CustomArrow } from './testComponent';
import { NextArrow, PrevArrow } from '../src/carousel/arrows';

describe('Arrows', () => {
  it('do not render arrow', () => {
    const slider = mount(<Slider />);
    slider.setProps({ arrows: false });
    slider.update();
    expect(slider.find('button.carousel-arrow')).toHaveLength(0);
  });

  it('should disable arrow when arrowsBlock is false', () => {
    const slider = mount(<Slider />);
    slider.setProps({ arrowsBlock: false });
    slider.update();
    slider.find('button.carousel-arrow').forEach((item) => {
      expect(item.hasClass('block')).toEqual(false);
    });
  });

  describe('[Previous]', () => {
    it('should render arrow', () => {
      const wrapper = mount(<PrevArrow />);
      expect(wrapper.find('button')).toHaveLength(1);
      expect(wrapper.find('button').text()).toEqual(' Previous');
    });

    it('should render custom prev arrow', async () => {
      const slider = mount(<Slider />);
      slider.setProps({
        prevArrow: (
          <CustomArrow
            customClassName="PrevArrow"
            customStyle={{
              width: '100px',
              height: '100px'
            }}
          />
        )
      });
      slider.update();
      expect(slider.find('.CustomArrow .carousel-prev').hasClass('PrevArrow')).toEqual(true);
      expect(
        slider
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      slider.find('.CustomArrow .carousel-prev').simulate('click');
      await delay(200);
      expect(
        slider
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide6');
    });

    it('should slide prev 3 items at once', async () => {
      const slider = mount(<Slider />);
      const sliderInstance = slider.instance();
      slider.setProps({ arrowsScroll: 3 });
      slider.update();

      await sliderInstance.testForScroll(() => {
        expect(slider.props().arrowsScroll).toEqual(3);
        expect(
          slider
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide1');
        slider.find('.carousel-arrow.carousel-prev').simulate('click');
      }, () => {
        expect(
          slider
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide4');
      }, 400);
    });
  });

  describe('[Next]', () => {
    it('should render arrow', () => {
      const wrapper = mount(<NextArrow />);
      expect(wrapper.find('button')).toHaveLength(1);
      expect(wrapper.find('button').text()).toEqual(' Next');
    });

    it('should render custom next arrow', async () => {
      const slider = mount(<Slider />);
      slider.setProps({
        nextArrow: (
          <CustomArrow
            customClassName="NextArrow"
            customStyle={{
              width: '100px',
              height: '100px'
            }}
          />
        )
      });
      slider.update();
      expect(slider.find('.CustomArrow .carousel-next').hasClass('NextArrow')).toEqual(true);
      expect(
        slider
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
      slider.find('.CustomArrow .carousel-next').simulate('click');
      await delay(200);
      expect(
        slider
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide2');
    });

    it('should slide next 3 items at once', async () => {
      const slider = mount(<Slider />);
      const sliderInstance = slider.instance();
      slider.setProps({
        arrowsScroll: 3
      });
      slider.update();
      await sliderInstance.testForScroll(() => {
        expect(slider.props().arrowsScroll).toEqual(3);
        expect(
          slider
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide1');
        slider.find('.carousel-arrow.carousel-next').simulate('click');
      }, () => {
        expect(
          slider
            .find('.carousel-track')
            .getDOMNode()
            .querySelector('.carousel-item.active')
            .textContent
        ).toEqual('slide4');
      }, 400);
    });
  });
});
