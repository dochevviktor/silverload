import { render } from 'react-dom';
import { Provider } from 'react-redux';
import './index.scss';
import store from './store/store';
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
