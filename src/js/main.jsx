import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import reducer from 'js/reducers';
import routes from 'js/routes';
import { initializeSocket } from 'js/socket';

const middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

const store = createStore(reducer, applyMiddleware(...middleware));

initializeSocket();

render(
  <Provider store={store} >
    <BrowserRouter>
      <div>
        {routes}
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('react-content'),
);
