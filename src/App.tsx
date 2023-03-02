import React from "react";
import styles from "./App.module.css";
import { useRoutes } from "react-router-dom";
import routes from "./router/routes";

function App() {
  const element = useRoutes(routes);
  return <div className={styles.App}>{element}</div>;
}

export default App;
