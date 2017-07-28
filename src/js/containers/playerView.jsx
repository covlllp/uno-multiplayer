import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { createPlayer, updatePlayer, actionCreators } from 'js/actions';
import { deserializePlayerData } from 'js/server/deserializers';
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
      const rawPlayers = gameData.players;
      const players = rawPlayers.map(player => deserializePlayerData(player));
      const playerIds = players.map(player => player.id);

      const playerIndex = playerIds.indexOf(this.props.id);
      if (playerIndex !== -1) {
        this.props.actions.setPlayerInfo(players[playerIndex]);
      }
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
    const { id, cards } = this.props;
    return this.props.isReady ?
      <PlayerReady
        id={id}
        cards={cards}
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
};

PlayerView.defaultProps = {
  id: '',
  cards: [],
};


const mapStateToProps = state => ({
  ...state.player,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    setPlayerInfo: bindActionCreators(actionCreators.setPlayerInfo, dispatch),
    createPlayer: createPlayer.bind(this, dispatch),
    updatePlayer: updatePlayer.bind(this, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerView);
