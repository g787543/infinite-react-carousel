import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import SimpleSlider from './example/SimpleSlider';

ReactDOM.render(
  <div>
    <SimpleSlider />
  </div>, document.getElementById('root')
);
