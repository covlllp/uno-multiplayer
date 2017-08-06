import React from 'react';
import PropTypes from 'prop-types';

const PlayerWaiting = props => (
  <div>
    Player {props.id}
    <button onClick={props.onReady}>Ready</button>
  </div>
);

PlayerWaiting.propTypes = {
  id: PropTypes.string.isRequired,
  onReady: PropTypes.func.isRequired,
};

export default PlayerWaiting;
