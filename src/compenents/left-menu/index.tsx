import React, { useEffect } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
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
  getItem(
    "首页概览",
    "/",
    <i className={`iconfont icon-icon-home`} />,
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
    "resource",
    <i className="iconfont icon-icon-file" />,
    [
      getItem("视频", "/videos", null, null, null),
      getItem("图片", "/images", null, null, null),
    ],
    null
  ),
  getItem(
    "课程中心",
    "courses",
    <i className="iconfont icon-icon-study" />,
    [getItem("线上课", "/course", null, null, null)],
    null
  ),
  getItem(
    "学员管理",
    "user",
    <i className="iconfont icon-icon-user" />,
    [
      getItem("学员", "/member", null, null, null),
      getItem("部门", "/department", null, null, null),
    ],
    null
  ),
  getItem(
    "系统设置",
    "system",
    <i className="iconfont icon-icon-setting" />,
    [
      getItem("系统配置", "/system/index", null, null, null),
      getItem("管理人员", "/system/administrator", null, null, null),
      getItem("角色配置", "/system/adminroles", null, null, null),
    ],
    null
  ),
];

const children2Parent: any = {
  "^/video": ["resource"],
  "^/image": ["resource"],
  "^/member": ["user"],
  "^/department": ["user"],
  "^/course": ["courses"],
  "^/system": ["system"],
};

export const LeftMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  let defaultSelectedKeys: string[] = [location.pathname];
  let defaultOpenKeys: string[] = [];
  if (children2Parent[location.pathname]) {
    defaultOpenKeys = children2Parent[location.pathname];
  }
  for (let p in children2Parent) {
    if (location.pathname.search(p) >= 0) {
      defaultOpenKeys = children2Parent[p];
      break;
    }
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
