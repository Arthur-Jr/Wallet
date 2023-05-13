import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import editIcon from '../Image/Edit.png';
import deleteIcon from '../Image/Delete.png';
import { modifyExpenses,
  edit, setDetailsStatus, setFormStatus } from '../Redux/actions/index';

const PHONE_WIDTH_PX = 650;

class DeleteEditButtons extends React.Component {
  handleEdit(id) {
    const { expenses, editExpense, setDetails, setForm } = this.props;
    const newEdit = expenses.find((expense) => (
      expense.id === id
    ));
    editExpense(newEdit);

    if (window.innerWidth < PHONE_WIDTH_PX) {
      setDetails();
      setForm(true);
    }
  }

  handleDelete(id) {
    const { expenses, modifyExpense, setDetails } = this.props;
    const newExpenses = expenses.filter((expense) => (
      expense.id !== id
    ));
    modifyExpense(newExpenses);

    if (window.innerWidth < PHONE_WIDTH_PX) {
      setDetails();
    }
  }

  render() {
    const { expenseId } = this.props;
    return (
      <>
        <button
          type="button"
          data-testid="edit-btn"
          onClick={ () => this.handleEdit(expenseId) }
          className="edit-btn"
        >
          <img src={ editIcon } alt="Edit Icon" />
        </button>

        <button
          type="button"
          data-testid="delete-btn"
          onClick={ () => this.handleDelete(expenseId) }
          className="delete-btn"
        >
          <img src={ deleteIcon } alt="delete Icon" />
        </button>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
});

const mapDispatchToProps = (dispatch) => ({
  modifyExpense: (expenses) => dispatch(modifyExpenses(expenses)),
  editExpense: (expense) => dispatch(edit(expense)),
  setDetails: () => dispatch(setDetailsStatus()),
  setForm: (status) => dispatch(setFormStatus(status)),
});

DeleteEditButtons.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.object).isRequired,
  modifyExpense: PropTypes.func.isRequired,
  editExpense: PropTypes.func.isRequired,
  expenseId: PropTypes.string.isRequired,
  setDetails: PropTypes.func.isRequired,
  setForm: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteEditButtons);
