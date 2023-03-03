import {
  UserLoginAction,
  IS_LOGIN,
  LOGIN_OUT,
  SET_USER,
  SET_PERMISSSIONS,
} from "./userActions";

interface UserState {
  permisssions: any[];
  user: any[];
  isLogin: boolean;
}
export const defaultState: UserState = {
  isLogin: false,
  permisssions: [],
  user: [],
};

export default (state = defaultState, action: UserLoginAction) => {
  switch (action.type) {
    case IS_LOGIN:
      return { ...state, isLogin: true };
    case LOGIN_OUT:
      return { ...state, isLogin: false, user: [], permisssions: [] };
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_PERMISSSIONS:
      return { ...state, permisssions: action.payload };
    default:
      return state;
  }
};
