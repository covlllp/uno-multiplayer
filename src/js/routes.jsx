import React from 'react';
import { Route } from 'react-router-dom';

import LandingPage from 'js/components/landingPage';

const routes = [
  <Route path="/" component={LandingPage} key={0} />,
];

export default routes;
