import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import Drawing from './App';
import Drawings from './Drawings';
import { HashRouter, Switch, Route, Link } from 'react-router-dom';

import { API } from 'aws-amplify';

function Router({ store }) {
  return (
    <HashRouter>
      <div>
        <Switch>
          <Route exact path="/">
            <Drawings store={store} dispatch={store.dispatch} />
          </Route>
          <Route path="/create/:id">
            <Drawing store={store} dispatch={store.dispatch} />
          </Route>
          <Route path="/drawing/:id">
            <Drawing store={store} dispatch={store.dispatch} />
          </Route>
        </Switch>
      </div>
    </HashRouter>
  );
}

const Root = ({ store }) => (
  <Provider store={store}>
    <Router store={store} />
  </Provider>
);

function Main({ store }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {}
  return <Root store={store} />;
}

export default Main;
