import React from 'react';
import PropTypes from 'prop-types';

const autoplayProps = {
  autoplaySpeed: 3000
};

const defaultProps = {
  accessibility: true,
  adaptiveHeight: false, //
  afterChange: null, //
  appendDots: (dots) => <ul style={{ display: 'block' }}>{dots}</ul>, //
  arrows: true, //
  autoplay: false, //
  autoplaySpeed: 3000, //
  beforeChange: null, //
  centerMode: false, //
  arrowsScroll: 1,
  centerPadding: 50, //
  className: '', //
  customPaging: (i) => <button type="button">{i + 1}</button>, //
  dots: false, //
  dotsClass: 'carousel-dots', //
  dotsScroll: 1, //
  draggable: true,
  edgeFriction: 0.35,
  fade: false,
  focusOnSelect: false,
  initialSlide: false, //
  lazyLoad: null,
  nextArrow: null, //
  onEdge: null,
  onInit: null,
  onLazyLoadError: null,
  onReInit: null,
  pauseOnDotsHover: false,
  pauseOnFocus: false,
  pauseOnHover: true, //
  prevArrow: null, //
  responsive: null,
  rows: 1, //
  rtl: false,
  slide: 'div',
  slidesPerRow: 1, //
  slidesToShow: 1, //
  swipe: true, //
  swipeEvent: null,
  swipeToSlide: false,
  useCSS: true,
  useTransform: true,
  vertical: false,
  waitForAnimate: true,

  duration: 200, //
  shift: 0, //
  gutter: 0, //
  fullWidth: false, //
  arrowsBlock: true, //
  autoplayScroll: 1, //
  onResize: () => {},
  onSwipe: () => {}
};

const propTypes = {
  accessibility: PropTypes.bool,
  adaptiveHeight: PropTypes.bool,
  afterChange: PropTypes.func,
  appendDots: PropTypes.func,
  arrows: PropTypes.bool,
  arrowsScroll: PropTypes.number,
  autoplay: PropTypes.bool,
  autoplaySpeed: PropTypes.number,
  beforeChange: PropTypes.func,
  centerMode: PropTypes.bool,
  centerPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  cssEase: PropTypes.string,
  customPaging: PropTypes.func,
  dots: PropTypes.bool,
  dotsClass: PropTypes.string,
  dotsScroll: PropTypes.number,
  draggable: PropTypes.bool,
  easing: PropTypes.string,
  edgeFriction: PropTypes.number,
  fade: PropTypes.bool,
  focusOnSelect: PropTypes.bool,
  initialSlide: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool
  ]),
  lazyLoad: PropTypes.bool,
  nextArrow: PropTypes.oneOfType([
    PropTypes.instanceOf(Element),
    PropTypes.element
  ]),
  onEdge: PropTypes.func,
  onInit: PropTypes.func,
  onLazyLoadError: PropTypes.func,
  onReInit: PropTypes.func,
  pauseOnDotsHover: PropTypes.bool,
  pauseOnFocus: PropTypes.bool,
  pauseOnHover: PropTypes.bool,
  prevArrow: PropTypes.oneOfType([
    PropTypes.instanceOf(Element),
    PropTypes.element
  ]),
  responsive: PropTypes.array,
  rows: PropTypes.number,
  rtl: PropTypes.bool,
  slide: PropTypes.string,
  slidesPerRow: PropTypes.number,
  slidesToShow: PropTypes.number,
  swipe: PropTypes.bool,
  swipeEvent: PropTypes.func,
  swipeToSlide: PropTypes.bool,
  useCSS: PropTypes.bool,
  useTransform: PropTypes.bool,
  vertical: PropTypes.bool,
  waitForAnimate: PropTypes.bool,

  duration: PropTypes.number,
  shift: PropTypes.number,
  gutter: PropTypes.number,
  fullWidth: PropTypes.bool,
  arrowsBlock: PropTypes.bool,
  autoplayScroll: PropTypes.number,
  onResize: PropTypes.func,
  onSwipe: PropTypes.func
};

const dotsDefaultProps = {
  slideCount: 0,
  dotsScroll: 1,
  slidesToShow: 1,
  infinite: true,
  currentSlide: 0,
  clickHandler: () => {},
  onMouseEnter: () => {},
  onMouseOver: () => {},
  onMouseLeave: () => {},
  customPaging: (i) => <button type="button">{i + 1}</button>,
  appendDots: (dots) => <ul style={{ display: 'block' }}>{dots}</ul>,
  dotsClass: ''
};

const dotsPropTypes = {
  slideCount: PropTypes.number,
  dotsScroll: PropTypes.number,
  slidesToShow: PropTypes.number,
  infinite: PropTypes.bool,
  currentSlide: PropTypes.number,
  clickHandler: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseLeave: PropTypes.func,
  customPaging: PropTypes.func,
  appendDots: PropTypes.func,
  dotsClass: PropTypes.string
};

const arrowsPropTypes = {
  arrows: PropTypes.bool,
  arrowsScroll: PropTypes.number,
  // currentSlide: PropTypes,
  clickHandler: PropTypes.func,
  // slideCount,
  type: PropTypes.oneOf(['prev', 'next']),
  prevArrow: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.instanceOf(Element),
    PropTypes.oneOf([null])
  ]),
  nextArrow: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.instanceOf(Element),
    PropTypes.oneOf([null])
  ]),
  arrowsBlock: PropTypes.bool,
};
const arrowsDefaultProps = {
  arrows: true,
  arrowsScroll: 1,
  // currentSlide,
  clickHandler: () => {},
  // slideCount,
  type: 'prev',
  arrowsBlock: true,
  prevArrow: null,
  nextArrow: null
};

export {
  defaultProps,
  propTypes,
  autoplayProps,
  dotsDefaultProps,
  dotsPropTypes,
  arrowsDefaultProps,
  arrowsPropTypes
};
