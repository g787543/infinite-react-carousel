import React, { Component } from 'react';
import {
  Form,
  Switch,
  Slider,
  Row,
  Col,
  InputNumber
} from 'antd';
import map from 'lodash/map';
import Carousel from '../../src';
import 'antd/dist/antd.css';

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
      shift: 0
    };
    this.sliderRef = null;
  }

  render() {
    const {
      dots,
      slidesToShow,
      slidesToScroll,
      centerMode,
      boxCount,
      autoplay,
      autoplaySpeed,
      centerPadding,
      arrows,
      dotsScroll,
      duration,
      shift
    } = this.state;
    return (
      <div>
        <h2>Custom Slider</h2>
        <Form labelAlign="left" labelCol={{ span: 3 }}>
          <Form.Item label="boxCount" wrapperCol={{ span: 6 }}>
            <Row>
              <Col span={16}>
                <Slider
                  min={1}
                  max={100}
                  value={boxCount.length}
                  onChange={(value) => this.setState({ boxCount: new Array(value) })}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={100}
                  style={{ marginLeft: 16 }}
                  value={boxCount.length}
                  onChange={(value) => this.setState({ boxCount: new Array(value) })}
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="arrows" wrapperCol={{ span: 6 }}>
            <Switch
              checked={arrows}
              onChange={(checked) => this.setState({ arrows: checked })}
            />
          </Form.Item>
          <Form.Item label="centerMode" wrapperCol={{ span: 6 }}>
            <Switch
              checked={centerMode}
              onChange={(checked) => this.setState({ centerMode: checked })}
            />
          </Form.Item>
          <Form.Item label="centerPadding" wrapperCol={{ span: 6 }}>
            <Row>
              <Col span={16}>
                <Slider
                  step={10}
                  min={10}
                  max={200}
                  value={centerPadding}
                  onChange={(value) => this.setState({ centerPadding: value })}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  step={10}
                  min={10}
                  max={200}
                  style={{ marginLeft: 16 }}
                  value={centerPadding}
                  onChange={(value) => this.setState({ centerPadding: value })}
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="duration" wrapperCol={{ span: 6 }}>
            <Row>
              <Col span={16}>
                <Slider
                  step={100}
                  min={100}
                  max={500}
                  value={duration}
                  onChange={(value) => this.setState({ duration: value })}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  step={100}
                  min={100}
                  max={500}
                  style={{ marginLeft: 16 }}
                  value={duration}
                  onChange={(value) => this.setState({ duration: value })}
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="shift" wrapperCol={{ span: 6 }}>
            <Row>
              <Col span={16}>
                <Slider
                  step={10}
                  min={0}
                  max={100}
                  value={shift}
                  onChange={(value) => this.setState({ shift: value })}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  step={10}
                  min={0}
                  max={100}
                  style={{ marginLeft: 16 }}
                  value={shift}
                  onChange={(value) => this.setState({ shift: value })}
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label="slidesToShow" wrapperCol={{ span: 6 }}>
            <Slider
              min={1}
              max={20}
              onChange={(value) => this.setState({ slidesToShow: value })}
              value={slidesToShow || 1}
            />
          </Form.Item>
          <Form.Item label="slidesToScroll" wrapperCol={{ span: 6 }}>
            <Slider
              min={1}
              max={20}
              onChange={(value) => this.setState({ slidesToScroll: value })}
              value={slidesToScroll || 1}
            />
          </Form.Item>
          <Form.Item label="dots-Group" labelCol={{ span: 24 }}>
            <Form wrapperCol={{ span: 12 }} labelCol={{ span: 6 }}>
              <Form.Item label="dots" labelCol={{ span: 3 }} style={{ width: '50%', display: 'inline-block' }}>
                <Switch checked={dots} onChange={(checked) => this.setState({ dots: checked })} />
              </Form.Item>
              <Form.Item label="dotsScroll" labelCol={{ span: 3 }} style={{ width: '50%', display: 'inline-block' }}>
                <Row>
                  <Col span={16}>
                    <Slider
                      min={1}
                      max={10}
                      value={dotsScroll}
                      onChange={(value) => this.setState({ dotsScroll: value })}
                    />
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      min={1}
                      max={10}
                      style={{ marginLeft: 16 }}
                      value={dotsScroll}
                      onChange={(value) => this.setState({ dotsScroll: value })}
                    />
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Form.Item>
          <Form.Item label="AutoPlay-Group" labelCol={{ span: 24 }}>
            <Form wrapperCol={{ span: 12 }} labelCol={{ span: 6 }}>
              <Form.Item label="autoplay" labelCol={{ span: 3 }} style={{ width: '50%', display: 'inline-block' }}>
                <Switch
                  checked={autoplay}
                  onChange={(checked) => this.setState({ autoplay: checked }, () => {
                    if (checked) {
                      this.sliderRef.slickPlay();
                    } else {
                      this.sliderRef.slickPause();
                    }
                  })}
                />
              </Form.Item>
              <Form.Item label="autoplaySpeed" labelCol={{ span: 3 }} style={{ width: '50%', display: 'inline-block' }}>
                <Row>
                  <Col span={16}>
                    <Slider
                      step={1000}
                      min={1000}
                      max={10000}
                      value={autoplaySpeed}
                      onChange={(value) => this.setState({ autoplaySpeed: value })}
                    />
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      step={1000}
                      min={1000}
                      max={10000}
                      style={{ marginLeft: 16 }}
                      value={autoplaySpeed}
                      onChange={(value) => this.setState({ autoplaySpeed: value })}
                    />
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Form.Item>
        </Form>
        <Carousel {...this.state} ref={(ele) => { this.sliderRef = ele; }}>
          {
            map(boxCount, ((value, index) => (
              <div key={`${new Date().getTime() * index}`}>
                <h3>{index + 1}</h3>
              </div>
            )))
          }
        </Carousel>
      </div>
    );
  }
}

export default CustomSlider;
