import { createStore } from "redux";
interface IAction {
  type: string;
  payload?: any;
}
interface IState {
  isshow: boolean;
}
const reducer = (
  preState: IState = {
    isshow: false,
  },
  action: IAction
) => {
  const { type } = action;
  const newState = { ...preState };
  switch (type) {
    case "show":
      newState.isshow = true;
      return newState;
    case "hidden":
      newState.isshow = false;
      return newState;
    default:
      return preState;
  }
};
const store = createStore(reducer);
export default store;
