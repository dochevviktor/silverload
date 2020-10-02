import React from 'react';
import { render } from 'react-dom';
import './index.less';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './container/App';

const renderIndex = () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
};

renderIndex();

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./container/App', renderIndex);
}
