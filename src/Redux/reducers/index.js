import { combineReducers } from 'redux';
import checkScreen from './CheckScreenType';
import editExpense from './EditExpense';

import loading from './Loading';
import user from './user';
import wallet from './wallet';

const rootReducer = combineReducers({ user, wallet, loading, editExpense, checkScreen });

export default rootReducer;
