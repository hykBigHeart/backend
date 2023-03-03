import React, { useEffect } from "react";
import styles from "./HomePage.module.less";
import { Outlet, useNavigate } from "react-router-dom";
import { Header, LeftMenu, Footer } from "../../compenents";
import { login } from "../../api/index";


export const HomePage: React.FC = () => {
  useEffect(() => {
   
  }, []);

  return (
    <>
      <div className={styles["layout-wrap"]}>
        <div className={styles["left-menu"]}>
          <LeftMenu />
        </div>
        <div className={styles["right-cont"]}>
          <div className={styles["right-top"]}>
            <Header></Header>
          </div>
          <div className={styles["right-main"]}>
            {/* 二级路由出口 */}
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
