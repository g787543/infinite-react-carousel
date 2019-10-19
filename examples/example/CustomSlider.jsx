import React, { Component } from 'react';
import {
  Row,
  Col,
  Switch,
  Slider,
  InputNumber,
  Collapse,
  List,
  Typography
} from 'antd';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import get from 'lodash/get';
import Carousel from '../../src';
import 'antd/dist/antd.css';

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
CustomSlide.propTypes = customPropTypes;
CustomSwitch.propTypes = customPropTypes;
CustomSwitch.defaultProps = customDefaultProps;
CustomSlide.defaultProps = customDefaultProps;

class CustomSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
      boxCount: new Array(10),
      autoplaySpeed: 3000,
      autoplay: false,
      centerPadding: 50,
      arrows: true,
      dotsScroll: 1,
      duration: 200,
      shift: 0,
      pauseOnHover: true,
      rows: 1,
      slidesPerRow: 1,
      arrowsBlock: true
    };
    this.datas = [{
      name: 'Slider-Group',
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
        name: 'slidesToScroll',
        component: {
          name: 'slider',
          step: 1,
          min: 1,
          max: 20
        }
      }]
    }, {
      name: 'Basic',
      component: [{
        name: 'arrows',
        component: 'switch'
      }, {
        name: 'arrowsBlock',
        component: 'switch'
      }, {
        name: 'centerMode',
        component: 'switch'
      }, {
        name: 'centerPadding',
        component: {
          name: 'slider',
          step: 10,
          min: 10,
          max: 200
        }
      }, {
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
      name: 'dots-Group',
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
      name: 'AutoPlay-Group',
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
        name: 'autoplaySpeed',
        component: {
          name: 'slider',
          step: 1000,
          min: 1000,
          max: 10000
        },
        onChange: () => this.sliderRef.autoplayInit()
      }]
    }];
    this.component = {
      slider: CustomSlide,
      switch: CustomSwitch
    };
    this.deleteValue = ['name'];
    this.sliderRef = null;
  }

  getCustomComponent = (key) => get(this.component, key);

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
          <CustomComponent
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
        </Col>
      </Row>
    );
  };

  format = (options) => map(options || this.datas, (data) => {
    let result = null;
    const { name, component } = data;
    if (typeof component === 'object' && Array.isArray(component)) {
      result = (
        <Collapse.Panel header={name}>
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
    return (
      <Row>
        <Col span={8}>
          <Collapse accordion>
            <Collapse.Panel header="boxCount">
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
          <Carousel {...this.state} ref={(ele) => { this.sliderRef = ele; }}>
            {
              map(boxCount, ((value, index) => (
                <div key={`${new Date().getTime() * index}`}>
                  <h3>{index + 1}</h3>
                </div>
              )))
            }
          </Carousel>
        </Col>
      </Row>
    );
  }
}

export default CustomSlider;
