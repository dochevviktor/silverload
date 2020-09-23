import React, { Fragment } from 'react';
import { render } from 'react-dom';
import './index.less';
import TitleBar from './component/title.bar/Titlebar';
import Main from './component/Main';

render(
  <Fragment>
    <TitleBar />
    <Main />
  </Fragment>,
  document.getElementById('root')
);
