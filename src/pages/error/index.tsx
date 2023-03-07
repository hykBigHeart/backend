import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.less";

export const ErrorPage: React.FC<any> = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="您访问的页面不存在"
      className={styles["main"]}
      extra={
        <Button
          type="primary"
          onClick={() => {
            navigate("/");
          }}
        >
          返回首页
        </Button>
      }
    />
  );
};
