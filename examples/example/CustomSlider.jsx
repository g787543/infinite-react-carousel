import React, { Component, Fragment } from 'react';
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
      boxCount: new Array(10),
      ...defaultProps
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
    Object.keys(diff).map((key) => diffArray.push({ key, value: diff[key] }));
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
          <Carousel {...this.state} ref={(ele) => { this.sliderRef = ele; }}>
            {
              map(boxCount, ((value, index) => (
                <div key={`${new Date().getTime() * index}`}>
                  <h3>{index + 1}</h3>
                </div>
              )))
            }
          </Carousel>
          <Col span={24}>
            <pre>
              <code className="hljs javascript">
                <span className="hljs-keyword">import</span>
                &nbsp;React,&nbsp;
                {`${'{'}`}
                &nbsp;Component&nbsp;
                {`${'}'}`}
                <span className="hljs-keyword">&nbsp;from&nbsp;</span>
                <span className="hljs-string">&apos;react&apos;</span>
                ;
                <br />
                <span className="hljs-keyword">import</span>
                &nbsp;Slider&nbsp;
                <span className="hljs-keyword">from&nbsp;</span>
                <span className="hljs-string">&apos;infinite-react-carousel&apos;</span>
                ;
                <br />
                <br />
                <span className="hljs-keyword">export</span>
                &nbsp;
                <span className="hljs-keyword">default</span>
                &nbsp;
                <span className="hljs-className">
                  <span className="hljs-keyword">className</span>
                  &nbsp;
                  <span className="hljs-title">CustomSlider</span>
                  &nbsp;
                  <span className="hljs-keyword">extends</span>
                  &nbsp;
                  <span className="hljs-title">Component</span>
                  &nbsp;
                </span>
                {`${'{'}`}
                <br />
                &nbsp;&nbsp;render()&nbsp;
                {`${'{'}`}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span className="hljs-keyword">const</span>
                &nbsp;settings =
                  &nbsp;
                {`${'{'}`}
                <br />
                {
                  map(diffArray, (diffItem, index) => {
                    const { key, value } = diffItem;
                    const className = (type) => {
                      let result = null;
                      switch (type) {
                      case 'boolean': {
                        result = 'literal';
                        break;
                      }
                      case 'number': {
                        result = 'number';
                        break;
                      }
                      default: {
                        result = 'string';
                        break;
                      }
                      }
                      return result;
                    };
                    return (
                      <Fragment>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span className="hljs-attr">{key}</span>
                        :
                        &nbsp;
                        <span className={`hljs-${className(typeof value)}`}>{value.toString()}</span>
                        {index !== diffArray.length - 1 ? ',' : '' }
                        <br />
                      </Fragment>
                    );
                  })
                }
                &nbsp;&nbsp;&nbsp;&nbsp;
                {`${'}'}`}
                ;
                <br />
                <span className="hljs-keyword">&nbsp;&nbsp;&nbsp;&nbsp;return</span>
                (
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="hljs-tag">
                  &lt;
                  <span className="hljs-name">div</span>
                  &gt;
                </span>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="hljs-tag">
                  &lt;
                  <span className="hljs-name">span</span>
                  &gt;
                </span>
                CustomSlider
                <span className="hljs-tag">
                  &lt;
                  <span className="hljs-name">/span</span>
                  &gt;
                </span>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="hljs-tag">
                  &lt;
                  <span className="hljs-name">Slider</span>
                  &nbsp;
                  {`${'{'}`}
                  &nbsp;...settings&nbsp;
                  {`${'}'}`}
                  &gt;
                </span>
                {
                  map(boxCount, (value, index) => (
                    <Fragment>
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span className="hljs-tag">
                        &lt;
                        <span className="hljs-name">div</span>
                        &gt;
                      </span>
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span className="hljs-tag">
                        &lt;
                        <span className="hljs-name">h3</span>
                        &gt;
                      </span>
                      {index + 1}
                      <span className="hljs-tag">
                        &lt;
                        <span className="hljs-name">/h3</span>
                        &gt;
                      </span>
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span className="hljs-tag">
                        &lt;
                        <span className="hljs-name">/div</span>
                        &gt;
                      </span>
                    </Fragment>
                  ))
                }
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="hljs-tag">
                  &lt;
                  <span className="hljs-name">/Slider</span>
                  &gt;
                </span>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="hljs-tag">
                  &lt;
                  <span className="hljs-name">/div</span>
                  &gt;
                </span>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;);
                <br />
                &nbsp;&nbsp;
                {`${'}'}`}
                <br />
                {`${'}'}`}
              </code>
            </pre>
          </Col>
        </Col>
      </Row>
    );
  }
}

export default CustomSlider;
