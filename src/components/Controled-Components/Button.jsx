import React from 'react';
import PropTypes from 'prop-types';

class Button extends React.Component {
  render() {
    const { text, handleClick, status, testId, className } = this.props;
    return (
      <button
        type="button"
        onClick={ handleClick }
        disabled={ status }
        data-testid={ testId }
        className={ className }
      >
        { text }
      </button>
    );
  }
}

Button.defaultProps = {
  status: false,
  testId: '',
  className: '',
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  status: PropTypes.bool,
  testId: PropTypes.string,
  className: PropTypes.string,
};

export default Button;
