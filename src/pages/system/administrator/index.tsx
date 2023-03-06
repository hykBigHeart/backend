import React, { useState, useEffect } from "react";
import {
  Typography,
  Input,
  Select,
  Button,
  Space,
  Table,
  Popconfirm,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "./index.module.less";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { adminUser } from "../../../api/index";
import { dateFormat } from "../../../utils/index";
import { Link, useNavigate } from "react-router-dom";

interface DataType {
  id: React.Key;
  name: string;
  email: string;
  login_at: string;
  login_ip: string;
  is_ban_login: number;
}

export const SystemAdministratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [refresh, setRefresh] = useState(false);

  const [name, setName] = useState<string>("");

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "姓名",
      dataIndex: "name",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "登录邮箱",
      dataIndex: "email",
    },
    {
      title: "登录时间",
      dataIndex: "login_at",
      render: (text: string) => <span>{text && dateFormat(text)}</span>,
    },
    {
      title: "登录IP",
      dataIndex: "login_ip",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "禁止登录",
      dataIndex: "is_ban_login",
      render: (text: number) =>
        text === 0 ? <span>否</span> : <span>是</span>,
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
            className="c-red"
            onClick={() => navigate(`/system/administrator/update/${record.id}`)}
          >
            详情
          </Button>
          <Popconfirm
            title="警告"
            description="即将删除此账号，确认操作？"
            onConfirm={() => delUser(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger className="c-red">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, [refresh, page, size]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const getData = () => {
    setLoading(true);
    adminUser.adminUserList(page, size, name).then((res: any) => {
      setList(res.data.data);
      setTotal(res.data.total);
      setTimeout(() => {
        setSelectedRowKeys([]);
        setLoading(false);
      }, 1000);
    });
  };

  const resetData = () => {
    setName("");
    setPage(1);
    setSize(10);
    setList([]);
    setRefresh(!refresh);
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
    setPage(page);
    setSize(pageSize);
  };

  const delUser = (id: any) => {
    adminUser.destroyAdminUser(id).then((res: any) => {
      setTimeout(() => {
        message.success("操作成功");
        setRefresh(!refresh);
      }, 1000);
    });
  };

  const hasSelected = selectedRowKeys.length > 0;
  return (
    <>
      <div className="playedu-main-body mb-24">
        <div className="float-left d-flex">
          <div className="d-flex mr-24">
            <Typography.Text>姓名：</Typography.Text>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              style={{ width: 160 }}
              placeholder="请输入姓名"
            />
          </div>
          <div className="d-flex mr-24">
            <Button className="mr-16" onClick={resetData}>
              重 置
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setPage(1);
                setRefresh(!refresh);
              }}
            >
              查 询
            </Button>
          </div>
        </div>
      </div>

      <div className="playedu-main-body">
        <div className="float-left j-b-flex mb-24">
          <div className="d-flex">
            <Link
              style={{ textDecoration: "none" }}
              to={`/system/administrator/create`}
            >
              <Button icon={<PlusOutlined />} className="mr-16" type="primary">
                新建
              </Button>
            </Link>
          </div>
          <div className="d-flex">
            <Button
              type="link"
              icon={<ReloadOutlined />}
              style={{ color: "#333333" }}
              onClick={() => {
                setRefresh(!refresh);
              }}
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
            rowKey={(record) => record.id}
          />
        </div>
      </div>
    </>
  );
};
