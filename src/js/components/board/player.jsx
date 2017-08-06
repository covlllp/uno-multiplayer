import React from 'react';
import PropTypes from 'prop-types';

const Player = (props) => {
  const {
    isTurn,
    id,
    cards,
  } = props;

  return (
    <div>
      Id: {id}, cardCount: {cards.length}, Turn: {isTurn.toString()}
    </div>

  );
};

Player.propTypes = {
  isTurn: PropTypes.bool,
  id: PropTypes.string.isRequired,
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Player.defaultProps = {
  isTurn: false,
};

export default Player;
