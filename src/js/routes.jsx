import React from 'react';
import { Route } from 'react-router-dom';

import LandingPage from 'js/components/landingPage';
import BoardView from 'js/containers/boardView';
import PlayerView from 'js/containers/playerView';

const routes = [
  <Route exact path="/" component={LandingPage} key={0} />,
  <Route path="/board" component={BoardView} key={1} />,
  <Route path="/player" component={PlayerView} key={2} />,
];

export default routes;
