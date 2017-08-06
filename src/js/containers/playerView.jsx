import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  createPlayer,
  updatePlayer,
  drawCards,
  playCard,
  readGameDataForPlayer,
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

  setSocketCallbacks() {
    socket.on('gameCreated', (data) => {
      this.readGameData(data);
      this.createPlayer();
    });
    socket.on('gameEnded', () => {
      this.resetPlayer();
    });

    socket.on('gameUpdate', (data) => {
      this.readGameData(data);
    });
  }

  readGameData(gameData) {
    this.props.actions.readGameDataForPlayer(gameData, this.props.id);
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
    this.props.actions.updatePlayer(this.props.id, {
      isReady: false,
      cards: [],
    });
  }

  indicateReady() {
    this.props.actions.updatePlayer(this.props.id, {
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
  isReady: PropTypes.bool.isRequired,
  turnInfo: PropTypes.shape(Card.propTypes).isRequired,
  id: PropTypes.string,
  gameId: PropTypes.string,
  cards: PropTypes.arrayOf(PropTypes.object),
  isPlayerTurn: PropTypes.bool,
};

PlayerView.defaultProps = {
  id: '',
  gameId: '',
  cards: [],
  isPlayerTurn: false,
};


const mapStateToProps = state => ({
  ...state.player,
  isPlayerTurn: state.playerTurn,
  gameId: state.game.id,
  turnInfo: state.game.turnInfo,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    createPlayer: createPlayer.bind(this, dispatch),
    updatePlayer: updatePlayer.bind(this, dispatch),
    drawCards: drawCards.bind(this, dispatch),
    playCard: playCard.bind(this, dispatch),
    readGameDataForPlayer: readGameDataForPlayer.bind(this, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerView);
