import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  actionCreators,
  createNewGame,
  startGame,
} from 'js/actions';
import { deserializeGameData } from 'js/server/deserializers';
import { socket, initializeSocket } from 'js/socket';

import Board from 'js/components/board/board';
import Card from 'js/components/card';

class BoardView extends Component {
  componentWillMount() {
    initializeSocket('/board');
  }

  componentDidMount() {
    this.props.actions.createNewGame().then(() => {
      socket.emit('gameCreated', this.props.id);
    });
    this.setSocketCallbacks();
  }

  setSocketCallbacks() {
    socket.on('gameUpdate', (data) => {
      this.props.actions.setGameInfo(deserializeGameData(data));
    });
    socket.on('gameReady', () => {
      this.props.actions.indicateGameReady();
      this.props.actions.startGame(this.props.id).then(() => {
        socket.emit('gameUpdate', this.props.id);
      });
    });
  }

  render() {
    const {
      gameReady,
      drawDeck,
      discardDeck,
      players,
      lastPlayedCard,
      turn,
    } = this.props;

    const card = lastPlayedCard ?
      (<Card
        color={lastPlayedCard.color}
        value={lastPlayedCard.value}
        id={lastPlayedCard.id}
      />) :
      null;

    return (
      <div>
        <div>
          Board! {gameReady.toString()}
        </div>
        <Board
          players={players}
          turn={turn}
          lastPlayedCard={lastPlayedCard}
          drawDeck={drawDeck}
          discardDeck={discardDeck}
        />
        <div>
          Deck Count! {drawDeck.length}
        </div>
        <div>
          Discard Count! {discardDeck.length}
        </div>
        <div>
          Players: {players.length}
        </div>
        <div>
          Last played card: {card}
        </div>
      </div>
    );
  }
}

BoardView.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  drawDeck: PropTypes.arrayOf(PropTypes.string).isRequired,
  discardDeck: PropTypes.arrayOf(PropTypes.string).isRequired,
  gameReady: PropTypes.bool.isRequired,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
  lastPlayedCard: PropTypes.shape(Card.propTypes),
  id: PropTypes.string,
  turn: PropTypes.number,
};

BoardView.defaultProps = {
  id: null,
  lastPlayedCard: null,
  turn: 0,
};


const mapStateToProps = state => ({
  ...state.game,
  gameReady: state.gameReady,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    createNewGame: createNewGame.bind(this, dispatch),
    startGame: startGame.bind(this, dispatch),
    indicateGameReady: bindActionCreators(actionCreators.indicateGameReady, dispatch),
    setGameInfo: bindActionCreators(actionCreators.setGameInfo, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardView);
