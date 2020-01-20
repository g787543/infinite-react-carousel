import React from 'react';
import classnames from 'classnames';
import {
  dotsDefaultProps,
  dotsPropTypes
} from './types';

const getDotCount = (spec) => (spec.infinite
  ? Math.ceil(spec.slideCount / spec.dotsScroll)
  : Math.ceil((spec.slideCount - spec.slidesToShow + 1) / spec.dotsScroll));

const Dots = ({
  slideCount,
  dotsScroll,
  slidesToShow,
  infinite,
  activeIndex,
  clickHandler,
  onMouseEnter,
  onMouseOver,
  onMouseLeave,
  customPaging,
  appendDots,
  dotsClass
}) => {
  const ClickHandler = (options, e) => {
    // In Autoplay the focus stays on clicked button even after transition
    // to next slide. That only goes away by click somewhere outside
    e.preventDefault();
    clickHandler(options);
  };
  // Apply join & split to Array to pre-fill it for IE8
  //
  // Credit: http://stackoverflow.com/a/13735425/1849458
  const dotCount = getDotCount({
    slideCount,
    dotsScroll,
    slidesToShow,
    infinite
  });
  const dots = Array.apply(
    [],
    Array(dotCount + 1)
      .join('0')
      .split('')
  ).map((x, i) => {
    const leftBound = i * dotsScroll;
    const rightBound = i * dotsScroll + (dotsScroll - 1);
    const className = classnames({
      'carousel-dots-active':
      activeIndex >= leftBound && activeIndex <= rightBound
    });

    const dotOptions = {
      message: 'dots',
      index: i,
      dotsScroll,
      activeIndex
    };
    return (
      <li className={`${className} carousel-dot-${i + 1}`} key={`${new Date().getTime() * i}`}>
        {React.cloneElement(customPaging(i), {
          onClick: (e) => ClickHandler(dotOptions, e)
        })}
      </li>
    );
  });
  return React.cloneElement(appendDots(dots), {
    className: dotsClass,
    ...{ onMouseEnter, onMouseOver, onMouseLeave }
  });
};

Dots.defaultProps = dotsDefaultProps;
Dots.propTypes = dotsPropTypes;

export default Dots;
