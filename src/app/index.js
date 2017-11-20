import { screenView } from '../utility/gaTracker';
import { screenView as mixPanelScreenView } from '../utility/mixPanelTracker';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import apiHelper from './helpers/apiHelper';
import App from './components/app';
import rootReducer from './reducers';
import domHelper from './helpers/domHelper';
import fs from 'fs';
import backTrace from '../utility/backtraceRenderer';
domHelper.preventDragDrop();
const serviceMiddleware = (apiService) => {
  return ({ dispatch, getState }) => next => action => {
    if (action.type === 'LOGIN_USER') {
      apiService.updateToken(action.payload, action.refresh_token);
    }
    return next(action);
  };
};
const store = createStore(rootReducer, applyMiddleware(serviceMiddleware(apiHelper), thunk));
// render UI view
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
// trigger events for GA and Mixpanel
screenView("HOME");
mixPanelScreenView("HOME");
backTrace.init();
