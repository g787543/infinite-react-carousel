/* eslint-disable */
import React, { Component } from 'react';
import map from 'lodash/map';
import Carousel from '../src';
import { delay } from './test-helper';

const CustomArrow = (props) => (
  <div className="CustomArrow">
    <div
      className={`${props.className} ${props.customClassName}`}
      style={{
        ...props.customStyle,
        ...props.style,
        display: 'block',
      }}
      onClick={props.onClick}
      role="presentation"
    />
  </div>
);

class SliderWithScroll extends Component {
  constructor(props) {
    super(props);
    this.innerSlider = null;
  }

  testForScroll = async (befroeScroll, afterScroll, time = 200) => {
    befroeScroll();
    await delay(time);
    afterScroll();
  }

  render() {
    return (
      <Carousel
        ref={(ele) => {
          if (ele) {
            this.innerSlider = ele;
          }
        }}
        {...this.props}
      >
        <div>
          <h3>slide1</h3>
        </div>
        <div>
          <h3>slide2</h3>
        </div>
        <div>
          <h3>slide3</h3>
        </div>
        <div>
          <h3>slide4</h3>
        </div>
        <div>
          <h3>slide5</h3>
          <h3>slide5</h3>
          <h3>slide5</h3>
        </div>
        <div>
          <h3>slide6</h3>
        </div>
      </Carousel>
    );
  }
}

class SliderWithVirtualList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: null,
      nextSlide: null,
      endSlide: null,
    }
    this.data = new Array(1000);
    this.innerSlider = null;
  }

  getBeforeState = () => ({
    currentSlide: this.state.currentSlide,
    nextSlide: this.state.nextSlide
  });

  beforeChange = (currentSlide, nextSlide) => {
    this.setState({
      currentSlide,
      nextSlide
    });
  }

  afterChange = (endSlide) => {
    this.setState({
      endSlide
    });
  }


  testForScroll = async (befroeScroll, afterScroll, time = 200) => {
    befroeScroll();
    await delay(time);
    afterScroll();
  }

  render() {
    const { data } = this.state;
    return (
      <Carousel
        ref={(ele) => {
          if (ele) {
            this.innerSlider = ele;
          }
        }}
        {...this.props}
        beforeChange={this.beforeChange}
        afterChange={this.afterChange}
      >
        {map(this.data,(item, index) => (
          <div key={index}>
            <h3>slide{index + 1}</h3>
          </div>
        ))}
      </Carousel>
    );
  }
}

class SliderWithBeforeChange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: null,
      nextSlide: null,
      endSlide: null
    };
    this.innerSlider = null;
  }

  getBeforeState = () => ({
    currentSlide: this.state.currentSlide,
    nextSlide: this.state.nextSlide
  });

  beforeChange = (currentSlide, nextSlide) => {
    this.setState({
      currentSlide,
      nextSlide
    });
  }

  afterChange = (endSlide) => {
    this.setState({
      endSlide
    });
  }

  testForScroll = async (befroeScroll, afterScroll, time) => {
    befroeScroll();
    await delay(time ? time : 200);
    afterScroll();
  }

  render() {
    return (
      <Carousel
        ref={(ele) => {
          if (ele) {
            this.innerSlider = ele;
          }
        }}
        {...this.props}
        beforeChange={this.beforeChange}
        afterChange={this.afterChange}
      >
        <div>slide1</div>
        <div>slide2</div>
        <div>slide3</div>
        <div>slide4</div>
        <div>slide5</div>
        <div>slide6</div>
      </Carousel>
    );
  }
}

export {
  CustomArrow,
  SliderWithScroll,
  SliderWithBeforeChange,
  SliderWithVirtualList
};
