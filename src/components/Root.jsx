import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import Drawing from './App';
import Drawings from './Drawings';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { setClientId } from '../store/actions/actionCreators' 

const CLIENT_ID = uuid();

function Router({ store }) {
  useEffect(() => {
    store.dispatch(setClientId(CLIENT_ID));
  }, []);
  return (
    <HashRouter>
      <div>
        <header style={{ padding: 0 }}>
          <div class="col-2-3">
            <h1>
              <a style={{ color: '#ddd', textDecoration: 'none' }} href="/">PIXEL ME</a>
            </h1>
          </div>
        </header>
        <Switch>
          <Route exact path="/">
            <Drawings store={store} dispatch={store.dispatch} clientId={CLIENT_ID} />
          </Route>
          <Route path="/create/:id/:name?/:drawingVisibility?">
            <Drawing store={store} dispatch={store.dispatch} clientId={CLIENT_ID} />
          </Route>
          <Route path="/drawing/:id/:name?">
            <Drawing store={store} dispatch={store.dispatch} clientId={CLIENT_ID} />
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
  return <Root store={store} />;
}

export default Main;
