import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

import { startGame } from 'js/actions';

class BoardView extends Component {
  componentDidMount() {
    this.props.actions.startGame();
  }

  render() {
    console.log(this.props);
    return <div>Board!</div>;
  }
}

BoardView.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
};

const mapStateToProps = state => state.game;

const mapDispatchToProps = dispatch => ({
  actions: {
    startGame: startGame.bind(this, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardView);
