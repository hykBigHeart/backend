import React, { useState, useEffect } from "react";
import { Button, Space, Table, Popconfirm, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "./index.module.less";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { adminRole } from "../../../api/index";
import { dateFormat } from "../../../utils/index";
import { Link, useNavigate } from "react-router-dom";
import { BackBartment } from "../../../compenents";

interface DataType {
  id: React.Key;
  name: string;
  created_at: string;
}

export const SystemAdminrolesPage: React.FC = () => {
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
            className="c-red"
            onClick={() => navigate(`/system/adminroles/update/${record.id}`)}
          >
            详情
          </Button>
          <Popconfirm
            title="警告"
            description="即将删除此角色，确认操作？"
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
  }, [refresh]);

  const getData = () => {
    setLoading(true);
    adminRole.adminRoleList().then((res: any) => {
      setList(res.data);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
  };

  const resetData = () => {
    setList([]);
    setRefresh(!refresh);
  };

  const delUser = (id: any) => {
    adminRole.destroyAdminRole(id).then((res: any) => {
      setTimeout(() => {
        message.success("操作成功");
        setRefresh(!refresh);
      }, 1000);
    });
  };

  return (
    <>
      <div className="playedu-main-body">
        <div className="float-left mb-24">
          <BackBartment title="管理员角色" />
        </div>
        <div className="float-left j-b-flex mb-24">
          <div className="d-flex">
            <Link
              style={{ textDecoration: "none" }}
              to={`/system/adminroles/create`}
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
            columns={columns}
            dataSource={list}
            loading={loading}
            rowKey={(record) => record.id}
          />
        </div>
      </div>
    </>
  );
};
