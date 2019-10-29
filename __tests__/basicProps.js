import React, { Component } from 'react';
import { mount } from 'enzyme';
import Carousel from '../src';
import {
  delay,
  createStartTouchEventObject,
  createMoveTouchEventObject,
  resizeWindow
} from '../test-helper';
import '../examples/index.css';

class Slider extends Component {
  constructor(props) {
    super(props);
    this.innerSlider = null;
  }

  testForScroll = async (befroeScroll, afterScroll, time = 200) => {
    befroeScroll();
    await delay(time);
    afterScroll();
  }

  render() {
    return (
      <Carousel
        ref={(ele) => {
          if (ele) {
            this.innerSlider = ele;
          }
        }}
        {...this.props}
      >
        <div>
          <h3>slide1</h3>
        </div>
        <div>
          <h3>slide2</h3>
        </div>
        <div>
          <h3>slide3</h3>
          <h3>slide3</h3>
          <h3>slide3</h3>
        </div>
        <div>
          <h3>slide4</h3>
        </div>
      </Carousel>
    );
  }
}

describe('Slider - [Basic]', () => {
  const wrapper = mount(<Slider />);
  const wrapperInstance = wrapper.instance();
  describe('BasicTest', () => {
    it('init', () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide1');
    });
    it('centerMode', () => {
      // centerMode: false
      expect(
        wrapper
          .find('.carousel-initialized')
          .props()
          .style
          .padding
      ).toBe(0);
    });
    it('className', () => {
      // className: swipe
      expect(
        wrapper
          .find('.test-carousel')
          .exists()
      ).toEqual(false);
    });
    it('swipe', async () => {
      // swipe: true
      await wrapperInstance.testForScroll(() => {
        wrapper.simulate('touchStart',
          createStartTouchEventObject({ x: 100, y: 0 }));
        wrapper.simulate('touchMove',
          createMoveTouchEventObject({ x: 1000, y: 0 }));
        wrapper.simulate('touchEnd',
          createMoveTouchEventObject({ x: 1000, y: 0 }));
      }, () => {
        // console.log(wrapper.html());
        // console.log(wrapper
        //   .find('.carousel-track').html());
      }, 100);
    });
    it('adaptiveHeight', async () => {
      // adaptiveHeight: false
      resizeWindow(1024, 768);
      // console.log(wrapper.find('.carousel-track').props().style)
      // console.log(wrapper.instance().innerSlider);
      // console.log(wrapper.instance().innerSlider.resizeObserver);
      
    });
  });

  it('[Props]centerMode', async () => {
    await wrapperInstance.testForScroll(() => {
      wrapper.setProps({ centerMode: true });
      wrapper.update();
    }, () => {
      expect(
        wrapper
          .find('.carousel-initialized')
          .props()
          .style
          .padding
      ).toBe('0 50px');
    });
  });

  it('[Props]centerPadding', async () => {
    await wrapperInstance.testForScroll(() => {
      wrapper.setProps({ centerPadding: 100 });
      wrapper.update();
    }, () => {
      expect(
        wrapper
          .find('.carousel-initialized')
          .props()
          .style
          .padding
      ).toBe('0 100px');
    });
  });

  it('[Props]initialSlide', async () => {
    await wrapperInstance.testForScroll(() => {
      wrapper.setProps({ initialSlide: 3 });
      wrapper.update();
    }, () => {
      expect(
        wrapper
          .find('.carousel-track')
          .getDOMNode()
          .querySelector('.carousel-item.active')
          .textContent
      ).toEqual('slide4');
    });

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
        ).toEqual('slide1');
      },
      400
    );
  });

  it('[Props]className', async () => {
    wrapper.setProps({ className: 'test-carousel' });
    wrapper.update();
    expect(
      wrapper
        .find('.test-carousel')
        .exists()
    ).toEqual(true);
  });

  it('[Props]swipe', async () => {

  });

  it('[Props]adaptiveHeight', async () => {


  });
});
