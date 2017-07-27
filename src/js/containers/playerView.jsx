import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

import { createPlayer } from 'js/actions';
import { socket, initializeSocket } from 'js/socket';

class PlayerView extends React.Component {
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
  }

  createPlayer() {
    const promises = [];
    if (!this.props.id) {
      promises.push(this.props.actions.createPlayer());
    }
    Promise.all(promises).then(() => {
      socket.emit('playerJoin', this.props.id);
    });
  }

  render() {
    const button = this.props.isReady ? null : <button>Ready</button>;
    return <div>Player! {button}</div>;
  }
}

PlayerView.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  isReady: PropTypes.bool.isRequired,
  id: PropTypes.string,
};

PlayerView.defaultProps = {
  id: null,
};


const mapStateToProps = state => ({
  ...state.player,
  isReady: state.playerReady,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    createPlayer: createPlayer.bind(this, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerView);
