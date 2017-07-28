import React from 'react';
import PropTypes from 'prop-types';

import Card from 'js/components/card';

const PlayerReady = props => (
  <div>
    <div>Player {props.id}</div>
    <div>Card Count: {props.cards.length}</div>
    <div>Turn: {props.isPlayerTurn.toString()}</div>
    <div>GameId: {props.gameId}</div>
    <div>
      {props.cards.map(card => (
        <Card
          id={card.id}
          playerId={props.id}
          gameId={props.gameId}
          color={card.color}
          value={card.value}
          key={card.id}
          onClick={props.playCard}
        />
      ))}
    </div>
  </div>
);

PlayerReady.propTypes = {
  id: PropTypes.string.isRequired,
  gameId: PropTypes.string.isRequired,
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  isPlayerTurn: PropTypes.bool.isRequired,
  playCard: PropTypes.func.isRequired,
};

export default PlayerReady;
