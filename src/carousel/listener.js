import { getSwipeDirection, keyHandler } from './utils';

/**
 * Handle Carousel Tap
 * @param {Event} e
 */
export function handleCarouselTap(e) {
  // Fixes firefox draggable image bug
  if (e.type === 'mousedown' && e.target.tagName === 'IMG') {
    e.preventDefault();
  }
  this.pressed = true;
  this.dragged = false;
  this.verticalDragged = false;
  this.reference = this.xpos(e);
  this.referenceY = this.ypos(e);
  this.touchObject = Object.assign(this.touchObject, {
    startX: this.reference,
    startY: this.referenceY
  });
  this.velocity = 0;
  this.amplitude = 0;
  this.frame = this.offset;
  this.timestamp = Date.now();
  clearInterval(this.ticker);
  this.ticker = setInterval(this.track, 100);
}

/**
 * Handle Carousel Drag
 * @param {Event} e
 */
export function handleCarouselDrag(e) {
  if (this.pressed) {
    const x = this.xpos(e);
    const y = this.ypos(e);
    const delta = this.reference - x;
    const deltaY = Math.abs(this.referenceY - y);
    const direction = getSwipeDirection(Object.assign(this.touchObject, {
      endX: x,
      endY: y
    }));
    this.scrollType = {
      type: 'scroll',
      direction
    };
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
}

/**
   * Handle Carousel Release
   * @param {Event} e
   */
export function handleCarouselRelease(e) {
  if (this.pressed) {
    this.pressed = false;
  } else {
    return;
  }
  this.beforeChangeTrigger = false;
  const { onSwipe } = this.props;
  onSwipe(this.scrollType.direction);
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
}

/**
 * Handle window resize will change items Height
 */
export function handleResizeHeight(mutations) {
  const { height } = this.state;
  const mutation = mutations[mutations.length - 1];
  const { offsetHeight } = mutation.target;
  if (height !== offsetHeight && offsetHeight > 0 && this.isMounted) {
    this.setState({ height: offsetHeight }, () => {
      this.resizeHeight = true;
    });
  }
}

/**
 * Handle carousel click
 */
export function handleClick() {
  this.disconnectObserver();
}

/**
 * Handle autoplay hover to pause
 * @param {Object} options
 * @param {Number} options.autoplaySpeed
 */
export function handleAutoplayPause() {
  const { SliderRef } = this.state;
  if (this.autoplayTimer) {
    clearInterval(this.autoplayTimer);
    this.autoplayTimer = null;
    SliderRef.removeEventListener('mouseover', this.handleAutoplayPause);
    SliderRef.addEventListener('mouseleave', this.autoPlay);
  }
}

export function handleKeyDown(e) {
  const {
    settings: {
      rtl,
      accessibility
    }
  } = this.state;
  const dir = keyHandler(e, accessibility, rtl);
  if (dir === 'previous') {
    this.slickPrev();
  } else if (dir === 'next') {
    this.slickNext();
  }
}

/**
 * Handle Throttle Resize
 * @param {Event} e
 */
export function handleResize(e) {
  this.slideInit();
  this.connectObserver();
  const { settings } = this.state;
  const { onResize } = settings;
  if (settings.fullWidth) {
    const { width } = this.state;
    this.dim = width * 2 + settings.gutter;
    this.offset = this.center * 2 * width;
    this.target = this.offset;
  } else {
    this.scroll('resize');
  }
  onResize(e);
}

export function handleWheel(e) {
  e.stopPropagation();
  e.preventDefault();
  this.beforeChangeTrigger = false;
  const {
    settings: { wheelScroll },
    activeIndex
  } = this.state;
  const { deltaY } = e;
  if (deltaY > 0) {
    this.scrollType = {
      type: 'wheel',
      direction: 'next'
    };
    this.slickNext(activeIndex + wheelScroll);
  } else if (deltaY < 0) {
    this.scrollType = {
      type: 'wheel',
      direction: 'prev'
    };
    this.slickPrev(activeIndex - wheelScroll);
  }
}

export function handleVisibilityChange() {
  this.changeWindow = typeof document !== 'undefined' && document.visibilityState === 'visible';
}

export function signupListener() {
  const { settings, SliderRef } = this.state;
  const { swipe, accessibility, wheel } = settings;
  if (swipe) {
    SliderRef.addEventListener('touchstart', this.handleCarouselTap);
    SliderRef.addEventListener('touchmove', this.handleCarouselDrag);
    SliderRef.addEventListener('touchend', this.handleCarouselRelease);
  } else {
    SliderRef.removeEventListener('touchstart', this.handleCarouselTap);
    SliderRef.removeEventListener('touchmove', this.handleCarouselDrag);
    SliderRef.removeEventListener('touchend', this.handleCarouselRelease);
  }
  if (accessibility) {
    SliderRef.addEventListener('keydown', this.handleKeyDown);
  } else {
    SliderRef.removeEventListener('keydown', this.handleKeyDown);
  }
  if (wheel) {
    SliderRef.addEventListener('wheel', this.handleWheel);
  } else {
    SliderRef.removeEventListener('wheel', this.handleWheel);
  }
  SliderRef.addEventListener('mousedown', this.handleCarouselTap);
  SliderRef.addEventListener('mousemove', this.handleCarouselDrag);
  SliderRef.addEventListener('mouseup', this.handleCarouselRelease);
  SliderRef.addEventListener('mouseleave', this.handleCarouselRelease);
}

export function removeListener() {
  const { settings, SliderRef } = this.state;
  const {
    swipe,
    accessibility,
    wheel,
    autoplay
  } = settings;
  if (swipe) {
    SliderRef.removeEventListener('touchstart', this.handleCarouselTap);
    SliderRef.removeEventListener('touchmove', this.handleCarouselDrag);
    SliderRef.removeEventListener('touchend', this.handleCarouselRelease);
  }
  if (accessibility) {
    SliderRef.removeEventListener('keydown', this.handleKeyDown);
  }
  if (wheel) {
    SliderRef.removeEventListener('wheel', this.handleWheel);
  }
  if (autoplay) {
    window.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
  SliderRef.removeEventListener('mousedown', this.handleCarouselTap);
  SliderRef.removeEventListener('mousemove', this.handleCarouselDrag);
  SliderRef.removeEventListener('mouseup', this.handleCarouselRelease);
  SliderRef.removeEventListener('mouseleave', this.handleCarouselRelease);
}
