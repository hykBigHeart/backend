import React from "react";
import styles from "./Footer.module.less";
import { Layout, Typography } from "antd";

export const Footer: React.FC = () => {
  return (
    <Layout.Footer
      style={{ backgroundColor: "#0F0A1E", height: 103, paddingTop: 30 }}
    >
      <Typography.Title
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "#FFFFFF",
          opacity: 0.3,
        }}
      >
        © 2021 PlayEdu • 粤ICP备20026280号-01
      </Typography.Title>
      <Typography.Title
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "#FFFFFF",
          opacity: 0.3,
          marginTop: 19,
        }}
      >
        Powered By 杭州白书科技
      </Typography.Title>
    </Layout.Footer>
  );
};
