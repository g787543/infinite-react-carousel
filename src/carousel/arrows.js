import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const Arrow = ({
  arrows,
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
    if (e) {
      e.preventDefault();
    }
    clickHandler(options, e);
  };
  const classes = {
    'carousel-arrow': true,
    block: arrowsBlock,
  };
  let handler = null;
  const arrowOptions = {
    arrowsScroll
  };
  if (type === 'prev') {
    Object.assign(classes, {
      'carousel-prev': true
    });
    Object.assign(arrowOptions, { message: 'previous' });
    handler = ClickHandler.bind(this, arrowOptions);
  } else if (type === 'next') {
    Object.assign(classes, {
      'carousel-next': true
    });
    Object.assign(arrowOptions, { message: 'next' });
    handler = ClickHandler.bind(this, arrowOptions);
  }

  const arrowProps = {
    key: type === 'prev' ? '0' : '1',
    'data-role': 'none',
    className: classnames(classes),
    // style: { display: 'block' },
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
  arrowsScroll: PropTypes.number,
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
  ]),
  arrowsBlock: PropTypes.bool,
};
Arrow.defaultProps = {
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

const PrevArrow = (props) => <Arrow type="prev" {...props} />;
const NextArrow = (props) => <Arrow type="next" {...props} />;

export { PrevArrow, NextArrow };
