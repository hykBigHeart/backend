import React, { useState, useEffect } from "react";
import {
  Space,
  Button,
  Drawer,
  Form,
  message,
  Modal,
  Table,
  Image,
  Tag
} from "antd";
import type { ColumnsType } from "antd/es/table";

import { group, user } from "../../../api/index";
import { dateFormat } from "../../../utils/index";
import { PlusOutlined } from "@ant-design/icons";
import { SelectUsers } from "./selectUsers"

interface DataType {
  id: React.Key;
  name: string;
  description: string;
  sort: number;
  created_at: string
}

interface PropInterface {
  groupId: React.Key,
  groupName: string,
  open: boolean;
  onCancel: () => void;
}

export const GroupUsers: React.FC<PropInterface> = ({
  groupId,
  groupName,
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("open");

  const [list, setList] = useState<DataType[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectUsersVisible, setSelectUsersVisible] = useState<boolean>(false);
  const [user_dep_ids, setUserDepIds] = useState<DepIdsModel>({});
  const [departments, setDepartments] = useState<DepartmentsModel>({});
  const [pureTotal, setPureTotal] = useState(0);
  const [depUserCount, setDepUserCount] = useState<KeyNumberObject>();


  useEffect(() => {
    if (open) {
      getData()
    }
  }, [form, open]);

  const getData = ()=> {
    setLoading(true)
    // group.groupUsers(groupId).then((res: any) => {
    //   console.log('res',res);
    // })
    user.userList(page, size, {
      name: '',
      email: '',
      dep_ids: 22,
    }).then((res: any) => {
      setList(res.data.data);
      setDepartments(res.data.departments);
      setUserDepIds(res.data.user_dep_ids);
      setTotal(res.data.total);
      setPureTotal(res.data.pure_total);
      setDepUserCount(res.data.dep_user_count);
      setLoading(false);
    })
  }
 
  const columns: ColumnsType<DataType> = [
    {
      title: "学员",
      dataIndex: "name",
      // width: 200,
      render: (_, record: any) => (
        <>
          <Image
            style={{ borderRadius: "50%" }}
            src={record.avatar}
            preview={false}
            width={40}
            height={40}
          />
          <span className="ml-8">{record.name}</span>
        </>
      ),
    },
    {
      title: "所属部门",
      dataIndex: "id",
      render: (id: number) => (
        <div className="float-left">
          {user_dep_ids[id] &&
            user_dep_ids[id].map((item: any, index: number) => {
              return (
                <span key={index}>
                  {index === user_dep_ids[id].length - 1
                    ? departments[item]
                    : departments[item] + "、"}
                </span>
              );
            })}
        </div>
      ),
    },
    {
      title: "状态",
      // width: 200,
      dataIndex: "is_active",
      render: (is_active: number) => <Tag color={is_active ? 'success' : 'error'}>{is_active ? '启用' : '禁用'}</Tag>,
    },
    {
      title: "登录邮箱",
      // width: 200,
      dataIndex: "email",
      render: (email: string) => <span>{email}</span>,
    },
    {
      title: "加入时间",
      // width: 200,
      dataIndex: "created_at",
      render: (text: string) => <span>{dateFormat(text)}</span>,
    },
  ];

  const paginationProps = {
    current: page, //当前页码
    pageSize: size,
    total: total, // 总条数
    // onChange: (page: number, pageSize: number) =>
    //   handlePageChange(page, pageSize), //改变页码的函数
    // showSizeChanger: true,
  };

  return (
    <>
      {open ? (
        <Drawer onClose={onCancel} maskClosable={false} open={true} width={'50%'}
          extra={
            <Space>
              <Button icon={<PlusOutlined/>} type="primary" onClick={() => setSelectUsersVisible(true)} >添加</Button>
              <Button  type="primary" danger>删除</Button>
            </Space>
          }
        >
          <Table loading={loading} columns={columns} dataSource={list} rowKey={(record) => record.id} pagination={paginationProps}/>
          <SelectUsers open={selectUsersVisible} groupId={groupId} groupName={groupName} onCancel={() => {setSelectUsersVisible(false); }}/>
        </Drawer>
      ) : null}
    </>
  );
};
