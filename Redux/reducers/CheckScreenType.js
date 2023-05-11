import { SET_DETAILS_STATUS, SET_FORM_STATUS, SET_SCREEN } from '../actions';

const INITIAL_STATE = {
  mobileType: true,
  formStatus: false,
  mobileDetailsStatus: false,
};

function checkScreen(state = INITIAL_STATE, action) {
  switch (action.type) {
  case SET_SCREEN:
    return { ...state, mobileType: action.phoneStatus };
  case SET_FORM_STATUS:
    return { ...state, formStatus: action.status };
  case SET_DETAILS_STATUS:
    return { ...state, mobileDetailsStatus: !state.mobileDetailsStatus };
  default:
    return state;
  }
}

export default checkScreen;
