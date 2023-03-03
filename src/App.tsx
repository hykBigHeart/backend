import styles from "./App.module.less";
import { useRoutes } from "react-router-dom";
import routes from "./router/routes";
import { getToken } from "./utils/index";
import { login } from "./api/index";
import { useDispatch } from "react-redux";
import {
  IsLoginActionCreator,
  SetUserActionCreator,
  SetPermisssionsActionCreator,
} from "./store/user/userActions";

function App() {
  const Views = () => useRoutes(routes);
  const dispatch = useDispatch();
  const getUser = () => {
    login.getUser().then((res: any) => {
      const data = res.data;
      dispatch(IsLoginActionCreator());
      dispatch(SetUserActionCreator(data.user));
      dispatch(SetPermisssionsActionCreator(data.permissions));
    });
  };
  if (getToken()) {
    getUser();
  }

  return (
    <div className={styles.App}>
      <Views />
    </div>
  );
}

export default App;
