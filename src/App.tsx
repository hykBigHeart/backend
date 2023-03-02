import React from "react";
import styles from "./App.module.css";
import { useLocation, useRoutes, useNavigate } from "react-router-dom";
import routes from "./router/routes";
import { getToken } from "./utils/index";

function App() {
  const Views = () => useRoutes(routes);
  // const CheckLogin = () => {
  //   const navigate = useNavigate();
  //   const location = useLocation();
  //   if (location.pathname !== "/login") {
  //     navigate("/login");
  //   }
  // };
  // const token = getToken();
  // if (!token) {
  //   CheckLogin();
  // }
  return (
    <div className={styles.App}>
      <Views />
    </div>
  );
}

export default App;
