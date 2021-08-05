import { render } from 'react-dom';
import { Provider } from 'react-redux';
import './index.scss';
import 'antd/dist/antd.less';
import store from './store/store';
import App from './container/App';

const root = document.body.appendChild(Object.assign(document.createElement('div'), { id: 'root' }));

const renderIndex = () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    root
  );
};

renderIndex();

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./container/App', renderIndex);
}
