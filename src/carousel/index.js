import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from './slider';

class Carousel extends Component {
  slickNext = () => this.innerSlider.slickNext();

  slickPrev = () => this.innerSlider.slickPrev();

  slickPlay = () => this.innerSlider.autoPlayInit();

  slickPause = () => this.innerSlider.handleAutoplayPause();

  slickGoTo = (n) => this.innerSlider.slickSet(n);

  render() {
    const { children } = this.props;
    return (
      <Slider
        {...this.props}
        ref={(slider) => {
          this.innerSlider = slider;
        }}
      >
        {children}
      </Slider>
    );
  }
}

Carousel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.arrayOf(PropTypes.instanceOf(Element)),
    PropTypes.func,
    PropTypes.oneOf([null])
  ]).isRequired
};

export default Carousel;
