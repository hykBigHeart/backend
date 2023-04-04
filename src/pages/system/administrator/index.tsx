import React, { useState, useEffect } from "react";
import { Typography, Input, Button, Space, Table, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { adminUser } from "../../../api/index";
import { dateFormat } from "../../../utils/index";
import { useNavigate } from "react-router-dom";
import { TreeAdminroles, PerButton } from "../../../compenents";
import { SystemAdministratorCreate } from "./compenents/create";
import { SystemAdministratorUpdate } from "./compenents/update";
import { SystemAdminrolesCreate } from "../adminroles/compenents/create";
import { SystemAdminrolesUpdate } from "../adminroles/compenents/update";

const { confirm } = Modal;

interface DataType {
  id: React.Key;
  name: string;
  email: string;
  login_at: string;
  login_ip: string;
  is_ban_login: number;
}

const SystemAdministratorPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [list, setList] = useState<any>([]);
  const [roles, setRoles] = useState<any>([]);
  const [userRoleIds, setUserRoleIds] = useState<any>({});
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [createVisible, setCreateVisible] = useState<boolean>(false);
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [createRoleVisible, setCreateRoleVisible] = useState<boolean>(false);
  const [updateRoleVisible, setUpdateRoleVisible] = useState<boolean>(false);
  const [cid, setCid] = useState<number>(0);
  const [role_ids, setRoleIds] = useState<any>([]);
  const [selLabel, setLabel] = useState<string>("全部管理员");

  const [name, setName] = useState<string>("");

  const columns: ColumnsType<DataType> = [
    {
      title: "管理员",
      dataIndex: "name",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "角色",
      dataIndex: "id",
      render: (id: number) => (
        <div className="float-left">
          {userRoleIds[id] &&
            userRoleIds[id].map((item: any, index: number) => {
              return (
                <span key={index}>
                  {index === userRoleIds[id].length - 1
                    ? roles[item][0].name
                    : roles[item][0].name + "、"}
                </span>
              );
            })}
        </div>
      ),
    },
    {
      title: "登录邮箱",
      dataIndex: "email",
    },
    {
      title: "登录IP",
      dataIndex: "login_ip",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "上次登录时间",
      dataIndex: "login_at",
      render: (text: string) => <span>{text && dateFormat(text)}</span>,
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
          <PerButton
            type="link"
            text="编辑"
            class="b-link c-red"
            icon={null}
            p="admin-user-cud"
            onClick={() => {
              setCid(Number(record.id));
              setUpdateVisible(true);
            }}
            disabled={null}
          />
          <div className="form-column"></div>
          <PerButton
            type="link"
            text="删除"
            class="b-link c-red"
            icon={null}
            p="admin-user-cud"
            onClick={() => delUser(record.id)}
            disabled={null}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, [refresh, page, size, role_ids]);

  const getData = () => {
    setLoading(true);
    adminUser.adminUserList(page, size, name, role_ids[0]).then((res: any) => {
      setList(res.data.data);
      setRoles(res.data.roles);
      setUserRoleIds(res.data.user_role_ids);
      setTotal(res.data.total);
      setLoading(false);
    });
  };

  const resetData = () => {
    setName("");
    setPage(1);
    setSize(10);
    setList([]);
    setRefresh(!refresh);
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
    if (id === 0) {
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除此人员？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        adminUser.destroyAdminUser(id).then((res: any) => {
          message.success("操作成功");
          setRefresh(!refresh);
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <>
      <div className="tree-main-body">
        <div className="left-box">
          <TreeAdminroles
            type=""
            text={"管理员"}
            onUpdate={(keys: any, title: any) => {
              setRoleIds(keys);
              setLabel(title);
            }}
          />
        </div>
        <div className="right-box">
          <div className="d-flex playedu-main-title float-left mb-24">
            {selLabel}
          </div>
          <div className="float-left j-b-flex mb-24">
            <div className="d-flex">
              <PerButton
                text="新建角色"
                icon={<PlusOutlined />}
                class="mr-16"
                type="primary"
                p="admin-role"
                onClick={() => setCreateRoleVisible(true)}
                disabled={null}
              />
              <PerButton
                type="default"
                text="添加管理员"
                class="mr-16"
                icon={null}
                p="admin-user-cud"
                onClick={() => setCreateVisible(true)}
                disabled={null}
              />
            </div>
            <div className="d-flex">
              <div className="d-flex mr-24">
                <Typography.Text>管理员姓名：</Typography.Text>
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  style={{ width: 160 }}
                  placeholder="请输入管理员姓名"
                />
              </div>
              <div className="d-flex">
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
                {role_ids.length > 0 && (
                  <PerButton
                    text="角色权限"
                    icon={null}
                    class="ml-16"
                    type="default"
                    p="admin-role"
                    onClick={() => {
                      setUpdateRoleVisible(true);
                    }}
                    disabled={null}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="float-left">
            <Table
              columns={columns}
              dataSource={list}
              loading={loading}
              pagination={paginationProps}
              rowKey={(record) => record.id}
            />
            <SystemAdministratorCreate
              roleId={role_ids[0]}
              open={createVisible}
              onCancel={() => {
                setCreateVisible(false);
                setRefresh(!refresh);
              }}
            />
            <SystemAdministratorUpdate
              id={cid}
              open={updateVisible}
              onCancel={() => {
                setUpdateVisible(false);
                setRefresh(!refresh);
              }}
            />
            <SystemAdminrolesCreate
              open={createRoleVisible}
              onCancel={() => {
                setCreateRoleVisible(false);
                setRefresh(!refresh);
              }}
            />
            <SystemAdminrolesUpdate
              id={role_ids[0]}
              open={updateRoleVisible}
              onCancel={() => {
                setUpdateRoleVisible(false);
                setRefresh(!refresh);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SystemAdministratorPage;
