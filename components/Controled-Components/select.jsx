import React from 'react';
import PropTypes from 'prop-types';

class Select extends React.Component {
  render() {
    const { name, item, text, handleChange, value } = this.props;
    return (
      <label htmlFor={ name }>
        { `${text}` }
        <select name={ name } id={ name } onChange={ handleChange } value={ value }>
          { item.map((currency) => (
            <option key={ currency } value={ currency }>{currency}</option>)) }
        </select>
      </label>
    );
  }
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
  item: PropTypes.arrayOf(PropTypes.string).isRequired,
  text: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default Select;
