import React, { useEffect } from "react";
import { Menu } from "antd";
//导出路由跳转hooks函数
import { useNavigate, Link, useLocation } from "react-router-dom";
import styles from "./index.module.less";
import logo from "../../assets/logo.png";
import "../../assets/iconfont/iconfont.css";

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
  getItem(
    "首页概览",
    "/",
    <i className="iconfont icon-icon-home" />,
    null,
    null
  ),
  getItem(
    "分类管理",
    "/resource-category",
    <i className="iconfont icon-icon-category" />,
    null,
    null
  ),
  getItem(
    "资源管理",
    "3",
    <i className="iconfont icon-icon-file" />,
    [
      getItem("视频", "/videos", null, null, null),
      getItem("图片", "/images", null, null, null),
    ],
    null
  ),
  getItem(
    "课程中心",
    "4",
    <i className="iconfont icon-icon-study" />,
    [getItem("线上课", "/course", null, null, null)],
    null
  ),
  getItem(
    "学员管理",
    "5",
    <i className="iconfont icon-icon-user" />,
    [
      getItem("学员", "/member", null, null, null),
      getItem("部门", "/department", null, null, null),
    ],
    null
  ),
  getItem(
    "系统设置",
    "6",
    <i className="iconfont icon-icon-setting" />,
    [
      getItem("管理人员", "/system/administrator", null, null, null),
      getItem("系统配置", "/system/index", null, null, null),
      getItem("角色配置", "/system/adminroles", null, null, null),
    ],
    null
  ),
];

const children2Parent: any = {
  "/videos": ["3"],
  "/images": ["3"],

  "/member": ["4"],
  "/department": ["4"],

  "/course": ["5"],

  "/system/administrator": ["6"],
  "/system/adminroles": ["6"],
  "/system/index": ["6"],
};

export const LeftMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  let defaultSelectedKeys: string[] = [location.pathname];
  let defaultOpenKeys: string[] = [];
  if (children2Parent[location.pathname]) {
    defaultOpenKeys = children2Parent[location.pathname];
  }

  const onClick = (e: any) => {
    navigate(e.key);
  };

  useEffect(() => {}, [location]);

  return (
    <div className={styles["left-menu"]}>
      <div
        style={{
          textDecoration: "none",
          cursor: "pointer",
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#fff",
        }}
        onClick={() => {
          window.location.href = "/";
        }}
      >
        <img src={logo} className={styles["App-logo"]} />
      </div>
      <Menu
        onClick={onClick}
        style={{
          width: 200,
          background: "#ffffff",
        }}
        defaultSelectedKeys={defaultSelectedKeys}
        defaultOpenKeys={defaultOpenKeys}
        mode="inline"
        items={items}
      />
    </div>
  );
};
