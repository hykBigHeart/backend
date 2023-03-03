import { createStore, applyMiddleware } from "redux";
import userReducer from "./user/userReducer";
import thunk from "redux-thunk";

const store = createStore(userReducer, applyMiddleware(thunk));
export type RootState = ReturnType<typeof store.getState>;
export default store;
