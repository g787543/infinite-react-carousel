import React, { Component } from 'react';
import each from 'lodash/each';
import classNames from 'classnames';
import CircularArray from './array';
import { defaultProps, propTypes, autoplayProps } from './types';
import { PrevArrow, NextArrow } from './arrows';
import Dots from './dots';
import './style.css';

const extractObject = (spec, keys) => {
  const newObject = {};
  keys.forEach((key) => {
    newObject[key] = spec[key];
  });
  return newObject;
};

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SliderRef: null,
      width: 0,
      height: 0,
      autoplaying: null
    };
    this.settings = null;
    this.newChildren = [];
    this.offset = 0;
    this.target = 0;
    this.items = null;
    this.dim = 1;
    this.xform = 'transform';
    this.activeIndex = 0;
    this.resizeObserver = null;
    this.autoplayTimer = null;
    ['webkit', 'Moz', 'O', 'ms'].every((prefix) => {
      const e = `${prefix}Transform`;
      if (typeof document.body.style[e] !== 'undefined') {
        this.xform = e;
        return false;
      }
      return true;
    });
    /* switch */
    this.beforeChange = false;
    this.autoplayTimer = null;
    this.arrowClick = null;

    /* functionBind */
    this.handleCarouselTap = this.handleCarouselTap.bind(this);
    this.handleCarouselDrag = this.handleCarouselDrag.bind(this);
    this.handleCarouselRelease = this.handleCarouselRelease.bind(this);
    this.handleAutoplayPause = this.handleAutoplayPause.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleResizeHeight = this.handleResizeHeight.bind(this);
    this.scroll = this.scroll.bind(this);
    this.setRef = this.setRef.bind(this);
    this.slideInit = this.slideInit.bind(this);
    this.slickNext = this.slickNext.bind(this);
    this.slickPrev = this.slickPrev.bind(this);
    this.slickSet = this.slickSet.bind(this);
    this.cycleTo = this.cycleTo.bind(this);
    this.autoPlay = this.autoPlay.bind(this);
    this.play = this.autoPlay.bind(this, autoplayProps);
    this.pause = this.handleAutoplayPause.bind(this, autoplayProps);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  /**
   * Handle Throttle Resize
   * @param {Event} e
   */
  handleResize = () => {
    this.slideInit();
    this.connectObserver();
    if (this.settings.fullWidth) {
      const { width } = this.state;
      this.dim = width * 2 + this.settings.gutter;
      this.offset = this.center * 2 * width;
      this.target = this.offset;
    } else {
      this.scroll();
    }
  };

  /**
   * settings init
   */
  init = () => {
    this.settings = { ...defaultProps, ...this.props };
    // force showing one slide and scrolling by one if the fade mode is on
    if (this.settings.fade) {
      if (
        this.settings.slidesToShow > 1 && process.env.NODE_ENV !== 'production'
      ) {
        console.warn(
          `slidesToShow should be equal to 1 when fade is true, you're using ${this.settings.slidesToShow}`
        );
      }
      this.settings.slidesToShow = 1;
    }
    let { children } = this.props;
    children = React.Children.toArray(children).filter((child) => (typeof child === 'string' ? !!child.trim() : !!child));
    if (
      this.settings.variableWidth && (this.settings.rows > 1 || this.settings.slidesPerRow > 1)
    ) {
      console.warn(
        'variableWidth is not supported in case of rows > 1 or slidesPerRow > 1'
      );
      this.settings.variableWidth = false;
    }
    this.newChildren = [];
    let currentWidth = null;
    for (
      let i = 0;
      i < children.length;
      i += this.settings.rows * this.settings.slidesPerRow
    ) {
      const newSlide = [];
      for (
        let j = i;
        j < i + this.settings.rows * this.settings.slidesPerRow;
        j += this.settings.slidesPerRow
      ) {
        const row = [];
        for (let k = j; k < j + this.settings.slidesPerRow; k += 1) {
          if (this.settings.variableWidth && children[k].props.style) {
            currentWidth = children[k].props.style.width;
          }
          if (k >= children.length) break;
          row.push(
            React.cloneElement(children[k], {
              key: 100 * i + 10 * j + k,
              tabIndex: -1,
              style: {
                width: `${100 / this.settings.slidesPerRow}%`,
                display: 'inline-block'
              }
            })
          );
        }
        newSlide.push(<div key={10 * i + j}>{row}</div>);
      }
      if (this.settings.variableWidth) {
        this.newChildren.push(
          <div key={i} style={{ width: currentWidth }}>
            {newSlide}
          </div>
        );
      } else {
        const { width } = this.state;
        this.newChildren.push(
          <div
            key={i}
            className="carousel-item"
            style={{ width: `${width}px` }}
          >
            {newSlide}
          </div>
        );
      }
    }
  };

  /**
   * Get slider reference
   */
  setRef = (element) => this.setState({ SliderRef: element }, () => {
    const slides = element.querySelectorAll('.carousel-item');
    this.items = new CircularArray(slides);
    this.slideInit();
    const { swipe } = this.settings;
    const { slidesToShow, centerMode } = this.settings;
    if (centerMode ? slidesToShow + 2 : slidesToShow < slides.length) {
      if (swipe) {
        element.addEventListener('touchstart', this.handleCarouselTap);
        element.addEventListener('touchmove', this.handleCarouselDrag);
        element.addEventListener('touchend', this.handleCarouselRelease);
      }
      element.addEventListener('mousedown', this.handleCarouselTap);
      element.addEventListener('mousemove', this.handleCarouselDrag);
      element.addEventListener('mouseup', this.handleCarouselRelease);
      element.addEventListener('mouseleave', this.handleCarouselRelease);
      this.autoPlay();
    }
    element.addEventListener('click', this.handleClick);
  });

  /**
   * autoPlay func
   * @param {Object} options
   * @param {Number} options.autoplaySpeed
   */
  autoPlay = (options) => {
    let { autoplay, autoplaySpeed } = this.settings;
    const { pauseOnHover } = this.settings;
    if (!options) {
      autoplay = this.settings.autoplay; // eslint-disable-line prefer-destructuring
      autoplaySpeed = this.settings.autoplaySpeed; // eslint-disable-line prefer-destructuring
    } else {
      autoplay = true;
      autoplaySpeed = options.autoplaySpeed; // eslint-disable-line prefer-destructuring
    }
    if (autoplay && autoplaySpeed > 0 && !this.autoplayTimer) {
      const { SliderRef } = this.state;
      this.autoplayTimer = setInterval(this.slickNext, autoplaySpeed);
      if (pauseOnHover) {
        SliderRef.addEventListener('mouseover', () => this.handleAutoplayPause(options));
        SliderRef.removeEventListener('mouseleave', this.autoPlay);
      }
    }
  };

  /**
   * ResizeObserver connect
   */
  connectObserver = () => {
    if (!this.resizeObserver) {
      const { SliderRef } = this.state;
      this.resizeObserver = new ResizeObserver(this.handleResizeHeight);
      this.resizeObserver.observe(SliderRef.querySelector('.carousel-item'));
    }
  };

  /**
   * ResizeObserver disconnect
   */
  disconnectObserver = () => {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  };

  /**
   * Handle carousel click
   */
  handleClick = () => {
    this.disconnectObserver();
  };

  /**
   * Handle autoplay hover to pause
   * @param {Object} options
   * @param {Number} options.autoplaySpeed
   */
  handleAutoplayPause = (options) => {
    const { SliderRef } = this.state;
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
      SliderRef.removeEventListener('mouseover', this.handleAutoplayPause);
      SliderRef.addEventListener('mouseleave', () => this.autoPlay(options));
    }
  };

  /**
   * Handle Carousel Tap
   * @param {Event} e
   */
  handleCarouselTap = (e) => {
    // Fixes firefox draggable image bug
    if (e.type === 'mousedown' && e.target.tagName === 'IMG') {
      e.preventDefault();
    }
    this.pressed = true;
    this.dragged = false;
    this.verticalDragged = false;
    this.reference = this.xpos(e);
    this.referenceY = this.ypos(e);
    this.velocity = 0;
    this.amplitude = 0;
    this.frame = this.offset;
    this.timestamp = Date.now();
    clearInterval(this.ticker);
    this.ticker = setInterval(this.track, 100);
  };

  /**
   * Handle Carousel Drag
   * @param {Event} e
   */
  handleCarouselDrag = (e) => {
    if (this.pressed) {
      const x = this.xpos(e);
      const y = this.ypos(e);
      const delta = this.reference - x;
      const deltaY = Math.abs(this.referenceY - y);
      if (deltaY < 30 && !this.verticalDragged) {
        // If vertical scrolling don't allow dragging.
        if (delta > 2 || delta < -2) {
          this.dragged = true;
          this.reference = x;
          this.scroll(this.offset + delta);
        }
      } else if (this.dragged) {
        // If dragging don't allow vertical scroll.
        e.preventDefault();
        e.stopPropagation();
      } else {
        // Vertical scrolling.
        this.verticalDragged = true;
      }
    }

    if (this.dragged) {
      // If dragging don't allow vertical scroll.
      e.preventDefault();
      e.stopPropagation();
    }
  };

  /**
   * Handle Carousel Release
   * @param {Event} e
   */
  handleCarouselRelease = (e) => {
    if (this.pressed) {
      this.pressed = false;
    } else {
      return;
    }

    clearInterval(this.ticker);
    this.target = this.offset;
    if (this.velocity > 10 || this.velocity < -10) {
      this.amplitude = 0.9 * this.velocity;
      this.target = this.offset + this.amplitude;
    }
    this.target = Math.round(this.target / this.dim) * this.dim;

    // No wrap of items.
    if (this.noWrap) {
      if (this.target >= this.dim * (this.items.length - 1)) {
        this.target = this.dim * (this.items.length - 1);
      } else if (this.target < 0) {
        this.target = 0;
      }
    }
    this.amplitude = this.target - this.offset;
    this.timestamp = Date.now();
    requestAnimationFrame(this.autoScroll);

    if (this.dragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  /**
   * Handle window resize will change items Height
   */
  handleResizeHeight = (mutations) => {
    const { height } = this.state;
    const mutation = mutations[mutations.length - 1];
    const { offsetHeight } = mutation.target;
    if (height !== offsetHeight) {
      this.setState({ height: offsetHeight });
    }
  };

  /**
   * Tracks scrolling information
   */
  track = () => {
    const now = Date.now();
    const elapsed = now - this.timestamp;
    this.timestamp = now;
    const delta = this.offset - this.frame;
    this.frame = this.offset;
    const v = (1000 * delta) / (1 + elapsed);
    this.velocity = 0.8 * v + 0.2 * this.velocity;
  };

  /**
   * Auto scrolls to nearest carousel item.
   */
  autoScroll = () => {
    if (this.amplitude) {
      const elapsed = Date.now() - this.timestamp;
      const delta = this.amplitude * Math.exp(-elapsed / this.settings.duration);
      if (delta > 2 || delta < -2) {
        this.scroll(this.target - delta);
        requestAnimationFrame(this.autoScroll);
      } else {
        this.scroll(this.target);
      }
    }
  };

  /**
   * Scroll to target
   * @param {Number} x
   */
  scroll = (x, type) => {
    const { SliderRef, width } = this.state;
    const { centerMode, beforeChange, afterChange } = this.settings;
    // Start actual scroll
    let i;
    let el;
    let alignment;

    this.offset = typeof x === 'number' ? x : this.offset;
    this.center = Math.floor((this.offset + this.dim / 2) / this.dim);
    const delta = this.offset - this.center * this.dim;
    const dir = delta < 0 ? 1 : -1;
    const tween = (-dir * delta * 2) / this.dim;
    const half = Math.floor(this.items.length / 2);
    if (this.settings.fullWidth) {
      alignment = 'translateX(0)';
    } else if (centerMode) {
      alignment = `translateX(${(SliderRef.clientWidth - width) / 2 - this.settings.centerPadding}px)`;
    } else {
      alignment = `translateX(${(SliderRef.clientWidth - width) / 2}px)`;
    }

    // Track scrolling state
    if (!SliderRef.classList.contains('scrolling') && !this.arrowClick) {
      this.swiping = true;
      SliderRef.classList.add('scrolling');
    }
    if (this.scrollingTimeout != null) {
      window.clearTimeout(this.scrollingTimeout);
    }
    this.scrollingTimeout = window.setTimeout(() => {
      if (afterChange && typeof afterChange === 'function' && type === 'end') {
        afterChange(this.wrap(this.center));
      }
      SliderRef.classList.remove('scrolling');
      this.arrowClick = null;
      this.swiping = false;
    }, this.settings.duration);

    // center
    // Don't show wrapped items.
    const index = this.wrap(this.center);
    if (
      beforeChange && typeof beforeChange === 'function' && !this.beforeChange
    ) {
      beforeChange(index, index + 1);
    }
    if (!this.noWrap || (this.center >= 0 && this.center < this.items.length)) {
      el = this.items.get(index);

      // Add active class to center item.
      if (el.classList.contains('active')) {
        each(SliderRef.querySelectorAll('.carousel-item'), (ele) => ele.classList.remove('active'));
        el.classList.add('active');
      }
      const transformString = `${alignment} translateX(${-delta / 2}px) translateX(${dir * this.settings.shift * tween * i}px)`;
      this.updateItemStyle(el, transformString);
    }

    for (i = 1; i <= half; i += 1) {
      // right side
      // Don't show wrapped items.
      if (!this.noWrap || this.center + i < this.items.length) {
        el = this.items.get(this.wrap(this.center + i));
        const transformString = `${alignment} translateX(${this.settings.shift + (this.dim * i - delta) / 2}px)`;
        this.updateItemStyle(el, transformString);
      }

      // left side
      // Don't show wrapped items.
      if (!this.noWrap || this.center - i >= 0) {
        el = this.items.get(this.wrap(this.center - i));
        const transformString = `${alignment} translateX(${-this.settings.shift + (-this.dim * i - delta) / 2}px)`;
        this.updateItemStyle(el, transformString);
      }
    }

    // center
    // Don't show wrapped items.
    if (!this.noWrap || (this.center >= 0 && this.center < this.items.length)) {
      el = this.items.get(this.wrap(this.center));
      if (!el.classList.contains('active')) {
        each(SliderRef.querySelectorAll('.carousel-item'), (ele) => ele.classList.remove('active'));
        el.classList.add('active');
        this.activeIndex = this.wrap(this.center);
      }
      const transformString = `${alignment} translateX(${-delta / 2}px) translateX(${dir * this.settings.shift * tween}px)`;
      this.updateItemStyle(el, transformString);
    }

    // onCycleTo callback
    const currItem = SliderRef.querySelectorAll('.carousel-item')[
      this.wrap(this.center)
    ];

    // One time callback
    if (typeof this.oneTimeCallback === 'function') {
      this.oneTimeCallback.call(this, currItem, this.dragged);
      this.oneTimeCallback = null;
    }
  };

  /**
   * Cycle to target
   * @param {Element} el
   * @param {String} transform
   */
  updateItemStyle = (el, transform) => {
    const newEl = el;
    newEl.style[this.xform] = transform;
    newEl.style.zIndex = 1;
  };

  /**
   * Carousel first initional
   */
  slideInit = () => {
    const {
      centerMode,
      centerPadding,
      slidesToShow,
      initialSlide
    } = this.settings;
    const { SliderRef } = this.state;
    if (SliderRef) {
      let padding = 0;
      if (typeof centerPadding === 'string') {
        [padding] = centerPadding.match(/\d+/g);
      } else if (typeof centerPadding === 'number') {
        padding = centerPadding;
      } else if (process.env.NODE_ENV !== 'production') {
        console.warn('centerPadding have to be number or string like 50px');
      }
      const sliderWidth = centerMode
        ? SliderRef.offsetWidth - padding * 2
        : SliderRef.offsetWidth;
      const width = sliderWidth / slidesToShow;
      this.setState({ width }, () => {
        this.dim = width * 2;
        // this.settings.gutter = padding;
        this.scroll();
        if (
          initialSlide && typeof initialSlide === 'number' && initialSlide > 0
        ) {
          this.slickSet(initialSlide);
        } else if (
          typeof initialSlide !== 'number' && process.env.NODE_ENV !== 'production'
        ) {
          console.warn('initialSlide must be a number');
        }
        this.connectObserver();
      });
    }
  };

  /**
   * Get x position from event
   * @param {Event} e
   */
  xpos = (e) => {
    // touch event
    if (e.targetTouches && e.targetTouches.length >= 1) {
      return e.targetTouches[0].clientX;
    }

    // mouse event
    return e.clientX;
  };

  /**
   * Get y position from event
   * @param {Event} e
   */
  ypos = (e) => {
    // touch event
    if (e.targetTouches && e.targetTouches.length >= 1) {
      return e.targetTouches[0].clientY;
    }

    // mouse event
    return e.clientY;
  };

  /**
   * Wrap index
   * @param {Number} x
   */
  wrap = (x) => {
    let result;
    if (x >= this.items.length) result = x % this.items.length;
    else if (x < 0) result = this.wrap(this.items.length + (x % this.items.length));
    else result = x;
    return result;
  };

  /**
   * Cycle to target
   * @param {Number} n
   * @param {Function} callback
   */
  cycleTo = (n, callback) => {
    let diff = (this.center % this.items.length) - n;
    // Account for wraparound.
    if (!this.noWrap) {
      if (diff < 0) {
        if (Math.abs(diff + this.items.length) < Math.abs(diff)) {
          diff += this.items.length;
        }
      } else if (diff > 0) {
        if (Math.abs(diff - this.items.length) < diff) {
          diff -= this.items.length;
        }
      }
    }

    this.target = this.dim * Math.round(this.offset / this.dim);
    // Next
    if (diff < 0) {
      this.target += this.dim * Math.abs(diff);
      // Prev
    } else if (diff > 0) {
      this.target -= this.dim * diff;
    }
    // Set one time callback
    if (typeof callback === 'function') {
      this.oneTimeCallback = callback;
    }
    // Scroll
    if (this.offset !== this.target) {
      this.amplitude = this.target - this.offset;
      this.timestamp = Date.now();
      requestAnimationFrame(this.autoScroll);
    }
  };

  /**
   * Cycle to next item
   * @param {Number} n
   */
  slickNext = (n) => {
    this.arrowClick = 'next';
    if (n) {
      this.cycleTo(n);
    } else {
      this.cycleTo(this.activeIndex + 1);
    }
  };

  /**
   * Cycle to previous item
   * @param {Number} n
   */
  slickPrev = (n) => {
    this.arrowClick = 'prev';
    if (typeof n === 'number') {
      this.cycleTo(n);
    } else {
      this.slickPrev(this.activeIndex - 1);
    }
  };

  /**
   * Cycle to nth item
   * @param {Number} [n]
   * @param {Function} callback
   */
  slickSet = (n, callback) => this.cycleTo(n, callback);

  render() {
    this.init();
    const { height } = this.state;
    const { centerPadding, centerMode } = this.settings;
    const padding = typeof centerPadding === 'string' ? centerPadding : `${centerPadding}px`;
    const spec = { ...this.props, ...this.state, ...this.settings };

    /*  arrow  */
    const arrowProps = extractObject(spec, [
      'arrows',
      'centerMode',
      'currentSlide',
      'slideCount',
      'slidesToShow',
      'prevArrow',
      'nextArrow'
    ]);
    let prevArrow;
    let nextArrow;
    if (this.settings.arrows) {
      prevArrow = (
        <PrevArrow
          clickHandler={() => this.slickPrev(this.activeIndex - 1)}
          {...arrowProps}
        />
      );
      nextArrow = (
        <NextArrow
          clickHandler={() => this.slickNext(this.activeIndex + 1)}
          {...arrowProps}
        />
      );
    }

    /*  Dots  */
    let dots;
    if (this.settings.dots === true && this.items) {
      if (this.items.length >= this.settings.slidesToShow) {
        const dotProps = extractObject(spec, [
          'dotsClass',
          'slidesToShow',
          'currentSlide',
          'dotsScroll',
          'clickHandler',
          'children',
          'customPaging',
          'infinite',
          'appendDots'
        ]);
        const { pauseOnDotsHover } = this.settings;
        Object.assign(dotProps, {
          slideCount: this.items.length,
          clickHandler: (options) => this.slickSet(options.index * options.dotsScroll),
          onMouseEnter: pauseOnDotsHover ? this.onDotsLeave : null,
          onMouseOver: pauseOnDotsHover ? this.onDotsOver : null,
          onMouseLeave: pauseOnDotsHover ? this.onDotsLeave : null
        });
        dots = <Dots {...dotProps} />;
      }
    }
    /*  Slide  */
    let component = (
      <div
        ref={(e) => {
          const { SliderRef } = this.state;
          if (!SliderRef) {
            this.setRef(e);
          }
        }}
        className="carousel-initialized"
        style={{
          padding: centerMode ? `0 ${padding}` : 0
        }}
      >
        {!this.settings.unslick ? prevArrow : ''}
        <div style={{ height: `${height}px` }} className="carousel-track">
          {this.newChildren}
        </div>
        {!this.settings.unslick ? nextArrow : ''}
        {!this.settings.unslick ? dots : ''}
      </div>
    );
    if (this.settings === 'unslick') {
      const className = `regular slider ${this.settings.className || ''}`;
      component = <div className={className}>{this.newChildren}</div>;
    } else if (this.newChildren.length <= this.settings.slidesToShow) {
      this.settings.unslick = true;
    }
    return (
      <div className={classNames(this.settings.className)}>{component}</div>
    );
  }
}

Slider.propTypes = propTypes;
Slider.defaultProps = defaultProps;

export default Slider;
