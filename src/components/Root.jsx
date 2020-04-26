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
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {}
  return <Root store={store} />;
}

export default Main;
