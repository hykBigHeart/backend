import React from "react";
import { Layout } from "antd";
import { Link } from "react-router-dom";

interface PropInterface {
  type?: string;
}

export const Footer: React.FC<PropInterface> = ({ type }) => {
  return (
    <Layout.Footer
      style={{
        width: "100%",
        background: type === "none" ? "none" : "#F6F6F6",
        height: 166,
        paddingTop: 80,
        textAlign: "center",
      }}
    >
      <Link to="https://playedu.xyz/" target="blank">
        <i
          style={{ fontSize: 30, color: "#cccccc" }}
          className="iconfont icon-waterprint footer-icon"
          onClick={() => {}}
        ></i>
      </Link>
    </Layout.Footer>
  );
};
