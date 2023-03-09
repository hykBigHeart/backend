import React, { useState } from "react";
import {
  MailOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
//导出路由跳转hooks函数
import { useNavigate, Link } from "react-router-dom";
import styles from "./index.module.less";
import logo from "../../assets/logo.png";

function getItem(label: any, key: any, icon: any, children: any, type: any) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem("首页概览", "/", <SettingOutlined />, null, null),
  getItem(
    "课程内容",
    "8",
    <AppstoreOutlined />,
    [getItem("课程", "/course", null, null, null)],
    null
  ),
  getItem(
    "资源管理",
    "3",
    <MailOutlined />,
    [
      getItem("资源分类", "/resource-category", null, null, null),
      getItem("视频", "/videos", null, null, null),
      getItem("图片", "/images", null, null, null),
    ],
    null
  ),
  getItem(
    "学员管理",
    "4",
    <AppstoreOutlined />,
    [getItem("学员", "/member", null, null, null)],
    null
  ),
  getItem(
    "部门管理",
    "7",
    <AppstoreOutlined />,
    [getItem("部门", "/department", null, null, null)],
    null
  ),
  getItem(
    "系统设置",
    "6",
    <SettingOutlined />,
    [getItem("管理人员", "/system/administrator", null, null, null)],
    null
  ),
];

export const LeftMenu: React.FC = () => {
  //展开的subMenu
  const [openKeys, setOpenKeys] = useState(["1"]);
  //点击subMenu的回调函数
  const onOpenChange = (keys: any) => {
    setOpenKeys(keys);
  };
  //路由跳转的函数
  const navigate = useNavigate();
  //点击每一项
  const onClick = (e: any) => {
    navigate(e.key);
  };
  return (
    <div className={styles["left-menu"]}>
      <Link style={{ textDecoration: "none" }} to={`/`}>
        <img src={logo} alt="" className={styles["App-logo"]} />
      </Link>
      <Menu
        onClick={onClick}
        style={{
          width: 200,
          background: "#ffffff",
     
        }}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        mode="inline"
        items={items}
      />
    </div>
  );
};
