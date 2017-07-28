import React from 'react';
import PropTypes from 'prop-types';

import Card from 'js/components/card';

const PlayerReady = props => (
  <div>
    <div>Player {props.id}</div>
    <div>Card Count: {props.cards.length}</div>
    <div>Turn: {props.isPlayerTurn.toString()}</div>
    <div>
      {props.cards.map(card => (
        <Card
          color={card.color}
          value={card.value}
          key={card.id}
        />
      ))}
    </div>
  </div>
);

PlayerReady.propTypes = {
  id: PropTypes.string.isRequired,
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  isPlayerTurn: PropTypes.bool.isRequired,
};

export default PlayerReady;
