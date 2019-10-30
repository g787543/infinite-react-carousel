import 'raf/polyfill';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ResizeObserver from 'resize-observer-polyfill';

Enzyme.configure({ adapter: new Adapter() });
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

window.requestAnimationFrame = window.requestAnimationFrame || function(callback) {
  setTimeout(callback, 0);
};

window.ResizeObserver = window.ResizeObserver || ResizeObserver;
