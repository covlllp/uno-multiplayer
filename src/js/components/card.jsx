import React from 'react';
import PropTypes from 'prop-types';

const Card = props => (
  <div>
    Color: {props.color}
    <br />
    value: {props.value}
  </div>
);

Card.propTypes = {
  color: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default Card;
