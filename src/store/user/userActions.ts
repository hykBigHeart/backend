import { message } from "antd";

export const IS_LOGIN = "IS_LOGIN";
export const LOGIN_OUT = "LOGIN_OUT";
export const SET_USER = "SET_USER";
export const SET_PERMISSSIONS = "SET_PERMISSSIONS";

interface IsLoginAction {
  type: typeof IS_LOGIN;
}

interface LoginOutAction {
  type: typeof LOGIN_OUT;
}

interface SetUserAction {
  type: typeof SET_USER;
  payload: any;
}

interface SetPermisssionsAction {
  type: typeof SET_PERMISSSIONS;
  payload: any;
}

export type UserLoginAction =
  | IsLoginAction
  | LoginOutAction
  | SetUserAction
  | SetPermisssionsAction;

export const IsLoginActionCreator = (): IsLoginAction => {
  return {
    type: IS_LOGIN,
  };
};

export const LoginOutActionCreator = (): LoginOutAction => {
  message.success("已退出登录");
  return {
    type: LOGIN_OUT,
  };
};

export const SetUserActionCreator = (data: any): SetUserAction => {
  return {
    type: SET_USER,
    payload: data,
  };
};

export const SetPermisssionsActionCreator = (
  data: any
): SetPermisssionsAction => {
  return {
    type: SET_PERMISSSIONS,
    payload: data,
  };
};
