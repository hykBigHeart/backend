import React, { useState, useEffect } from "react";
import { Typography, Input, Select, Button, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "./index.module.less";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { user } from "../../api/index";

interface DataType {
  id: React.Key;
  nickname: string;
  email: string;
  created_at: string;
  credit1: number;
  is_lock: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: "ID",
    key: "id",
    dataIndex: "id",
  },
  {
    title: "学员昵称",
    dataIndex: "nickname",
    render: (text: string) => <span>{text}</span>,
  },
  {
    title: "邮箱",
    dataIndex: "email",
  },
  {
    title: "积分",
    dataIndex: "credit1",
  },
  {
    title: "注册时间",
    dataIndex: "created_at",
  },
  {
    title: "操作",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Button type="link" danger className="c-red">
          详情
        </Button>
        <Button type="link" danger className="c-red">
          删除
        </Button>
      </Space>
    ),
  },
];

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record: DataType) => ({
    disabled: record.nickname === "Disabled User",
    name: record.nickname,
  }),
};

export const MemberPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [params, setParams] = useState<any>({});

  useEffect(() => {
    getData(1, size);
  }, []);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const getData = (page: number, size: number) => {
    setSize(size);
    setPage(page);
    setLoading(true);
    user.userList(page, size, params).then((res: any) => {
      setList(res.data.data);
      setTotal(res.data.total);
      setTimeout(() => {
        setSelectedRowKeys([]);
        setLoading(false);
      }, 1000);
    });
  };

  const resetData = () => {
    setList([]);
    setParams({});
    setTimeout(() => {
      getData(1, 10);
    }, 500);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const paginationProps = {
    current: page, //当前页码
    pageSize: size,
    total: total, // 总条数
    onChange: (page: number, pageSize: number) =>
      handlePageChange(page, pageSize), //改变页码的函数
    showSizeChanger: true,
  };

  const handlePageChange = (page: number, pageSize: number) => {
    console.log(page, pageSize);
    setTimeout(() => {
      getData(page, pageSize);
    }, 500);
  };

  const hasSelected = selectedRowKeys.length > 0;
  return (
    <>
      <div className="playedu-main-body mb-24">
        <div className="float-left d-flex">
          <div className="d-flex mr-24">
            <Typography.Text>昵称或手机号：</Typography.Text>
            <Input style={{ width: 160 }} placeholder="昵称或手机号" />
          </div>
          <div className="d-flex mr-24">
            <Button className="mr-16" danger onClick={resetData}>
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
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={list}
            loading={loading}
            pagination={paginationProps}
          />
        </div>
      </div>
    </>
  );
};
