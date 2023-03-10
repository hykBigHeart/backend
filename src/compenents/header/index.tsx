import React from "react";
import styles from "./index.module.less";
import { Button, Dropdown, MenuProps } from "antd";
import { useSelector } from "../../store/hooks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginOutActionCreator } from "../../store/user/userActions";
import avatar from "../../assets/images/commen/avatar.png";
import { createFromIconfontCN } from "@ant-design/icons";

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_3943555_yvbihmb40xn.js",
});

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "login_out") {
      dispatch(LoginOutActionCreator());
      navigate("/login");
    } else if (key === "change_password") {
      navigate("/change-password");
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "修改密码",
      key: "change_password",
      icon: <IconFont type="icon-icon-password" />,
    },
    {
      label: "退出登录",
      key: "login_out",
      icon: <IconFont type="icon-a-icon-logout" />,
    },
  ];
  return (
    <div className={styles["app-header"]}>
      <div className={styles["main-header"]}>
        <div></div>
        <Button.Group className={styles["button-group"]}>
          <Dropdown menu={{ items, onClick }} placement="bottomRight">
            <div className="d-flex">
              {user.name && (
                <img style={{ width: 30, height: 30 }} src={avatar} />
              )}
              <span className="ml-8 c-admin">{user.name}</span>
            </div>
          </Dropdown>
        </Button.Group>
      </div>
    </div>
  );
};
