// eslint-disable-next-line import/no-unresolved
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.scss';
import 'antd/dist/antd.less';
import store from './store/store';
import App from './container/App';

window.addEventListener('load', () => {
  const container = document.body.appendChild(Object.assign(document.createElement('div'), { id: 'root' }));
  const root = createRoot(container); // createRoot(container!) if you use TypeScript

  const renderIndex = () => {
    root.render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  };

  renderIndex();

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./container/App', renderIndex);
  }
});
