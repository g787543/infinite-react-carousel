import { render, mount } from 'enzyme';
import React from 'react';

import { NextArrow, PrevArrow } from '../src/carousel/arrows';

function CustomArrow(props) {
  return (
    <span
      className='sample'
      data-currentSlide={props.currentSlide}
      data-slideCount={props.slideCount}
    />
  );
}

describe('Arrows', () => {
  describe('[Previous]', () => {
    it('should render arrow', () => {
      const wrapper = mount(<PrevArrow />);
      expect(wrapper.find('button')).toHaveLength(1);
      expect(wrapper.find('button').text()).toEqual(' Previous');
    });
  });

  describe('[Next]', () => {
    it('should render arrow', () => {
      const wrapper = mount(<NextArrow />);
      expect(wrapper.find('button')).toHaveLength(1);
      expect(wrapper.find('button').text()).toEqual(' Next');
    });
  });
});
