import { ADD_EXPENSE, CURRENCY, MODIFY_EXPENSE, ADD_MULTI_EXPENSES } from '../actions';

const INITIAL_STATE = {
  currencies: [],
  expenses: [],
};

function wallet(state = INITIAL_STATE, action) {
  switch (action.type) {
  case CURRENCY:
    return { ...state, currencies: [action.currencies] };
  case ADD_EXPENSE:
    return { ...state, expenses: [...state.expenses, action.infos] };
  case ADD_MULTI_EXPENSES:
    return { ...state, expenses: [...state.expenses, ...action.expenses] };
  case MODIFY_EXPENSE:
    return { ...state, expenses: [...action.expenses] };
  default:
    return state;
  }
}

export default wallet;
