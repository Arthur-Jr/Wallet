// Coloque aqui suas actions
export const CURRENCY = 'CURRENCY';
export const LOADING = 'LOADING';
export const ADD_EXPENSE = 'ADD_EXPENSE';
export const MODIFY_EXPENSE = 'MODIFY_EXPENSE';
export const EDIT_EXPENSE = 'EDIT_EXPENSE';
export const SET_SCREEN = 'SET_SCREEN';
export const SET_FORM_STATUS = 'SET_FORM_STATUS';
export const SET_DETAILS_STATUS = 'SET_DETAILS_STATUS';
export const ADD_MULTI_EXPENSES = 'ADD_MULTI_EXPENSES';

export const edit = (expense) => ({ type: EDIT_EXPENSE, expense });

const loading = () => ({ type: LOADING });

const getCurrency = (currencies) => ({ type: CURRENCY, currencies });

export function fetchApi() {
  return async (dispatch) => {
    const response = await fetch('https://economia.awesomeapi.com.br/json/all');
    const result = await response.json();
    delete result.USDT;
    dispatch(getCurrency(result));
    dispatch(loading());
  };
  // Pesquisei sobre o delete(linha 18), neste link:
  // https://stackoverflow.com/questions/6295087/how-to-remove-item-from-a-javascript-object
}

export const expense = (infos) => ({ type: ADD_EXPENSE, infos });

export const addMultiExpenses = (expenses) => ({ type: ADD_MULTI_EXPENSES, expenses });

export const modifyExpenses = (expenses) => ({ type: MODIFY_EXPENSE, expenses });

export const setScreenType = (phoneStatus) => ({ type: SET_SCREEN, phoneStatus });

export const setFormStatus = (status) => ({ type: SET_FORM_STATUS, status });

export const setDetailsStatus = () => ({ type: SET_DETAILS_STATUS });
