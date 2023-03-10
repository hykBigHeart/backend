import React, { useState, useEffect } from "react";
import { Button, Space, Col, Empty } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "./index.module.less";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { appConfig } from "../../api/index";
import { dateFormat } from "../../utils/index";
import { Link, useNavigate } from "react-router-dom";

interface DataType {
  id: React.Key;
  name: string;
  created_at: string;
}

export const SystemIndexPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [list, setList] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);

  const columns: ColumnsType<DataType> = [
    {
      title: "角色名",
      dataIndex: "name",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "时间",
      dataIndex: "created_at",
      render: (text: string) => <span>{text && dateFormat(text)}</span>,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            danger
            className="b-link c-red"
            onClick={() => navigate(`/system/adminroles/update/${record.id}`)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, [refresh]);

  const getData = () => {
    setLoading(true);
    appConfig.appConfig().then((res: any) => {
      setList(res.data);
      setLoading(false);
    });
  };

  const resetData = () => {
    setList([]);
    setRefresh(!refresh);
  };

  return (
    <>
      <div className="playedu-main-body">
        <div className={styles["title"]}>基本配置</div>
        {list.length === 0 && (
          <Col span={24}>
            <Empty description="暂无配置" />
          </Col>
        )}
        <div className={styles["body"]}>
          {list.map((item: any, index: number) => {
            return (
              <div key={index} className={styles["item"]}>
                <img src={item.images} />
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
