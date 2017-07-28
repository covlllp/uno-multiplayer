import React from 'react';
import PropTypes from 'prop-types';

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onClick(this.props.gameId, { cardId: this.props.id, playerId: this.props.playerId });
  }

  render() {
    const { color, value } = this.props;
    return (
      <div>
        Color: {color}
        <br />
        value: {value}
        <br />
        <button onClick={this.onClick}>Click</button>
      </div>
    );
  }
}

Card.propTypes = {
  id: PropTypes.string.isRequired,
  gameId: PropTypes.string,
  playerId: PropTypes.string,
  color: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

Card.defaultProps = {
  onClick: () => {},
  gameId: null,
  playerId: null,
};

export default Card;
