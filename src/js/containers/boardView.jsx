import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { createNewGame, dealCards, actionCreators } from 'js/actions';
import { deserializeGameData } from 'js/server/deserializers';
import { socket, initializeSocket } from 'js/socket';

class BoardView extends Component {
  componentWillMount() {
    initializeSocket('/board');
  }

  componentDidMount() {
    this.props.actions.createNewGame();
    this.setSocketCallbacks();
  }

  setSocketCallbacks() {
    socket.on('gameUpdate', (data) => {
      this.props.actions.setGameInfo(deserializeGameData(data));
    });
    socket.on('gameReady', () => {
      this.props.actions.indicateGameReady();
      this.props.actions.dealCards(this.props.id).then(() => {
        socket.emit('gameUpdate');
      });
    });
  }

  render() {
    return (
      <div>
        <div>
          Board! {this.props.gameReady.toString()}
        </div>
        <div>
          Deck Count! {this.props.drawDeck.length}
        </div>
        <div>
          Players: {this.props.players.length}
        </div>
      </div>
    );
  }
}

BoardView.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  drawDeck: PropTypes.arrayOf(PropTypes.string).isRequired,
  gameReady: PropTypes.bool.isRequired,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string,
};

BoardView.defaultProps = {
  id: null,
};


const mapStateToProps = state => ({
  ...state.game,
  gameReady: state.gameReady,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    createNewGame: createNewGame.bind(this, dispatch),
    dealCards: dealCards.bind(this, dispatch),
    indicateGameReady: bindActionCreators(actionCreators.indicateGameReady, dispatch),
    setGameInfo: bindActionCreators(actionCreators.setGameInfo, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardView);
