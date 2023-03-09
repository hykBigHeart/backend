import React, { useEffect, useState } from "react";
import {
  MailOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
//导出路由跳转hooks函数
import { useNavigate, Link, useLocation } from "react-router-dom";
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
  getItem("分类管理", "/resource-category", <MailOutlined />, null, null),
  getItem("课程管理", "/course", <AppstoreOutlined />, null, null),
  getItem(
    "资源管理",
    "3",
    <MailOutlined />,
    [
      getItem("视频", "/videos", null, null, null),
      getItem("图片", "/images", null, null, null),
    ],
    null
  ),
  getItem(
    "学员管理",
    "4",
    <AppstoreOutlined />,
    [
      getItem("学员", "/member", null, null, null),
      getItem("部门", "/department", null, null, null),
    ],
    null
  ),
  getItem(
    "系统设置",
    "6",
    <SettingOutlined />,
    [
      getItem("管理人员", "/system/administrator", null, null, null),
      getItem("角色配置", "/system/adminroles", null, null, null),
    ],
    null
  ),
];

export const LeftMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 默认展开的subMenu
  const [openKeys, setOpenKeys] = useState(["1"]);
  // 默认选中的menu
  const [selectedKeys, setSelectedKeys] = useState(["/"]);
  //点击subMenu的回调函数
  const onOpenChange = (keys: any) => {
    setOpenKeys(keys);
  };
  const onClick = (e: any) => {
    navigate(e.key);
  };
  const onSelect = (e: any) => {
    setSelectedKeys(e.selectedKeys);
  };

  // 监听菜单变化如果通过非直接点击『主面板』菜单进入到首页的话
  // 则重置菜单的选择状态
  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedKeys(["/"]);
    }
  }, [location]);

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
        defaultSelectedKeys={["/"]}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        mode="inline"
        items={items}
        onSelect={onSelect}
      />
    </div>
  );
};
