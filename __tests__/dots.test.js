import { mount } from 'enzyme';
import React from 'react';
import { SliderWithScroll as Slider } from './testComponent';
import '../examples/index.css';

describe('Dots', () => {
  const wrapper = mount(<Slider />);
  describe('[dots]', () => {
    it('dots is closed', () => {
      expect(wrapper.find('.carousel-dots').exists()).toEqual(false);
    });
    it('dots is open', () => {
      wrapper.setProps({ dots: true });
      wrapper.update();
      expect(wrapper.find('.carousel-dots').exists()).toEqual(true);
      expect(wrapper.find('.carousel-dots').children().length).toEqual(6);
    });
  });

  describe('[dotsScroll]', () => {
    it('1 dots slide 2 items', () => {
      wrapper.setProps({ dotsScroll: 2 });
      wrapper.update();
      expect(wrapper.find('.carousel-dots').children().length).toEqual(3);
    });

    it('1 dots slide 3 items', () => {
      wrapper.setProps({ dotsScroll: 3 });
      wrapper.update();
      expect(wrapper.find('.carousel-dots').children().length).toEqual(2);
      wrapper.setProps({ dotsScroll: 1 });
      wrapper.update();
      expect(wrapper.find('.carousel-dots').children().length).toEqual(6);
    });
  });

  it('change dots className', () => {
    expect(wrapper.find('.carousel-dots').exists()).toEqual(true);
    const oldDotsHtml = wrapper.find('.carousel-dots').getDOMNode().innerHTML;
    wrapper.setProps({ dotsClass: 'customDotsClassName' });
    wrapper.update();
    expect(wrapper.find('.carousel-dots').exists()).toEqual(false);
    expect(wrapper.find('.customDotsClassName').exists()).toEqual(true);
    expect(wrapper.find('.customDotsClassName').getDOMNode().innerHTML).toEqual(oldDotsHtml);
    wrapper.setProps({ dotsClass: 'carousel-dots' });
    wrapper.update();
    expect(wrapper.find('.carousel-dots').exists()).toEqual(true);
    expect(wrapper.find('.customDotsClassName').exists()).toEqual(false);
  });

  it('custom dots', () => {
    expect(wrapper.find('.carousel-dots').props().style.display).toEqual('block');
    wrapper.find('.carousel-dots').children().forEach((item, index) => {
      expect(item.text()).toEqual(`${index + 1}`);
    });

    wrapper.setProps({
      appendDots: (dots) => (
        <ul style={{ width: '100%' }}>{dots}</ul>
      ),
      customPaging: (i) => (
        <button type="button">
          dots
          {i + 1}
        </button>
      )
    });
    wrapper.update();
    expect(wrapper.find('.carousel-dots').props().style.display).toEqual(undefined);
    expect(wrapper.find('.carousel-dots').props().style.width).toEqual('100%');
    wrapper.find('.carousel-dots').children().forEach((item, index) => {
      expect(item.text()).toEqual(`dots${index + 1}`);
    });
  });
});
