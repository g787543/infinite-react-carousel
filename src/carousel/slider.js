import React, { Component, Fragment } from 'react';
import throttle from 'lodash/throttle';
import each from 'lodash/each';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import ResizeObserver from 'resize-observer-polyfill';
import CircularArray from './array';
import { defaultProps, propTypes } from './types';
import { PrevArrow, NextArrow } from './arrows';
import Dots from './dots';
import {
  signupListener,
  removeListener,
  handleCarouselTap,
  handleAutoplayPause,
  handleCarouselDrag,
  handleCarouselRelease,
  handleClick,
  handleKeyDown,
  handleResize,
  handleResizeHeight,
  handleWheel,
  handleVisibilityChange,
} from './listener';
import './style.css';

const extractObject = (spec, keys) => {
  const newObject = {};
  for(let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    newObject[key] = spec[key];
  }
  return newObject;
};
class Slider extends Component {
  isMounted = true;

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
    this.touchObject = {};
    this.newChildren = [];
    this.virtualList = [];
    this.center = 0;
    this.offset = 0;
    this.target = 0;
    this.items = null;
    this.virtualItem = null;
    this.dim = 1;
    this.xform = '';
    this.resizeObserver = null;
    this.autoplayTimer = null;
    ['', 'Webkit', 'Moz', 'O', 'ms'].every((prefix) => {
      const e = `${prefix}Transform`;
      if (typeof document !== 'undefined' && typeof document.body.style[e] !== 'undefined') {
        this.xform = e;
        return false;
      }
      return true;
    });
    /* switch */
    this.doubleTrigger = false;
    this.initialSet = false;
    this.beforeChangeTrigger = false;
    this.scrollEnd = false;
    this.autoplayTimer = null;
    this.scrollType = {};
    this.scrollOptions = {};
    this.rerender = false;
    this.resizeHeight = false;
    this.endIndex = null;
    this.changeWindow = false;
    /* functionBind */
    this.scroll = this.scroll.bind(this);
    this.setRef = this.setRef.bind(this);
    this.slideInit = this.slideInit.bind(this);
    this.slickNext = this.slickNext.bind(this);
    this.slickPrev = this.slickPrev.bind(this);
    this.slickSet = this.slickSet.bind(this);
    this.cycleTo = this.cycleTo.bind(this);
    this.autoPlay = this.autoPlay.bind(this);

    this.handleCarouselTap = handleCarouselTap.bind(this);
    this.signupListener = signupListener.bind(this);
    this.removeListener = removeListener.bind(this);
    this.handleCarouselDrag = handleCarouselDrag.bind(this);
    this.handleCarouselRelease = handleCarouselRelease.bind(this);
    this.handleAutoplayPause = handleAutoplayPause.bind(this);
    this.handleResize = throttle(handleResize.bind(this), 1000, { leading: true });
    this.handleResizeHeight = throttle(handleResizeHeight.bind(this), 500);
    this.handleVisibilityChange = handleVisibilityChange.bind(this);
    this.handleKeyDown = handleKeyDown.bind(this);
    this.handleClick = handleClick.bind(this);
    this.handleWheel = handleWheel.bind(this);
  }

  componentDidMount() {
    this.isMounted = true;
    window.addEventListener('resize', this.handleResize);
    this.init();
    const { onInit } = this.props;
    if (onInit && typeof onInit === 'function') onInit(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.init();
    const { slidesPerRow, rows } = nextProps;
    const { settings: { slidesPerRow: originPerRow, rows: originRows } } = this.state;
    if (slidesPerRow !== originPerRow || rows !== originRows) {
      this.resizeHeight = false;
    }
    return isEqual(nextProps, this.props) || isEqual(nextState, this.state);
  }

  componentDidUpdate(prevProps) {
    const { SliderRef } = this.state;
    const newProps = { ...this.props, children: [] };
    const newPrevProps = { ...prevProps, children: [] };
    const { children } = this.props;
    if (!isEqual(newProps, newPrevProps) || prevProps.children.length !== children.length) {
      const { onReInit } = this.props;
      this.init();
      this.setRef(SliderRef);
      if (onReInit && typeof onReInit === 'function') onReInit(this);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.isMounted = false;
  }

  /**
   * settings init
   */
  init = () => {
    let { settings, width } = this.state;
    const { activeIndex } = this.state;
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
    const newWith = this.widthInit();
    if (width !== newWith) {
      width = newWith;
    }
    const newChildren = [];
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
          if (k < children.length) {
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
        }
        newSlide.push(<div className="carousel-row" key={10 * i + j}>{row}</div>);
      }
      newChildren.push(
        <div
          data-carouselkey={i}
          key={i}
          className="carousel-item"
          style={{ width: `${width}px`, display: 'none' }}
        >
          {newSlide}
        </div>
      );
    }
    if (this.newChildren.length !== newChildren.length) {
      this.rerender = true;
      this.newChildren = newChildren;
    } else {
      this.rerender = false;
      this.newChildren = newChildren;
      this.virtualList = newChildren;
    }
    if (
      settings.virtualList
      && this.items
      && this.items.length === this.newChildren.length
      && !this.rerender
    ) {
      if (this.endIndex === activeIndex) {
        this.endIndex = null;
      }
      this.virtualList = this.createVirtualList();
      this.forceUpdate(() => {
        if (!this.resizeHeight) {
          this.connectObserver();
        }
      });
    }
    if (!isEqual(get(this.state, 'settings'), settings) && this.isMounted) {
      this.setState({ settings });
    }
  };

  /**
   * Get slider reference
   */
  setRef = (element) => this.setState({ SliderRef: element }, () => {
    const slides = element.querySelectorAll('.carousel-item');
    const { settings: { virtualList } } = this.state;
    if (virtualList) {
      this.virtualList = this.newChildren;
      this.forceUpdate(() => {
        this.items = new CircularArray(element.querySelectorAll('.carousel-item'));
        this.virtualItem = null;
      });
    } else {
      this.items = new CircularArray(slides);
    }
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
   */
  autoPlay = () => {
    const {
      SliderRef,
      settings: {
        autoplay, autoplaySpeed, pauseOnHover
      }
    } = this.state;
    if (autoplay && autoplaySpeed > 0 && !this.autoplayTimer) {
      this.scrollType = {
        type: 'autoplay'
      };
      this.autoplayTimer = setInterval(() => {
        const { autoplayScroll } = this.props;
        const { activeIndex } = this.state;
        this.beforeChangeTrigger = false;
        this.slickNext(activeIndex + autoplayScroll);
      }, autoplaySpeed);
      window.addEventListener('visibilitychange', this.handleVisibilityChange);
      if (pauseOnHover) {
        SliderRef.addEventListener('mouseover', this.handleAutoplayPause);
        SliderRef.removeEventListener('mouseleave', this.autoPlay);
      } else {
        SliderRef.removeEventListener('mouseover', this.handleAutoplayPause);
        SliderRef.removeEventListener('mouseleave', this.autoPlay);
      }
    } else if (autoplay && autoplaySpeed && this.autoplayTimer) {
      this.autoPlayInit();
      if (!pauseOnHover) {
        SliderRef.removeEventListener('mouseover', this.handleAutoplayPause);
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
    const { settings } = this.state;
    if (settings.autoplay) {
      this.handleAutoplayPause();
      this.autoPlay();
    } else if (this.isMounted) {
      this.setState({
        settings: {
          ...settings,
          autoplay: true
        }
      }, () => {
        this.handleAutoplayPause();
        this.autoPlay();
      });
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
    } else {
      this.disconnectObserver();
      this.connectObserver();
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
  autoScroll = (type) => {
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
        this.scroll(type === 'start' ? type : 'auto', this.target - delta);
        requestAnimationFrame(this.autoScroll);
      } else if (this.changeWindow) {
        this.changeWindow = false;
        this.scroll('auto', this.target);
      } else {
        this.scroll('end', this.target);
      }
    }
  };

  getItem = (scrollItem, index) => {
    const { settings: { virtualList } } = this.state;
    let el;
    if (virtualList) {
      const keyIndex = scrollItem.getKeyIndex(index);
      if (keyIndex >= 0) {
        el = scrollItem.get(keyIndex);
      }
    } else {
      el = scrollItem.get(index);
    }
    return el;
  }

  /**
   * Scroll to target
   * @param {string} type
   * @param {Number} x
   */
  scroll = (type, x) => {
    const {
      SliderRef,
      width,
      settings,
      activeIndex
    } = this.state;
    const {
      centerMode,
      beforeChange,
      afterChange,
      slidesToShow,
      virtualList
    } = settings;
    // Start actual scroll
    let i;
    let el;
    let alignment = 'translateX(0px)';
    if (!x) {
      this.offset = width * activeIndex * 2;
    } else {
      this.offset = typeof x === 'number' ? x : this.offset;
    }
    this.center = Math.floor((this.offset + this.dim / 2) / this.dim);
    const delta = this.offset - this.center * this.dim;
    const dir = delta < 0 ? 1 : -1;
    const tween = (-dir * delta * 2) / this.dim;
    if (centerMode) {
      if (slidesToShow % 2 === 0) {
        alignment = `translateX(${width * (slidesToShow / 2)}px)`;
      } else {
        alignment = `translateX(${(SliderRef.clientWidth - width) / 2 - settings.centerPadding}px)`;
      }
    } else {
      alignment = 'translateX(0px)';
    }
    const { type: scrollType, direction } = this.scrollType;
    // Track scrolling state
    if (
      !SliderRef.classList.contains('scrolling')
      && scrollType !== 'arrows'
      && (type !== 'init' && type !== 'resize')) {
      this.swiping = true;
      SliderRef.classList.add('scrolling');
    }
    // center
    // Don't show wrapped items.
    const index = this.wrap(this.center);
    if (
      !this.beforeChangeTrigger
      && (type !== 'start' && type !== 'end' && type !== 'init')
    ) {
      this.beforeChangeTrigger = true;
      let newIndex;
      switch (scrollType) {
        case 'arrows': {
          const slides = settings.arrowsScroll;
          this.scrollDistance = slides;
          newIndex = this.items.getIndex(direction === 'prev' ? activeIndex - slides : activeIndex + slides);
          break;
        }
        case 'dots': {
          newIndex = this.scrollOptions.index * this.scrollOptions.dotsScroll;
          break;
        }
        case 'autoplay': {
          const slides = settings.autoplayScroll;
          this.scrollDistance = slides;
          newIndex = this.items.getIndex(activeIndex + slides);
          break;
        }
        case 'wheel': {
          const slides = settings.wheelScroll;
          this.scrollDistance = slides;
          newIndex = this.items.getIndex(direction === 'prev' ? activeIndex - slides : activeIndex + slides);
          break;
        }
        default: break;
      }
      this.endIndex = newIndex;
      if (beforeChange && typeof beforeChange === 'function') {
        beforeChange(activeIndex, newIndex);
      }
    }
    if (type !== 'end' && this.scrollEnd) this.scrollEnd = false;
    if (type === 'end') {
      if (afterChange && typeof afterChange === 'function' && !this.scrollEnd) {
        afterChange(this.wrap(this.center));
      }
      this.scrollEnd = true;
      SliderRef.classList.remove('scrolling');
      this.beforeChangeTrigger = false;
      this.swiping = false;
    } else if (this.scrollEnd) {
      this.scrollEnd(true);
    }

    this.virtualItem = this.virtualItem || new CircularArray(SliderRef.querySelectorAll('.carousel-item'), this.items);
    const scrollItem = virtualList ? this.virtualItem : this.items;
    if (scrollItem.length <= slidesToShow) {
      el = this.getItem(scrollItem, 0);
      if (el) {
        // Add active class to center item.
        if (el.classList.contains('active')) {
          each(SliderRef.querySelectorAll('.carousel-item'), (ele) => ele.classList.remove('active'));
          el.classList.add('active');
        }
        const transformString = `${alignment} translateX(0px)`;
        this.updateItemStyle(el, transformString);
      }
    } else if (!this.noWrap || (this.center >= 0 && this.center < scrollItem.length)) {
      el = this.getItem(scrollItem, index);
      if (el) {
        // Add active class to center item.
        if (el.classList.contains('active')) {
          each(SliderRef.querySelectorAll('.carousel-item'), (ele) => ele.classList.remove('active'));
          el.classList.add('active');
        }
        const transformString = `${alignment} translateX(${-delta / 2}px) translateX(${dir * settings.shift * tween * i}px)`;
        this.updateItemStyle(el, transformString);
      }
    }
    if (centerMode) {
      const half = Math.floor(scrollItem.length / 2);
      for (i = 1; i <= half; i += 1) {
        // right side
        // Don't show wrapped items.
        if (!this.noWrap || this.center + i < scrollItem.length) {
          el = this.getItem(scrollItem, this.wrap(this.center + i));
          if (el) {
            const transformString = `${alignment} translateX(${settings.shift + (this.dim * i - delta) / 2}px)`;
            this.updateItemStyle(el, transformString);
          }
        }

        // left side
        // Don't show wrapped items.
        if (!this.noWrap || this.center - i >= 0) {
          el = this.getItem(scrollItem, this.wrap(this.center - i));
          if (el) {
            const transformString = `${alignment} translateX(${-settings.shift + (-this.dim * i - delta) / 2}px)`;
            this.updateItemStyle(el, transformString);
          }
        }
      }
    } else if (scrollItem.length <= slidesToShow) {
      for (i = 1; i < scrollItem.length; i += 1) {
        el = this.getItem(scrollItem, i);
        if (el) {
          const transformString = `${alignment} translateX(${settings.shift + (this.dim * i - delta) / 2}px)`;
          this.updateItemStyle(el, transformString);
        }
      }
    } else {
      for (i = 1; i < slidesToShow; i += 1) {
        el = this.getItem(scrollItem, this.wrap(this.center + i));
        if (el) {
          const transformString = `${alignment} translateX(${settings.shift + (this.dim * i - delta) / 2}px)`;
          this.updateItemStyle(el, transformString);
        }
      }

      const half = Math.ceil((scrollItem.length - slidesToShow) / 2);
      for (i = 0; i < half; i += 1) {
        // right side
        if (!this.noWrap || this.center + slidesToShow + i < scrollItem.length) {
          el = this.getItem(scrollItem, this.wrap(this.center + slidesToShow + i));
          if (el) {
            const transformString = `${alignment} translateX(${settings.shift + (this.dim * (slidesToShow + i) - delta) / 2}px)`;
            this.updateItemStyle(el, transformString);
          }
        }
        // left side
        if (!this.noWrap || this.center + slidesToShow + i < scrollItem.length) {
          el = this.getItem(scrollItem, this.wrap(this.center - i - 1));
          if (el) {
            const transformString = `${alignment} translateX(${-settings.shift + (-this.dim * (i + 1) - delta) / 2}px)`;
            this.updateItemStyle(el, transformString);
          }
        }
      }
    }

    // center
    // Don't show wrapped items.
    if ((!this.noWrap || (this.center < this.items.length)) && slidesToShow < scrollItem.length) {
      el = this.getItem(scrollItem, this.center);
      if (el) {
        if (!el.classList.contains('active')) {
          each(SliderRef.querySelectorAll('.carousel-item'), (ele) => ele.classList.remove('active'));
          el.classList.add('active');
          const newActiveIndex = this.wrap(this.center);
          if (this.beforeChangeTrigger && this.isMounted) {
            this.setState({ activeIndex: newActiveIndex }, () => { this.virtualItem = null; });
          }
        }
        const transformString = `${alignment} translateX(${-delta / 2}px) translateX(${dir * settings.shift * tween}px)`;
        this.updateItemStyle(el, transformString);
      }
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
    newEl.style.display = '';
  };

  widthInit = () => {
    const { settings, SliderRef } = this.state;
    const {
      centerMode,
      centerPadding,
      slidesToShow
    } = settings;
    if (SliderRef) {
      let padding = 0;
      if (typeof centerPadding === 'string') {
        [padding] = centerPadding.match(/\d+/g);
      } else if (typeof centerPadding === 'number') {
        padding = centerPadding;
      } else {
        padding = 50;
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
      return width;
    }
    return 0;
  }

  /**
   * Carousel first initional
   */
  slideInit = () => {
    const { SliderRef, settings: { initialSlide } } = this.state;
    if (SliderRef && this.isMounted) {
      const width = this.widthInit();
      this.setState({ width }, () => {
        this.dim = width * 2;
        // this.settings.gutter = padding;
        this.scroll('init');
        if (initialSlide) {
          if (typeof initialSlide === 'number') {
            if (initialSlide > 0 && !this.initialSet) {
              this.slickSet(initialSlide);
              this.initialSet = true;
            }
          } else {
            this.slickSet(0);
            this.initialSet = false;
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
      if (height !== offsetHeight && offsetHeight > 0 && this.isMounted) {
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
  wrap = (x) => this.items.getIndex(x);

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
      requestAnimationFrame(() => {
        this.autoScroll('start');
      });
    }
  };

  /**
   * Cycle to next item
   * @param {Number} n
   */
  slickNext = (n) => {
    if (this.scrollType.type === 'arrows') {
      this.doubleTrigger = true;
    }
    if (typeof n === 'number') {
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
    if (this.scrollType.type === 'arrows') {
      this.doubleTrigger = true;
    }
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

  createVirtualList = () => {
    const {
      settings: {
        slidesToShow,
        overScan
      },
      activeIndex
    } = this.state;
    if (this.virtualList.length > (((slidesToShow + overScan) * 2) + 1)) {
      const result = [];
      const getIndex = [];
      let newActiveIndex = activeIndex;
      const { type, direction } = this.scrollType;
      switch (type) {
        case 'scroll': {
          if (direction === 'left') newActiveIndex += 1;
          else newActiveIndex -= 1;
          break;
        }
        case 'arrows': {
          if (direction === 'next') newActiveIndex += 1;
          else newActiveIndex -= 1;
          break;
        }
        case 'dots': {
          if (direction === 'right') newActiveIndex += 1;
          else newActiveIndex -= 1;
          break;
        }
        case 'wheel': {
          if (direction === 'next') newActiveIndex += 1;
          else newActiveIndex -= 1;
          break;
        }
        case 'autoplay': {
          newActiveIndex += 1;
          break;
        }
        default:
          break;
      }
      let i = 0;
      for (; i < slidesToShow + overScan; i += 1) {
        if (i === 0) {
          const index = this.items.getIndex(newActiveIndex);
          getIndex.push(index);
        } else {
          const rightIndex = this.items.getIndex(newActiveIndex + i);
          const leftIndex = this.items.getIndex(newActiveIndex - i);
          getIndex.push(rightIndex);
          getIndex.unshift(leftIndex);
        }
      }
      if (this.endIndex >= 0 && typeof this.endIndex === 'number') {
        let buffer = 0;
        if (
          activeIndex + this.endIndex < this.newChildren.length + this.scrollDistance
          && activeIndex + this.endIndex >= this.newChildren.length - this.scrollDistance
          && (activeIndex >= this.newChildren.length - this.scrollDistance
          || this.endIndex >= this.newChildren.length - this.scrollDistance)
        ) {
          if (this.endIndex + activeIndex < this.newChildren.length) {
            if (this.endIndex < activeIndex) {
              buffer = this.newChildren.length - activeIndex + this.endIndex;
            } else {
              buffer = this.newChildren.length - this.endIndex + activeIndex;
            }
          } else if (this.endIndex < activeIndex) {
            buffer = (this.newChildren.length + this.scrollDistance) - activeIndex + this.endIndex;
          } else {
            buffer = (this.newChildren.length + this.scrollDistance) - this.endIndex + activeIndex;
          }
        } else {
          buffer = this.endIndex < activeIndex
            ? activeIndex - this.endIndex
            : this.endIndex - activeIndex;
        }
        for (let j = 0; j < buffer; j += 1) {
          const rightIndex = this.items.getIndex(newActiveIndex + i + j);
          const leftIndex = this.items.getIndex(newActiveIndex - i - j);
          switch (type) {
            case 'arrows': {
              if (direction === 'next') getIndex.push(rightIndex);
              else getIndex.unshift(leftIndex);
              break;
            }
            case 'dots': {
              if (direction === 'right') getIndex.push(rightIndex);
              else getIndex.unshift(leftIndex);
              break;
            }
            case 'wheel': {
              if (direction === 'next') getIndex.push(rightIndex);
              else getIndex.unshift(leftIndex);
              break;
            }
            case 'autoplay': {
              getIndex.push(rightIndex);
              break;
            }
            default:
              break;
          }
        }
      }
      getIndex.sort((a, b) => a - b);
      for (i = 0; i < getIndex.length; i += 1) {
        const childrenIndex = getIndex[i];
        const children = this.newChildren[childrenIndex];
        result.push(children);
      }
      return result;
    }
    return this.virtualList;
  }

  render() {
    const { height, settings, activeIndex } = this.state;
    const spec = { ...settings, ...this.prop };
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
            this.scrollType = {
              type: 'arrows',
              direction: 'prev'
            };
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
            this.scrollType = {
              type: 'arrows',
              direction: 'next'
            };
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
            let right = 0;
            let left = 0;
            let direction = null;
            if (activeIndex > options.index) {
              right = this.newChildren.length - activeIndex + options.index;
              left = activeIndex - options.index;
              direction = right < left ? 'right' : 'left';
            } else {
              right = options.index - activeIndex;
              left = this.newChildren.length - options.index + activeIndex;
              direction = right <= left ? 'right' : 'left';
            }
            this.scrollType = {
              type: 'dots',
              direction
            };
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
            if (!SliderRef && this.isMounted) {
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
            {this.rerender ? this.newChildren : this.virtualList}
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
