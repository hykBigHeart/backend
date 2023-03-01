import React from "react";
import styles from "./Header.module.css";
import logo from "../../assets/logo.svg";
import { Layout, Typography, Menu, Button, Dropdown, MenuProps } from "antd";
import { Link } from "react-router-dom";



export const Header: React.FC = () => {


  return (
    <div className={styles["app-header"]}>
      <Layout.Header className={styles["main-header"]}>
        <Link
          className={styles["top-main"]}
          style={{ textDecoration: "none" }}
          to={`/`}
        >
          <img src={logo} alt="" className={styles["App-logo"]} />
        </Link>
        <Button.Group className={styles["button-group"]}>
          <Link style={{ textDecoration: "none" }} to={`/login`}>
            <Button>登录</Button>
          </Link>
        </Button.Group>
      </Layout.Header>
    </div>
  );
};
