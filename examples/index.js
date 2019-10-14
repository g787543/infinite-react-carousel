import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import SimpleSlider from './example/SimpleSlider';
import CustomSlider from './example/CustomSlider';

ReactDOM.render(
  <div>
    <SimpleSlider />
    <CustomSlider />
  </div>, document.getElementById('root')
);
