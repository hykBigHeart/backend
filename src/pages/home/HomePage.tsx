import React, { useEffect } from "react";
import styles from "./HomePage.module.css";
import { Header, Footer } from "../../compenents";
import { login } from "../../api/index";

export const HomePage: React.FC = () => {
  useEffect(() => {
    login.login("1@qq.com", "123123", "1", "2");
  }, []);

  return (
    <>
      <Header></Header>
      <div className={styles["page-content"]}>主页</div>
      <Footer></Footer>
    </>
  );
};
