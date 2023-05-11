import React from 'react';
import PropTypes from 'prop-types';

class Input extends React.Component {
  render() {
    const { type, handleChange, name, testId, text, labelText, value, maxL } = this.props;

    return (
      <label htmlFor={ name }>
        { `${labelText} ` }
        <input
          name={ name }
          id={ name }
          type={ type }
          data-testid={ testId }
          onChange={ handleChange }
          placeholder={ text }
          value={ value }
          min="0"
          maxLength={ maxL }
        />
      </label>
    );
  }
}

Input.defaultProps = {
  labelText: '',
  text: '',
  testId: '',
  value: '',
  maxL: '',
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  testId: PropTypes.string,
  text: PropTypes.string,
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  labelText: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxL: PropTypes.string,
};

export default Input;
