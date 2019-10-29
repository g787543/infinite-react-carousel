import React, { Component } from 'react';
import { mount } from 'enzyme';
import Carousel from '../src';
import { delay } from '../test-helper';

class SliderWithBeforeChange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: null,
      nextSlide: null
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  beforeChange = (currentSlide, nextSlide) => {
    this.setState({
      currentSlide,
      nextSlide
    });
    this.currentSlide = currentSlide;
    this.nextSlide = nextSlide;
  }

  testForScroll = async (befroeScroll, afterScroll, time = 200) => {
    befroeScroll();
    await delay(time);
    afterScroll();
  }

  render() {
    return (
      <Carousel beforeChange={this.beforeChange}>
        <div>slide1</div>
        <div>slide2</div>
        <div>slide3</div>
        <div>slide4</div>
      </Carousel>
    );
  }
}

describe('Slider', () => {
  it('[Function]beforeChange', async () => {
    const wrapper = mount(<SliderWithBeforeChange />);
    const wrapperInstance = wrapper.instance();
    expect(
      wrapper
      .find('.carousel-track')
      .getDOMNode()
      .querySelector('.carousel-item.active')
      .textContent
    ).toEqual('slide1');
    expect(wrapper.state()).toEqual({ currentSlide: null, nextSlide: null });
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
        ).toEqual('slide2');
        expect(wrapper.state()).toEqual({ currentSlide: 0, nextSlide: 1 });
      },
      200
    );

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
      expect(wrapper.state()).toEqual({ currentSlide: 1, nextSlide: 2 });
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
      expect(wrapper.state()).toEqual({ currentSlide: 2, nextSlide: 1 });
    }, 600);
  });
});
