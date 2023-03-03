import React from "react";
import styles from "./index.module.less";
import { Layout, Button, Dropdown, MenuProps } from "antd";
import { useSelector } from "../../store/hooks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginOutActionCreator } from "../../store/user/userActions";

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "login_out") {
      dispatch(LoginOutActionCreator());
      navigate("/login");
    } else if (key === "edit_password") {
      navigate("/editPasswor");
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "修改密码",
      key: "edit_password",
    },
    {
      label: "退出登录",
      key: "login_out",
    },
  ];
  return (
    <div className={styles["app-header"]}>
      <Layout.Header className={styles["main-header"]}>
        <div></div>
        <Button.Group className={styles["button-group"]}>
          <Dropdown menu={{ items, onClick }} placement="bottomRight">
            <Button type="link" danger>
              {user.name}
            </Button>
          </Dropdown>
        </Button.Group>
      </Layout.Header>
    </div>
  );
};
