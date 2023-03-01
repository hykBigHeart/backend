import React from "react";
import styles from "./HomePage.module.css";
import { Header, Footer } from "../../compenents";

export const HomePage: React.FC = () => {
  return (
    <>
      <Header></Header>
      <div className={styles["page-content"]}>主页</div>
      <Footer></Footer>
    </>
  );
};
