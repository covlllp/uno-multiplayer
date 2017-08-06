import React from 'react';
import PropTypes from 'prop-types';

import Player from 'js/components/board/player';
// import Card from 'js/components/card';

const Board = (props) => {
  const {
    players,
    turn,
  } = props;

  return (
    <div>
      {players.map((player, index) => (
        <Player
          cards={player.cards}
          id={player.id}
          isTurn={index === turn}
          key={player.id}
        />
      ))}
    </div>
  );
};

Board.propTypes = {
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
  turn: PropTypes.number.isRequired,
  // lastPlayedCard: PropTypes.shape(Card.propTypes).isRequired,
  // drawDeck: PropTypes.arrayOf(PropTypes.string).isRequired,
  // discardDeck: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Board;
