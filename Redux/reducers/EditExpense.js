import { EDIT_EXPENSE } from '../actions';

const INITIAL_STATE = {
  expense: {},
  edit: false,
};

function editExpense(state = INITIAL_STATE, action) {
  switch (action.type) {
  case EDIT_EXPENSE:
    return { edit: !state.edit, expense: action.expense };
  default:
    return state;
  }
}

export default editExpense;
