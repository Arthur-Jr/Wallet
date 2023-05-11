import { LOGGED_INFO } from '../actions';

const INITIAL_STATE = { email: '' };

function user(state = INITIAL_STATE, action) {
  switch (action.type) {
  case LOGGED_INFO:
    return { email: action.email };
  default:
    return state;
  }
}

export default user;
