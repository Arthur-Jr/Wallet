import { combineReducers } from 'redux';
import checkScreen from './CheckScreenType';
import editExpense from './EditExpense';

import loading from './Loading';
import wallet from './wallet';

const rootReducer = combineReducers({ wallet, loading, editExpense, checkScreen });

export default rootReducer;
