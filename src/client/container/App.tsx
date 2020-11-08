import React, { Fragment } from 'react';
import TitleBar from '../component/title.bar/Titlebar';
import Main from '../component/Main';

const App = (): JSX.Element => (
  <Fragment>
    <TitleBar />
    <Main />
  </Fragment>
);

export default App;
