import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Collapse } from 'antd';
import './index.css';

import SimpleSlider from './example/SimpleSlider';
import CustomSlider from './example/CustomSlider';

ReactDOM.render(
  <div>
    <Collapse defaultActiveKey={['1']} accordion>
      <Collapse.Panel header="SimpleSLider" key="1">
        <SimpleSlider />
      </Collapse.Panel>
      <Collapse.Panel header="CustomSlider" key="2">
        <CustomSlider />
      </Collapse.Panel>
    </Collapse>
  </div>, document.getElementById('root')
);
