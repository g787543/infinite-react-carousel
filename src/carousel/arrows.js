import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const Arrow = ({
  arrows,
  // currentSlide,
  clickHandler,
  // slideCount,
  type,
  prevArrow,
  nextArrow
}) => {
  const ClickHandler = (options, e) => {
    if (e) {
      e.preventDefault();
    }
    clickHandler(options, e);
  };
  const classes = { 'carousel-arrow': true };
  let handler = null;
  if (type === 'prev') {
    Object.assign(classes, {
      'carousel-prev': true
    });
    handler = ClickHandler.bind(this, { message: 'previous' });
  } else if (type === 'next') {
    Object.assign(classes, {
      'carousel-next': true
    });
    handler = ClickHandler.bind(this, { message: 'next' });
  }

  const arrowProps = {
    key: type === 'prev' ? '0' : '1',
    'data-role': 'none',
    className: classnames(classes),
    style: { display: 'block' },
    onClick: handler
  };
  // const customProps = {
  //   currentSlide,
  //   slideCount,
  // };
  let customArrow;
  if (arrows) {
    if (prevArrow && type === 'prev') {
      customArrow = React.cloneElement(prevArrow, {
        ...arrowProps
        // ...customProps,
      });
    } else if (nextArrow && type === 'next') {
      customArrow = React.cloneElement(nextArrow, {
        ...arrowProps
        // ...customProps,
      });
    } else {
      customArrow = (
        <button {...arrowProps} key={type === 'prev' ? '0' : '1'} type="button">
          {' '}
          {type === 'prev' ? 'Previous' : 'Next'}
        </button>
      );
    }
  } else {
    customArrow = null;
  }
  return customArrow;
};

Arrow.propTypes = {
  arrows: PropTypes.bool,
  // currentSlide: PropTypes,
  clickHandler: PropTypes.func,
  // slideCount,
  type: PropTypes.oneOf(['prev', 'next']),
  prevArrow: PropTypes.oneOf([
    PropTypes.array,
    PropTypes.element,
    PropTypes.instanceOf(Element),
    PropTypes.oneOf([null])
  ]),
  nextArrow: PropTypes.oneOf([
    PropTypes.array,
    PropTypes.element,
    PropTypes.instanceOf(Element),
    PropTypes.oneOf([null])
  ])
};
Arrow.defaultProps = {
  arrows: true,
  // currentSlide,
  clickHandler: () => {},
  // slideCount,
  type: 'prev',
  prevArrow: null,
  nextArrow: null
};

const PrevArrow = (props) => <Arrow type="prev" {...props} />;
const NextArrow = (props) => <Arrow type="next" {...props} />;

export { PrevArrow, NextArrow };
