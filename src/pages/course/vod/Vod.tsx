import React, { useEffect } from "react";
import { Typography, Input, Select, Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "./Vod.module.css";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { login } from "../../../api/index";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <span>{text}</span>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
];

export const VodListPage: React.FC = () => {
  useEffect(() => {
    
  }, []);
  const handleChange = (e: any) => {
    console.log(e);
  };
  return (
    <>
      <div className="playedu-main-body mb-24">
        <div className="float-left d-flex">
          <div className="d-flex mr-24">
            <Typography.Text>课程名称：</Typography.Text>
            <Input style={{ width: 160 }} placeholder="请输入课程关键字" />
          </div>
          <div className="d-flex mr-24">
            <Typography.Text>课程分类：</Typography.Text>
            <Select
              placeholder="请选择课程分类"
              style={{ width: 160 }}
              onChange={handleChange}
              options={[
                { value: "jack", label: "Jack" },
                { value: "lucy", label: "Lucy" },
                { value: "Yiminghe", label: "yiminghe" },
              ]}
            />
          </div>
          <div className="d-flex mr-24">
            <Button className="mr-16" danger>
              重 置
            </Button>
            <Button type="primary" danger>
              查 询
            </Button>
          </div>
        </div>
      </div>
      <div className="playedu-main-body">
        <div className="float-left j-b-flex mb-24">
          <div className="d-flex">
            <Button
              icon={<PlusOutlined />}
              className="mr-16"
              type="primary"
              danger
            >
              新建
            </Button>
            <Button danger>删除</Button>
          </div>
          <div className="d-flex">
            <Button
              type="link"
              icon={<ReloadOutlined />}
              style={{ color: "#333333" }}
            ></Button>
          </div>
        </div>
        <div className="float-left">
          <Table columns={columns} dataSource={data} />
        </div>
      </div>
    </>
  );
};
