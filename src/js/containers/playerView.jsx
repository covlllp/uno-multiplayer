import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { createPlayer, updatePlayer, actionCreators } from 'js/actions';
import { deserializeGameDataForPlayer } from 'js/server/deserializers';
import { socket, initializeSocket } from 'js/socket';

import PlayerWaiting from 'js/components/playerWaiting';
import PlayerReady from 'js/components/playerReady';

class PlayerView extends React.Component {
  constructor(props) {
    super(props);
    this.indicateReady = this.indicateReady.bind(this);
  }

  componentWillMount() {
    initializeSocket('/player');
  }

  componentDidMount() {
    this.createPlayer();
    this.setSocketCallbacks();
  }

  setSocketCallbacks() {
    socket.on('gameCreated', () => {
      this.createPlayer();
    });
    socket.on('gameUpdate', (gameData) => {
      const { player, playerTurn } = deserializeGameDataForPlayer(gameData, this.props.id);
      this.props.actions.setPlayerInfo(player);
      this.props.actions.setPlayerTurn(playerTurn);
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

  indicateReady() {
    this.props.actions.updatePlayer(this.props.id, {
      isReady: true,
    }).then(() => {
      socket.emit('playerReady');
    });
  }

  render() {
    const { id, cards, isPlayerTurn } = this.props;
    return this.props.isReady ?
      <PlayerReady
        id={id}
        cards={cards}
        isPlayerTurn={isPlayerTurn}
      /> :
      <PlayerWaiting
        id={id}
        onReady={this.indicateReady}
      />;
  }
}

PlayerView.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  isReady: PropTypes.bool.isRequired,
  id: PropTypes.string,
  cards: PropTypes.arrayOf(PropTypes.object),
  isPlayerTurn: PropTypes.bool,
};

PlayerView.defaultProps = {
  id: '',
  cards: [],
  isPlayerTurn: false,
};


const mapStateToProps = state => ({
  ...state.player,
  isPlayerTurn: state.playerTurn,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    setPlayerInfo: bindActionCreators(actionCreators.setPlayerInfo, dispatch),
    setPlayerTurn: bindActionCreators(actionCreators.setPlayerTurn, dispatch),
    createPlayer: createPlayer.bind(this, dispatch),
    updatePlayer: updatePlayer.bind(this, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerView);
