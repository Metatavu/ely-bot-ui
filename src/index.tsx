import "@babel/polyfill";

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';

import registerServiceWorker from './registerServiceWorker';

import { createStore } from 'redux';
import { processAction } from './reducers/index';
import { StoreState } from './types/index';
import { BotAction } from './actions';
import { Provider } from 'react-redux';
import Api from "metamind-client";

const store = createStore<StoreState, BotAction, any, any>(processAction, {
  messageDatas: [],
  conversationStarted: false
});

Api.configure(process.env.REACT_APP_API_BASE_PATH || "https://v2-api.metamind.fi/v2");

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
