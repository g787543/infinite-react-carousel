import React from 'react';
import classnames from 'classnames';
import { arrowsDefaultProps as defaultProps, arrowsPropTypes as propTypes } from './types';

const Arrow = ({
  arrowsScroll,
  // currentSlide,
  clickHandler,
  // slideCount,
  type,
  prevArrow,
  nextArrow,
  arrowsBlock,
}) => {
  const ClickHandler = (options, e) => {
    e.preventDefault();
    clickHandler(options, e);
  };
  const classes = {
    'carousel-arrow': true,
    block: arrowsBlock,
  };
  const arrowOptions = {
    arrowsScroll
  };
  if (type === 'prev') {
    Object.assign(classes, {
      'carousel-prev': true
    });
    if (prevArrow) {
      Object.assign(classes, {
        custom: true
      });
    }
    Object.assign(arrowOptions, { message: 'previous' });
  } else {
    Object.assign(classes, {
      'carousel-next': true
    });
    if (nextArrow) {
      Object.assign(classes, {
        custom: true
      });
    }
    Object.assign(arrowOptions, { message: 'next' });
  }

  const arrowProps = {
    key: type === 'prev' ? '0' : '1',
    'data-role': 'none',
    className: classnames(classes),
    // style: { display: 'block' },
    onClick: (e) => ClickHandler(arrowOptions, e)
  };
  // const customProps = {
  //   currentSlide,
  //   slideCount,
  // };
  let customArrow = null;
  if (prevArrow && type === 'prev') {
    customArrow = React.cloneElement(<div>{prevArrow}</div>, {
      ...arrowProps
      // ...customProps,
    });
  } else if (nextArrow && type === 'next') {
    customArrow = React.cloneElement(<div>{nextArrow}</div>, {
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
  return customArrow;
};

Arrow.propTypes = propTypes;
Arrow.defaultProps = defaultProps;

const PrevArrow = (props) => <Arrow type="prev" {...props} />;
const NextArrow = (props) => <Arrow type="next" {...props} />;

export { PrevArrow, NextArrow };
