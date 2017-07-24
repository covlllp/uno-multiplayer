import React from 'react';
import { Route } from 'react-router-dom';

const div = () => (
  <div>
    Hello!
  </div>
);

const routes = [
  <Route path="/" component={div} key={0} />,
];

export default routes;
