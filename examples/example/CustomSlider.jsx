import React, { Component } from 'react';
import {
  Row,
  Col,
  Switch,
  Slider,
  InputNumber,
  Collapse,
  List,
  Typography,
  Input,
} from 'antd';
import PropTypes from 'prop-types';
import Highlight from 'react-highlight';
import map from 'lodash/map';
import get from 'lodash/get';
import transform from 'lodash/transform';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import Carousel from '../../src';
import { defaultProps } from '../../src/carousel/types';
import 'antd/dist/antd.css';

function changes(object, base) {
  return transform(object, (result, value, key) => {
    if (!isEqual(value, base[key])) {
      result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
    }
  });
}

function difference(object, base) {
  return changes(object, base);
}

const CustomSlide = ({ value, onChange, ...options }) => (
  <Row>
    <Col span={14}>
      <Slider
        {...options}
        value={value}
        onChange={onChange}
      />
    </Col>
    <Col span={9} offset={1}>
      <InputNumber
        {...options}
        style={{
          marginLeft: 16,
          width: '100%'
        }}
        value={value}
        onChange={onChange}
      />
    </Col>
  </Row>
);
const CustomSwitch = ({ value, onChange, ...options }) => (
  <Switch
    {...options}
    checked={value}
    onChange={onChange}
  />
);
const CustomInput = ({ value, onChange, ...options }) => (
  <Input
    {...options}
    value={value}
    onChange={(e) => onChange(e.currentTarget.value)}
  />
);
const customPropTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.object,
    step: PropTypes.number
  })
};
const customDefaultProps = {
  value: null,
  onChange: () => {},
  options: {}
};
CustomSwitch.propTypes = customPropTypes;
CustomSwitch.defaultProps = customDefaultProps;
CustomSlide.propTypes = customPropTypes;
CustomSlide.defaultProps = customDefaultProps;
CustomInput.propTypes = customPropTypes;
CustomInput.defaultProps = customDefaultProps;

class CustomSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boxCount: new Array(10),
      ...defaultProps
    };
    this.datas = [{
      name: 'Slider',
      component: [{
        name: 'rows',
        component: {
          name: 'slider',
          step: 1,
          min: 1,
          max: 5,
        },
      }, {
        name: 'slidesPerRow',
        component: {
          name: 'slider',
          step: 1,
          min: 1,
          max: 5,
        },
      }, {
        name: 'slidesToShow',
        component: {
          name: 'slider',
          step: 1,
          min: 1,
          max: 20
        }
      }, {
        name: 'gutter',
        component: {
          name: 'slider',
          step: 10,
          min: 0,
          max: 100
        }
      }]
    }, {
      name: 'Basic',
      component: [{
        name: 'className',
        component: 'input'
      }, {
        name: 'centerMode',
        component: 'switch'
      }, {
        name: 'swipe',
        component: 'switch'
      }, {
        name: 'adaptiveHeight',
        component: 'switch',
      }, {
        name: 'centerPadding',
        component: {
          name: 'slider',
          step: 10,
          min: 10,
          max: 200
        }
      }, {
        name: 'initialSlide',
        component: {
          name: ['switch', 'slider'],
          min: 0,
          max: 10
        }
      }, {
        name: 'accessibility',
        component: 'switch'
      }]
    }, {
      name: 'Arrows',
      component: [{
        name: 'arrows',
        component: 'switch'
      }, {
        name: 'arrowsBlock',
        component: 'switch'
      }, {
        name: 'arrowsScroll',
        component: {
          name: 'slider',
          min: 1,
          max: 10,
        }
      }]
    }, {
      name: 'Animation',
      component: [{
        name: 'duration',
        component: {
          name: 'slider',
          step: 100,
          min: 100,
          max: 500
        }
      }, {
        name: 'shift',
        component: {
          name: 'slider',
          step: 10,
          min: 0,
          max: 100
        }
      }]
    }, {
      name: 'Dots',
      component: [{
        name: 'dots',
        component: 'switch'
      }, {
        name: 'dotsScroll',
        component: {
          name: 'slider',
          step: 1,
          min: 1,
          max: 10
        }
      }]
    }, {
      name: 'AutoPlay',
      component: [{
        name: 'pauseOnHover',
        component: 'switch',
      }, {
        name: 'autoplay',
        component: 'switch',
        onChange: (checked) => {
          if (checked) {
            this.sliderRef.slickPlay();
          } else {
            this.sliderRef.slickPause();
          }
        }
      }, {
        name: 'autoplayScroll',
        component: {
          name: 'slider',
          step: 1,
          min: 1,
          max: 6
        },
      }, {
        name: 'autoplaySpeed',
        component: {
          name: 'slider',
          step: 1000,
          min: 1000,
          max: 10000
        },
        onChange: () => this.sliderRef.slickPlay()
      }]
    }, {
      name: 'Wheel',
      component: [{
        name: 'wheel',
        component: 'switch'
      }, {
        name: 'wheelScroll',
        component: {
          name: 'slider',
          step: 1,
          min: 1,
          max: 6
        }
      }]
    }, {
      name: 'VirtualList',
      component: [{
        name: 'virtualList',
        component: 'switch'
      }, {
        name: 'overScan',
        component: {
          name: 'slider',
          step: 1,
          min: 1,
          max: 5,
        }
      }]
    }];
    this.component = {
      slider: CustomSlide,
      switch: CustomSwitch,
      input: CustomInput
    };
    this.deleteValue = ['name'];
    this.sliderRef = null;
  }

  getCustomComponent = (key) => {
    if (typeof key === 'object' && Array.isArray(key)) {
      return map(key, (k) => get(this.component, k));
    }
    return [get(this.component, key)];
  };

  getOptions = (options) => {
    const newOptions = { ...options };
    this.deleteValue.forEach((value) => {
      delete newOptions[value];
    });
    return newOptions;
  };

  createComponent = ({ name, component, onChange }) => {
    const componentName = component.name || component;
    const CustomComponent = this.getCustomComponent(componentName);
    const customOptions = this.getOptions(component);
    return (
      <Row style={{ width: '100%' }}>
        <Col span={24}>
          <Typography.Title
            level={4}
            style={{
              background: 'none',
              margin: 0,
              textAlign: 'left'
            }}
          >
            {name}
          </Typography.Title>
        </Col>
        <Col offset={1} span={22}>
          {
            map(CustomComponent, (CComponent) => (
              <CComponent
                {...customOptions}
                value={get(this.state, name)}
                onChange={(value) => {
                  const newState = { ...this.state };
                  newState[name] = value;
                  this.setState(newState, () => {
                    if (typeof onChange === 'function' && onChange) {
                      onChange(value);
                    }
                  });
                }}
              />
            ))
          }
        </Col>
      </Row>
    );
  };

  format = (options) => map(options || this.datas, (data, index) => {
    let result = null;
    const { name, component } = data;
    if (typeof component === 'object' && Array.isArray(component)) {
      result = (
        <Collapse.Panel header={name} key={index + 1}>
          <List
            itemLayout="horizontal"
            dataSource={component}
            renderItem={(item) => (
              <List.Item>
                {this.createComponent(item)}
              </List.Item>
            )}
          />
        </Collapse.Panel>
      );
    } else {
      result = this.createComponent(data);
    }
    return result;
  });

  render() {
    const { boxCount } = this.state;
    const newObject = { ...this.state };
    delete newObject.boxCount;
    const diff = difference(newObject, defaultProps);
    const diffArray = [];
    Object.keys(diff).sort().forEach((key) => diffArray.push({ key, value: diff[key] }));
    return (
      <Row>
        <Col span={8}>
          <Collapse accordion>
            <Collapse.Panel header="boxCount" key={0}>
              <Row style={{ width: '100%' }}>
                <Col span={24}>
                  <Typography.Title
                    level={4}
                    style={{
                      background: 'none',
                      margin: 0,
                      textAlign: 'left'
                    }}
                  >
                    boxCount
                  </Typography.Title>
                </Col>
                <Col offset={1} span={22}>
                  <CustomSlide
                    min={1}
                    max={100}
                    value={boxCount.length}
                    onChange={(value) => this.setState({ boxCount: new Array(value) })}
                  />
                </Col>
              </Row>
            </Collapse.Panel>
            {this.format()}
          </Collapse>
        </Col>
        <Col span={15} offset={1}>
          <Carousel
            {...this.state}
            ref={(ele) => { this.sliderRef = ele; window.sliderRef = ele; }}
          >
            {
              map(boxCount, ((value, index) => (
                <div key={`${new Date().getTime() * index}`}>
                  {
                    index === 3 ? (
                      <div>
                        <h3>{index + 1}</h3>
                        <h3>{index + 1}</h3>
                        <h3>{index + 1}</h3>
                      </div>
                    ) : (
                      <h3>{index + 1}</h3>
                    )
                  }
                </div>
              )))
            }
          </Carousel>
          <Col span={24}>
            <Highlight languages={['javascript']}>
              {`import React, { Component } from 'react';
import Slider from 'infinite-react-carousel';

export default className CustomSlider extends Component {
  render() {
    const settings =  {
      ${map(diffArray, (diffItem) => {
        const { key, value } = diffItem;
        if (typeof value === 'string') {
          return `${key}: '${value}'`;
        }
        return `${key}: ${value}`;
      }).join(',\r      ')}
    };
    return (
      <div>
        <span>CustomSlider</span>
        <Slider { ...settings }>
          ${map(boxCount, (value, index) => (`<div>
            <h3>${index + 1}</h3>
          </div>`)).join('\r          ')}
        </Slider>
      </div>
    );
  }
}`}
            </Highlight>
          </Col>
        </Col>
      </Row>
    );
  }
}

export default CustomSlider;
