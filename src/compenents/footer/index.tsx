import React from "react";
import { Layout } from "antd";

export const Footer: React.FC = () => {
  return (
    <Layout.Footer
      style={{
        width: "100%",
        backgroundColor: "#F6F6F6",
        height: 232,
        paddingTop: 80,
        textAlign: "center",
      }}
    >
      <i
        style={{ fontSize: 30, color: "#cccccc" }}
        className="iconfont icon-waterprint"
      ></i>
    </Layout.Footer>
  );
};
