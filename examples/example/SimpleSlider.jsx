import React from 'react';
import Carousel from '../../src/index';

const SimpleSlider = () => {
  const settings = {
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div>
      <h2> Single Item</h2>
      <Carousel {...settings}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
      </Carousel>
    </div>
  );
};

export default SimpleSlider;
