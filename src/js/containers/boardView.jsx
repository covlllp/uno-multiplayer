import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { createNewGame, actionCreators } from 'js/actions';
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
    socket.on('gameUpdate', this.props.actions.setGameInfo);
  }

  render() {
    return (
      <div>
        <div>
          Board! {this.props.gameReady.toString()}
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
  gameReady: PropTypes.bool.isRequired,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
};


const mapStateToProps = state => ({
  ...state.game,
  gameReady: state.gameReady,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    setGameInfo: bindActionCreators(actionCreators.setGameInfo, dispatch),
    indicateGameReady: bindActionCreators(actionCreators.indicateGameReady, dispatch),
    createNewGame: createNewGame.bind(this, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardView);
