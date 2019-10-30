import React, { Component, Fragment } from 'react';
import each from 'lodash/each';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import CircularArray from './array';
import { defaultProps, propTypes } from './types';
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
      autoplaying: null,
      settings: defaultProps,
      activeIndex: 0
    };
    this.newChildren = [];
    this.offset = 0;
    this.target = 0;
    this.items = null;
    this.dim = 1;
    this.xform = 'transform';
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
    this.doubleTrigger = false;
    this.initialSet = false;
    this.beforeChangeTrigger = false;
    this.autoplayTimer = null;
    this.arrowClick = null;
    this.scrollType = null;
    this.scrollOptions = {};
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
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.init();
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.init();
    return isEqual(nextProps, this.props) || isEqual(nextState, this.state);
  }

  componentDidUpdate(prevProps) {
    const { SliderRef } = this.state;
    if (!isEqual(this.props, prevProps)) {
      this.init();
      this.slideInit();
      this.setRef(SliderRef);
    }
  }

  /**
   * Handle Throttle Resize
   * @param {Event} e
   */
  handleResize = () => {
    this.slideInit();
    this.connectObserver();
    const { settings } = this.state;
    if (settings.fullWidth) {
      const { width } = this.state;
      this.dim = width * 2 + settings.gutter;
      this.offset = this.center * 2 * width;
      this.target = this.offset;
    } else {
      this.scroll('resize');
    }
  };

  /**
   * settings init
   */
  init = () => {
    let { settings } = this.state;
    settings = { ...defaultProps, ...this.props };
    // force showing one slide and scrolling by one if the fade mode is on
    if (settings.fade) {
      if (
        settings.slidesToShow > 1 && process.env.NODE_ENV !== 'production'
      ) {
        console.warn(
          `slidesToShow should be equal to 1 when fade is true, you're using ${settings.slidesToShow}`
        );
      }
      settings.slidesToShow = 1;
    }
    let { children } = this.props;
    children = React.Children.toArray(children).filter((child) => (typeof child === 'string' ? !!child.trim() : !!child));
    if (
      settings.variableWidth && (settings.rows > 1 || settings.slidesPerRow > 1)
    ) {
      console.warn(
        'variableWidth is not supported in case of rows > 1 or slidesPerRow > 1'
      );
      settings.variableWidth = false;
    }
    this.newChildren = [];
    let currentWidth = null;
    for (
      let i = 0;
      i < children.length;
      i += settings.rows * settings.slidesPerRow
    ) {
      const newSlide = [];
      for (
        let j = i;
        j < i + settings.rows * settings.slidesPerRow;
        j += settings.slidesPerRow
      ) {
        const row = [];
        for (let k = j; k < j + settings.slidesPerRow; k += 1) {
          if (settings.variableWidth && children[k].props.style) {
            currentWidth = children[k].props.style.width;
          }
          if (k >= children.length) break;
          row.push(
            React.cloneElement(children[k], {
              key: 100 * i + 10 * j + k,
              tabIndex: -1,
              style: {
                width: `${100 / settings.slidesPerRow}%`,
                display: 'inline-block'
              }
            })
          );
        }
        newSlide.push(<div key={10 * i + j}>{row}</div>);
      }
      if (settings.variableWidth) {
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
    if (!isEqual(get(this.state, 'settings'), settings)) {
      this.setState({ settings });
    }
  };

  signupListener = () => {
    const { settings, SliderRef } = this.state;
    const { swipe } = settings;
    if (swipe) {
      SliderRef.addEventListener('touchstart', this.handleCarouselTap);
      SliderRef.addEventListener('touchmove', this.handleCarouselDrag);
      SliderRef.addEventListener('touchend', this.handleCarouselRelease);
    } else {
      SliderRef.removeEventListener('touchstart', this.handleCarouselTap);
      SliderRef.removeEventListener('touchmove', this.handleCarouselDrag);
      SliderRef.removeEventListener('touchend', this.handleCarouselRelease);
    }
    SliderRef.addEventListener('mousedown', this.handleCarouselTap);
    SliderRef.addEventListener('mousemove', this.handleCarouselDrag);
    SliderRef.addEventListener('mouseup', this.handleCarouselRelease);
    SliderRef.addEventListener('mouseleave', this.handleCarouselRelease);
  }

  removeListener = () => {
    const { settings, SliderRef } = this.state;
    const { swipe } = settings;
    if (swipe) {
      SliderRef.removeEventListener('touchstart', this.handleCarouselTap);
      SliderRef.removeEventListener('touchmove', this.handleCarouselDrag);
      SliderRef.removeEventListener('touchend', this.handleCarouselRelease);
    }
    SliderRef.removeEventListener('mousedown', this.handleCarouselTap);
    SliderRef.removeEventListener('mousemove', this.handleCarouselDrag);
    SliderRef.removeEventListener('mouseup', this.handleCarouselRelease);
    SliderRef.removeEventListener('mouseleave', this.handleCarouselRelease);
  }

  /**
   * Get slider reference
   */
  setRef = (element) => this.setState({ SliderRef: element }, () => {
    const slides = element.querySelectorAll('.carousel-item');
    this.items = new CircularArray(slides);
    this.slideInit();
    const { settings } = this.state;
    const { slidesToShow } = settings;
    if (slidesToShow < slides.length) {
      this.signupListener();
      this.autoPlay();
    } else {
      this.removeListener();
    }
    element.addEventListener('click', this.handleClick);
  });

  /**
   * autoPlay func
   * @param {Object} options
   * @param {Number} options.autoplaySpeed
   */
  autoPlay = () => {
    // const { settings } = this.state;
    const { autoplay, autoplaySpeed, pauseOnHover } = this.props;
    if (autoplay && autoplaySpeed > 0 && !this.autoplayTimer) {
      const { SliderRef } = this.state;
      this.autoplayTimer = setInterval(this.slickNext, autoplaySpeed);
      if (pauseOnHover) {
        SliderRef.addEventListener('mouseover', () => this.handleAutoplayPause());
        SliderRef.removeEventListener('mouseleave', this.autoPlay);
      }
    }
  };

  /**
   * autoPlay init func
   * @param {Object} options
   * @param {Number} options.autoplaySpeed
   */
  autoPlayInit = () => {
    this.handleAutoplayPause();
    this.autoPlay();
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
  handleAutoplayPause = () => {
    const { SliderRef } = this.state;
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
      SliderRef.removeEventListener('mouseover', this.handleAutoplayPause);
      SliderRef.addEventListener('mouseleave', () => this.autoPlay());
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
          this.scroll('drag', this.offset + delta);
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
    this.scrollType = 'scroll';
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
    const { settings } = this.state;
    if (this.amplitude) {
      const elapsed = Date.now() - this.timestamp;
      const delta = this.amplitude * Math.exp(-elapsed / settings.duration);
      if (this.doubleTrigger) {
        this.beforeChangeTrigger = false;
        this.scroll('auto', this.target - delta);
        requestAnimationFrame(this.autoScroll);
        this.doubleTrigger = false;
      } else if (delta > 2 || delta < -2) {
        this.scroll('auto', this.target - delta);
        requestAnimationFrame(this.autoScroll);
      } else {
        this.scroll('end', this.target);
      }
    }
  };

  /**
   * Scroll to target
   * @param {Number} x
   */
  scroll = (type, x) => {
    const { SliderRef, width, settings } = this.state;
    const {
      centerMode,
      beforeChange,
      afterChange,
      slidesToShow
    } = settings;
    // Start actual scroll
    let i;
    let el;
    let alignment;

    this.offset = typeof x === 'number' ? x : this.offset;
    this.center = Math.floor((this.offset + this.dim / 2) / this.dim);
    const delta = this.offset - this.center * this.dim;
    const dir = delta < 0 ? 1 : -1;
    const tween = (-dir * delta * 2) / this.dim;
    if (settings.fullWidth) {
      alignment = 'translateX(0)';
    } else if (centerMode) {
      if (slidesToShow % 2 === 0) {
        alignment = `translateX(${width * (slidesToShow / 2)}px)`;
      } else {
        alignment = `translateX(${(SliderRef.clientWidth - width) / 2 - settings.centerPadding}px)`;
      }
    } else {
      alignment = 'translateX(0px)';
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
    }, settings.duration);
    // center
    // Don't show wrapped items.
    const index = this.wrap(this.center);
    if (
      !this.beforeChangeTrigger
      && beforeChange
      && typeof beforeChange === 'function'
      && (type !== 'start' && type !== 'end')
    ) {
      this.beforeChangeTrigger = true;
      if (this.scrollType === 'scroll') {
        beforeChange(index);
      } else if (this.scrollType === 'arrows') {
        const slides = settings.arrowsScroll;
        const newIndex = this.items.getIndex(this.arrowClick === 'prev' ? index - slides : index + slides);
        beforeChange(index, newIndex);
      } else if (this.scrollType === 'dots') {
        beforeChange(index, this.scrollOptions.index * this.scrollOptions.dotsScroll);
      }
    }
    if (type === 'end') {
      SliderRef.classList.remove('scrolling');
      this.beforeChangeTrigger = false;
      this.arrowClick = null;
      this.swiping = false;
    }
    if (!this.noWrap || (this.center >= 0 && this.center < this.items.length)) {
      el = this.items.get(index);

      // Add active class to center item.
      if (el.classList.contains('active')) {
        each(SliderRef.querySelectorAll('.carousel-item'), (ele) => ele.classList.remove('active'));
        el.classList.add('active');
      }
      const transformString = `${alignment} translateX(${-delta / 2}px) translateX(${dir * settings.shift * tween * i}px)`;
      this.updateItemStyle(el, transformString);
    }
    if (centerMode) {
      const half = Math.floor(this.items.length / 2);
      for (i = 1; i <= half; i += 1) {
        // right side
        // Don't show wrapped items.
        if (!this.noWrap || this.center + i < this.items.length) {
          el = this.items.get(this.wrap(this.center + i));
          const transformString = `${alignment} translateX(${settings.shift + (this.dim * i - delta) / 2}px)`;
          this.updateItemStyle(el, transformString);
        }

        // left side
        // Don't show wrapped items.
        if (!this.noWrap || this.center - i >= 0) {
          el = this.items.get(this.wrap(this.center - i));
          const transformString = `${alignment} translateX(${-settings.shift + (-this.dim * i - delta) / 2}px)`;
          this.updateItemStyle(el, transformString);
        }
      }
    } else {
      for (i = 1; i <= slidesToShow; i += 1) {
        el = this.items.get(this.wrap(this.center + i));
        const transformString = `${alignment} translateX(${settings.shift + (this.dim * i - delta) / 2}px)`;
        this.updateItemStyle(el, transformString);
      }
      for (i = 1; i <= Math.ceil((this.items.length - slidesToShow) / 2); i += 1) {
        // right side
        if (!this.noWrap || this.center + slidesToShow + i < this.items.length) {
          el = this.items.get(this.wrap(this.center + slidesToShow + i));
          const transformString = `${alignment} translateX(${settings.shift + (this.dim * (slidesToShow + i) - delta) / 2}px)`;
          this.updateItemStyle(el, transformString);
        }
        // left side
        if (!this.noWrap || this.center - i >= 0) {
          el = this.items.get(this.wrap(this.center - i));
          const transformString = `${alignment} translateX(${-settings.shift + (-this.dim * i - delta) / 2}px)`;
          this.updateItemStyle(el, transformString);
        }
      }
    }

    // center
    // Don't show wrapped items.
    if (!this.noWrap || (this.center >= 0 && this.center < this.items.length)) {
      el = this.items.get(this.wrap(this.center));
      if (!el.classList.contains('active')) {
        each(SliderRef.querySelectorAll('.carousel-item'), (ele) => ele.classList.remove('active'));
        el.classList.add('active');
        const activeIndex = this.wrap(this.center);
        this.setState({ activeIndex });
      }
      const transformString = `${alignment} translateX(${-delta / 2}px) translateX(${dir * settings.shift * tween}px)`;
      this.updateItemStyle(el, transformString);
    }
    this.adaptHeight();

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
    const { settings } = this.state;
    const {
      centerMode,
      centerPadding,
      slidesToShow,
      initialSlide
    } = settings;
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
      let { offsetWidth } = SliderRef;
      if (offsetWidth <= 0) {
        offsetWidth = window.innerWidth;
      }
      const sliderWidth = centerMode
        ? offsetWidth - padding * 2
        : offsetWidth;
      const width = sliderWidth / slidesToShow;
      this.setState({ width }, () => {
        this.dim = width * 2;
        // this.settings.gutter = padding;
        this.scroll('start');
        if (initialSlide) {
          if (typeof initialSlide === 'number') {
            if (initialSlide > 0 && !this.initialSet) {
              this.slickSet(initialSlide);
              this.initialSet = true;
            }
          } else if (
            typeof initialSlide !== 'number' && process.env.NODE_ENV !== 'production'
          ) {
            console.warn('initialSlide must be a number');
          }
        }
        this.connectObserver();
      });
    }
  };

  adaptHeight = () => {
    const { settings, SliderRef, height } = this.state;
    if (settings.adaptiveHeight && SliderRef) {
      const index = this.wrap(this.center);
      const elem = this.items.get(index);
      const { offsetHeight } = elem;
      if (height !== offsetHeight) {
        this.setState({
          height: offsetHeight
        });
      }
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
    if (this.arrowClick) {
      this.doubleTrigger = true;
    }
    this.arrowClick = 'next';
    if (n) {
      this.cycleTo(n);
    } else {
      const { activeIndex } = this.state;
      this.cycleTo(activeIndex + 1);
    }
  };

  /**
   * Cycle to previous item
   * @param {Number} n
   */
  slickPrev = (n) => {
    if (this.arrowClick) {
      this.doubleTrigger = true;
    }
    this.arrowClick = 'prev';
    if (typeof n === 'number') {
      this.cycleTo(n);
    } else {
      const { activeIndex } = this.state;
      this.cycleTo(activeIndex - 1);
    }
  };

  /**
   * Cycle to nth item
   * @param {Number} [n]
   * @param {Function} callback
   */
  slickSet = (n, callback) => this.cycleTo(n, callback);

  render() {
    const { height, settings, activeIndex } = this.state;
    const spec = { ...settings, ...this.prop };
    if (!settings) return null;
    const { centerPadding, centerMode } = settings;
    const padding = typeof centerPadding === 'string' ? centerPadding : `${centerPadding}px`;
    /*  arrow  */
    const arrowProps = extractObject(spec, [
      'arrows',
      'arrowsScroll',
      'centerMode',
      'currentSlide',
      'slideCount',
      'slidesToShow',
      'prevArrow',
      'nextArrow',
      'arrowsBlock'
    ]);
    let prevArrow;
    let nextArrow;
    if (settings.arrows) {
      prevArrow = (
        <PrevArrow
          {...arrowProps}
          clickHandler={(options) => {
            this.beforeChangeTrigger = false;
            this.scrollType = 'arrows';
            this.scrollOptions = options;
            this.slickPrev(activeIndex - options.arrowsScroll);
          }}
        />
      );
      nextArrow = (
        <NextArrow
          {...arrowProps}
          clickHandler={(options) => {
            this.beforeChangeTrigger = false;
            this.scrollType = 'arrows';
            this.scrollOptions = options;
            this.slickNext(activeIndex + options.arrowsScroll);
          }}
        />
      );
    }

    /*  Dots  */
    let dots;
    if (settings.dots === true && this.items) {
      if (this.items.length >= settings.slidesToShow) {
        const dotProps = extractObject(spec, [
          'dotsClass',
          'slidesToShow',
          'dotsScroll',
          'clickHandler',
          'children',
          'customPaging',
          'infinite',
          'appendDots'
        ]);
        const { pauseOnDotsHover } = settings;
        Object.assign(dotProps, {
          activeIndex,
          slideCount: this.items.length,
          clickHandler: (options) => {
            this.beforeChangeTrigger = false;
            this.scrollType = 'dots';
            this.scrollOptions = options;
            this.slickSet(options.index * options.dotsScroll);
          },
          onMouseEnter: pauseOnDotsHover ? this.onDotsLeave : null,
          onMouseOver: pauseOnDotsHover ? this.onDotsOver : null,
          onMouseLeave: pauseOnDotsHover ? this.onDotsLeave : null
        });
        dots = <Dots {...dotProps} />;
      }
    }
    const judge = this.items ? settings.slidesToShow < this.items.length : false;
    /*  Slide  */
    let component = (
      <Fragment>
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
          {!settings.unslick && judge ? prevArrow : ''}
          <div style={{ height: `${height}px` }} className="carousel-track">
            {this.newChildren}
          </div>
          {!settings.unslick && judge ? nextArrow : ''}
        </div>
        {!settings.unslick && judge ? dots : ''}
      </Fragment>
    );
    if (settings === 'unslick') {
      const className = `regular slider ${settings.className || ''}`;
      component = <div className={className}>{this.newChildren}</div>;
    }
    return (
      <div className={classNames(settings.className)}>{component}</div>
    );
  }
}

Slider.propTypes = propTypes;
Slider.defaultProps = defaultProps;

export default Slider;
