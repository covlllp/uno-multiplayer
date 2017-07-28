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
    const { color, value, disabled } = this.props;
    return (
      <div>
        Color: {color}
        <br />
        value: {value}
        <br />
        <button onClick={this.onClick} disabled={disabled}>Click</button>
      </div>
    );
  }
}

Card.propTypes = {
  id: PropTypes.string.isRequired,
  gameId: PropTypes.string,
  playerId: PropTypes.string,
  disabled: PropTypes.bool,
  color: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

Card.defaultProps = {
  onClick: () => {},
  gameId: null,
  playerId: null,
  disabled: false,
};

export default Card;
