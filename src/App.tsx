import { Suspense } from "react";
import styles from "./App.module.less";
import { useRoutes } from "react-router-dom";
import routes from "./routes";
import { getToken } from "./utils/index";
import { login } from "./api/index";
import { useDispatch } from "react-redux";
import {
  IsLoginActionCreator,
  SetUserActionCreator,
  SetPermisssionsActionCreator,
} from "./store/user/userActions";
import LoadingPage from "./pages/loading";

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
    <Suspense fallback={<LoadingPage />}>
      <div className={styles.App}>
        <Views />
      </div>
    </Suspense>
  );
}

export default App;
