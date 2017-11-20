import 'babel-polyfill';
// import fetchPonyFill from 'fetch-ponyfill'; // module "whatwg-fetch" is browser-only
import _$ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import jsdom from 'jsdom';
import chai, { expect, should } from 'chai';
import spies from 'chai-spies';
import chaiJquery from 'chai-jquery';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import sinon from 'sinon';
import assert from 'assert';
import reducers from '../../src/app/reducers';
import fetchMock from 'fetch-mock';
let mockJSDom = new jsdom.JSDOM('<!doctype html><html><body></body></html>', { runScripts: "dangerously" });
global.document = mockJSDom.document;
global.window = mockJSDom.window;
global.navigator = global.window.navigator;
const $ = _$(window);


chaiJquery(chai, chai.util, $);
chai.use(spies);

function propagateToGlobal(window) {
  Object
    .keys(window)
    .forEach(key => {
      if ({}.hasOwnProperty.call(window, key)) {
        if (typeof global[key] === 'undefined') {
          global[key] = window[key];
        }
      }
    });
}
global.window.require = function () {
  return {
    ipcRenderer: {
      send: function () {
      }
    }
  };
};

propagateToGlobal(window);
var store = {};

global.window.localStorage = {
  getItem: (key) => { return store[key]; },
  setItem: (key, value) => {
    store[key] = value + '';
    return store[key];
  },
  clear: () => { store = {}; }
};

function renderComponent(ComponentClass, props = {}, state = {}) {
  const componentInstance = TestUtils.renderIntoDocument(
    <Provider store={createStore(reducers, state)}>
      <ComponentClass {...props} />
    </Provider>
  );

  return $(ReactDOM.findDOMNode(componentInstance));
}

$.fn.simulate = function (eventName, value) {
  if (value) {
    this.val(value);
  }
  TestUtils.Simulate[eventName](this[0]);
};

export { renderComponent, expect, should, chai, fetchMock, sinon, assert };
