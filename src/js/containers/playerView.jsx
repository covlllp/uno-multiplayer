import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  createPlayer,
  updatePlayer,
  drawCards,
  playCard,
  updateGameData,
} from 'js/actions';
import { socket, initializeSocket } from 'js/socket';

import Card from 'js/components/card';
import PlayerWaiting from 'js/components/player/playerWaiting';
import PlayerReady from 'js/components/player/playerReady';

class PlayerView extends React.Component {
  constructor(props) {
    super(props);
    this.indicateReady = this.indicateReady.bind(this);
    this.playCard = this.playCard.bind(this);
    this.drawCard = this.drawCard.bind(this);
  }

  componentWillMount() {
    initializeSocket('/player');
  }

  componentDidMount() {
    this.createPlayer();
    this.setSocketCallbacks();
  }

  componentDidUpdate(prevProps) {
    const {
      isPlayerTurn,
      turnInfo,
    } = this.props;
    const nowTurn = !prevProps.isPlayerTurn && isPlayerTurn;
    const hasPenalty = turnInfo && turnInfo.penalty;
    if (nowTurn && hasPenalty) {
      this.drawPenaltyCards(this.props.turnInfo.penalty);
    }
  }

  setSocketCallbacks() {
    socket.on('gameCreated', (data) => {
      this.props.actions.updateGameData(data);
      this.createPlayer();
    });
    socket.on('gameEnded', () => {
      this.resetPlayer();
    });

    socket.on('gameUpdate', (data) => {
      this.props.actions.updateGameData(data);
    });
  }

  createPlayer() {
    const promises = [Promise.resolve()];
    if (!this.props.id) {
      promises.push(this.props.actions.createPlayer());
    }
    Promise.all(promises).then(() => {
      socket.emit('playerJoin', this.props.id);
    });
  }

  resetPlayer() {
    this.props.actions.updatePlayer(this.props.gameId, this.props.id, {
      isReady: false,
      cards: [],
    });
  }

  indicateReady() {
    this.props.actions.updatePlayer(this.props.gameId, this.props.id, {
      isReady: true,
    }).then(() => {
      socket.emit('playerReady', this.props.gameId);
    });
  }

  playCard(playerId, cardId) {
    const body = {
      playerId,
      cardId,
    };
    this.props.actions.playCard(this.props.gameId, body).then(() => {
      socket.emit('gameUpdate', this.props.gameId);
    });
  }

  drawCard() {
    this.props.actions.drawCards(this.props.gameId, {
      playerId: this.props.id,
      amount: 1,
      playAsTurn: true,
    }).then(() => {
      socket.emit('gameUpdate', this.props.gameId);
    });
  }

  drawPenaltyCards(amount) {
    this.props.actions.drawCards(this.props.gameId, {
      playerId: this.props.id,
      amount,
      playAsTurn: false,
    }).then(() => {
      socket.emit('gameUpdate', this.props.gameId);
    });
  }

  render() {
    const {
      id,
      cards,
      isPlayerTurn,
      gameId,
      turnInfo,
    } = this.props;
    const view = this.props.isReady ?
      (<PlayerReady
        id={id}
        gameId={gameId}
        cards={cards}
        isPlayerTurn={isPlayerTurn}
        playCard={this.playCard}
        drawCard={this.drawCard}
        turnInfo={turnInfo}
      />) :
      (<PlayerWaiting
        id={id}
        onReady={this.indicateReady}
      />);
    return (
      <div>
        <div>
          GameId: {this.props.gameId}
        </div>
        {view}
      </div>
    );
  }
}

PlayerView.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  isReady: PropTypes.bool,
  turnInfo: PropTypes.shape(Card.propTypes),
  id: PropTypes.string,
  gameId: PropTypes.string,
  cards: PropTypes.arrayOf(PropTypes.object),
  isPlayerTurn: PropTypes.bool,
};

PlayerView.defaultProps = {
  isReady: false,
  id: '',
  gameId: '',
  cards: [],
  turnInfo: {},
  isPlayerTurn: false,
};


const mapStateToProps = (state) => {
  const {
    game,
    playerId,
  } = state;
  const {
    id,
    players,
    turnInfo,
    turn,
  } = game;
  let player = {};
  let playerIndex = null;
  players.forEach((p, index) => {
    if (p.id === playerId) {
      player = p;
      playerIndex = index;
    }
  });

  return {
    ...player,
    id: playerId || '',
    gameId: id,
    turnInfo,
    isPlayerTurn: turn === playerIndex,
  };
};

const mapDispatchToProps = dispatch => ({
  actions: {
    createPlayer: createPlayer.bind(this, dispatch),
    updatePlayer: updatePlayer.bind(this, dispatch),
    drawCards: drawCards.bind(this, dispatch),
    playCard: playCard.bind(this, dispatch),
    updateGameData: updateGameData.bind(this, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerView);
