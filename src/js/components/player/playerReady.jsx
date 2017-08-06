import React from 'react';
import PropTypes from 'prop-types';

import Card from 'js/components/card';

class PlayerReady extends React.Component {
  constructor(props) {
    super(props);
    this.playCard = this.playCard.bind(this);
  }

  playCard(cardId) {
    this.props.playCard(this.props.id, cardId);
  }

  render() {
    const {
      id,
      cards,
      isPlayerTurn,
      turnInfo,
    } = this.props;
    const info = turnInfo ? (
      <Card id={turnInfo.id} color={turnInfo.color} value={turnInfo.value} />
    ) : null;
    return (
      <div>
        <button onClick={this.props.drawCard}>Draw Card</button>
        <div>Player {id}</div>
        <div>Card Count: {cards.length}</div>
        <div>Turn: {isPlayerTurn.toString()}</div>
        <div>Turn Info: {info}</div>
        <div>
          {cards.map(card => (
            <Card
              id={card.id}
              color={card.color}
              value={card.value}
              disabled={!isPlayerTurn}
              key={card.id}
              onClick={this.playCard}
            />
          ))}
        </div>
      </div>
    );
  }
}

PlayerReady.propTypes = {
  id: PropTypes.string.isRequired,
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  isPlayerTurn: PropTypes.bool.isRequired,
  playCard: PropTypes.func.isRequired,
  drawCard: PropTypes.func.isRequired,
  turnInfo: PropTypes.shape(Card.propTypes),
};

PlayerReady.defaultProps = {
  turnInfo: {},
};

export default PlayerReady;
