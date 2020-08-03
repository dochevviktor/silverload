import React, {Fragment} from 'react';
import {render} from 'react-dom';
import Root from './container/Root';
import './index.css';

render(
  <Fragment>
    <Root/>
  </Fragment>,
  document.getElementById('root')
);
