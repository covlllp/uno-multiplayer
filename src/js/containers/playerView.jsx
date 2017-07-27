import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

import { createPlayer, updatePlayer } from 'js/actions';
import { socket, initializeSocket } from 'js/socket';

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

  indicateReady() {
    this.props.actions.updatePlayer(this.props.id, {
      isReady: true,
    }).then(() => {
      socket.emit('playerReady');
    });
  }

  render() {
    const button = this.props.isReady ? null : <button onClick={this.indicateReady}>Ready</button>;
    return <div>Player {this.props.id}! {button}</div>;
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
});

const mapDispatchToProps = dispatch => ({
  actions: {
    createPlayer: createPlayer.bind(this, dispatch),
    updatePlayer: updatePlayer.bind(this, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerView);
