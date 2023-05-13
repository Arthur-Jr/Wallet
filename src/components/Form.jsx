import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { expense, edit, modifyExpenses, setFormStatus } from '../Redux/actions';
import Input from './Controled-Components/Inputs';
import Select from './Controled-Components/select';
import Button from './Controled-Components/Button';
import addNewExpense from '../api/addExpense';
import paymentMethods from '../util/paymentMethods';
import Tags from '../util/Tags';
import editExpense from '../api/editExpense';
import localStorageVarNames from '../util/localStorageVarNames';

const DEFAULT_STATE = {
  value: '',
  description: '',
  currency: 'USD',
  method: 'Dinheiro',
  tag: 'Alimentação',
};
const PHONE_WIDTH_PX = 650;

class Form extends React.Component {
  constructor(props) {
    super(props);

    const { expenseToEdit: { value, description, currency, method, tag } } = props;

    this.state = {
      value,
      description,
      currency,
      method,
      tag,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.addButton = this.addButton.bind(this);
    this.handleMCancel = this.handleMCancel.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  handleChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  async handleClick() {
    const { addExpense, setForm, allCurrency } = this.props;
    const { tag, method } = this.state;

    const newExpense = await addNewExpense(
      localStorage.getItem(localStorageVarNames.jwtToken),
      {
        ...this.state,
        method: paymentMethods[method],
        tag: Tags[tag],
        exchangeRates: Object.values(allCurrency),
      },
    );

    if (newExpense) addExpense(newExpense);
    this.setState({ ...DEFAULT_STATE });

    if (window.innerWidth < PHONE_WIDTH_PX) {
      setForm(false);
    }
  }

  async handleEditClick() {
    const {
      expenseToEdit: { expenseId, exchangeRates },
      expenses,
      modifyExpense,
      editExpenseStatus,
      setForm,
    } = this.props;
    const { tag, method } = this.state;

    const modifiedExpenses = expenses.filter((item) => item.expenseId !== expenseId);
    const editedExpense = await editExpense(
      expenseId,
      {
        expenseId,
        ...this.state,
        exchangeRates,
        tag: Tags[tag],
        method: paymentMethods[method],
      },
      localStorage.getItem(localStorageVarNames.jwtToken),
    );
    const expensesWithEditedExpense = [editedExpense, ...modifiedExpenses];
    modifyExpense(expensesWithEditedExpense);
    editExpenseStatus();

    if (window.innerWidth < PHONE_WIDTH_PX) {
      setForm(false);
    }
  }

  handleMCancel() {
    const { setForm, edit: boolEdit, editExpenseStatus } = this.props;
    setForm(false);
    return boolEdit && editExpenseStatus();
  }

  addButton(text) {
    const { value } = this.state;

    return (
      <Button
        text={ `${text} despesa` }
        handleClick={ text === 'Editar' ? this.handleEditClick : this.handleClick }
        status={ value.length === 0 }
      />
    );
  }

  render() {
    const { value, description, currency, method, tag } = this.state;
    const { allCurrency, edit: boolEdit, editExpenseStatus, mobileType } = this.props;
    const initials = Object.keys(allCurrency);

    return (
      <>
        <Input
          labelText="Valor"
          type="number"
          name="value"
          handleChange={ this.handleChange }
          value={ value }
        />
        <Input
          labelText="Descrição"
          type="text"
          name="description"
          handleChange={ this.handleChange }
          value={ description }
          maxL="13"
        />
        <Select
          text="Moeda"
          name="currency"
          item={ initials }
          handleChange={ this.handleChange }
          value={ currency }
        />
        <Select
          text="Método"
          name="method"
          item={ Object.keys(paymentMethods) }
          handleChange={ this.handleChange }
          value={ method }
        />
        <Select
          text="Tag"
          name="tag"
          item={ Object.keys(Tags) }
          handleChange={ this.handleChange }
          value={ tag }
        />
        { !boolEdit ? this.addButton('Adicionar') : this.addButton('Editar') }
        { mobileType && <Button text="Cancelar" handleClick={ this.handleMCancel } /> }
        { boolEdit && !mobileType
          && <Button text="Cancelar" handleClick={ () => editExpenseStatus() } /> }
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allCurrency: state.wallet.currencies[0],
  expenses: state.wallet.expenses,
  edit: state.editExpense.edit,
  mobileType: state.checkScreen.mobileType,
});

const mapDispatchToProps = (dispatch) => ({
  addExpense: (infos) => dispatch(expense(infos)),
  modifyExpense: (expenses) => dispatch(modifyExpenses(expenses)),
  editExpenseStatus: (item) => dispatch(edit(item)),
  setForm: (status) => dispatch(setFormStatus(status)),
});

Form.defaultProps = {
  allCurrency: {},
  expenseToEdit: { ...DEFAULT_STATE },
};

Form.propTypes = {
  allCurrency: PropTypes.objectOf(PropTypes.object),
  addExpense: PropTypes.func.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.object).isRequired,
  expenseToEdit: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    currency: PropTypes.string,
    method: PropTypes.string,
    tag: PropTypes.string,
    expenseId: PropTypes.string,
    exchangeRates: PropTypes.arrayOf(PropTypes.object),
  }),
  edit: PropTypes.bool.isRequired,
  modifyExpense: PropTypes.func.isRequired,
  editExpenseStatus: PropTypes.func.isRequired,
  setForm: PropTypes.func.isRequired,
  mobileType: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);
