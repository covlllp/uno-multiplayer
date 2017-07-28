import React from 'react';
import PropTypes from 'prop-types';

const PlayerReady = props => (
  <div>
    <div>Player {props.id}</div>
    <div>Card Count: {props.cards.length}</div>
  </div>
);

PlayerReady.propTypes = {
  id: PropTypes.string.isRequired,
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PlayerReady;
