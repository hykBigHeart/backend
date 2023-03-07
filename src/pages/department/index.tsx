import React, { useState, useEffect } from "react";
import { Button, Space, Table, Popconfirm, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "./index.module.less";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { department } from "../../api/index";
import { dateFormat } from "../../utils/index";
import { Link, useNavigate } from "react-router-dom";

interface Option {
  id: string | number;
  name: string;
  created_at: string;
  children?: Option[];
  sort: number;
}

interface DataType {
  id: React.Key;
  name: string;
  created_at: string;
  sort: number;
}

export const DepartmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [list, setList] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [tableKey, setTableKey] = useState<number>(0);

  const columns: ColumnsType<DataType> = [
    {
      title: "部门名",
      dataIndex: "name",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "ID",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Sort",
      key: "sort",
      dataIndex: "sort",
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
            onClick={() => navigate(`/department/update/${record.id}`)}
          >
            详情
          </Button>
          <Popconfirm
            title="警告"
            description="即将删除此部门，确认操作？"
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
    department.departmentList().then((res: any) => {
      const departments = res.data.departments;
      const new_arr: Option[] = checkArr(departments, 0);
      let num = tableKey;
      setList(new_arr);
      setTimeout(() => {
        setLoading(false);
        setTableKey(num + 1);
      }, 1000);
    });
  };

  const checkArr = (departments: any[], id: number) => {
    const arr = [];
    for (let i = 0; i < departments[id].length; i++) {
      if (!departments[departments[id][i].id]) {
        arr.push({
          name: departments[id][i].name,
          id: departments[id][i].id,
          sort: departments[id][i].sort,
          created_at: departments[id][i].created_at,
        });
      } else {
        const new_arr: Option[] = checkArr(departments, departments[id][i].id);
        arr.push({
          name: departments[id][i].name,
          id: departments[id][i].id,
          created_at: departments[id][i].created_at,
          sort: departments[id][i].sort,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const resetData = () => {
    setList([]);
    setRefresh(!refresh);
  };

  const delUser = (id: any) => {
    department.destroyDepartment(id).then((res: any) => {
      setTimeout(() => {
        message.success("操作成功");
        setRefresh(!refresh);
      }, 1000);
    });
  };

  return (
    <>
      <div className="playedu-main-body">
        <div className="float-left j-b-flex mb-24">
          <div className="d-flex">
            <Link style={{ textDecoration: "none" }} to={`/department/create`}>
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
            key={tableKey}
            columns={columns}
            dataSource={list}
            loading={loading}
            rowKey={(record) => record.id}
            defaultExpandAllRows={true}
          />
        </div>
      </div>
    </>
  );
};
