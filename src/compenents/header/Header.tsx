import React from "react";
import styles from "./Header.module.css";
import logo from "../../assets/logo.png";
import { Layout, Typography, Menu, Button, Dropdown, MenuProps } from "antd";
import { Link } from "react-router-dom";



export const Header: React.FC = () => {


  return (
    <div className={styles["app-header"]}>
      <Layout.Header className={styles["main-header"]}>
        <div></div>
        <Button.Group className={styles["button-group"]}>
          <Link style={{ textDecoration: "none" }} to={`/login`}>
            <Button>登录</Button>
          </Link>
        </Button.Group>
      </Layout.Header>
    </div>
  );
};
