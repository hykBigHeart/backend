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
import { group } from "../../../api/index";
import { dateFormat } from "../../../utils/index";
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { SelectUsers } from "./selectUsers"
import './groupUsers.less'

const { confirm } = Modal;
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

interface LocalSearchParamsInterface {
  page?: number;
  size?: number;
  nickname?: string;
  email?: string;
}

export const GroupUsers: React.FC<PropInterface> = ({
  groupId,
  groupName,
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    size: 10,
    nickname: "",
    email: "",
  });

  const [list, setList] = useState<DataType[]>([]);
  const page = searchParams.page || 1
  const size = searchParams.size || 10
  const [total, setTotal] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectUsersVisible, setSelectUsersVisible] = useState<boolean>(false);
  const [triggerValue, setTriggerValue] = useState("");
  const [user_dep_ids, setUserDepIds] = useState<DepIdsModel>({});
  const [departments, setDepartments] = useState<DepartmentsModel>({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (open) {
      getData()
    }
  }, [form, open, refresh, page, size]);

  // 删除人员
  const delItem = () => {
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认要删除吗？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        setLoading(true)
        group.deletePeople(groupId, groupName, selectedRowKeys).then(res=> {
          message.success("删除成功");
          setLoading(false)
          setRefresh(!refresh)
          setSelectedRowKeys([])
        })
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const getData = ()=> {
    setLoading(true)
    group.groupUsers(groupId, page, size).then((res: any) => {
      // console.log('res',res);
      if (!res.data.data.length && page > 1) {
        resetLocalSearchParams({
          page: page - 1,
        });
      }
      setList(res.data.data);
      setTotal(res.data.total);
      setUserDepIds(res.data.user_dep_ids);
      setDepartments(res.data.departments)
      setLoading(false);
    })
  }

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRowKeys(selectedRowKeys)
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };
 
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
    // {
    //   title: "加入时间",
    //   // width: 200,
    //   dataIndex: "created_at",
    //   render: (text: string) => <span>{dateFormat(text)}</span>,
    // },
  ];

  const paginationProps = {
    current: page, //当前页码
    pageSize: size,
    total: total, // 总条数
    onChange: (page: number, pageSize: number) =>
      handlePageChange(page, pageSize), //改变页码的函数
    showSizeChanger: true,
  };
  const handlePageChange = (page: number, pageSize: number) => {
    resetLocalSearchParams({
      page: page,
      size: pageSize,
    });
  };

  const resetLocalSearchParams = (params: LocalSearchParamsInterface) => {
    // 页面没反应
    setSearchParams(
      (prev) => {
        // 创建一个新的对象，并将其与原始状态合并
        const newState = {
          ...prev,
          // 根据参数更新状态的相应属性
          ...(typeof params.nickname !== "undefined" && { nickname: params.nickname }),
          ...(typeof params.email !== "undefined" && { email: params.email }),
          ...(typeof params.page !== "undefined" && { page: params.page }),
          ...(typeof params.size !== "undefined" && { size: params.size }),
        };
        return newState;
      },
    );
      // 页面有反应
    // setSearchParams({page: params.page, size: params.size})
  }; 

  return (
    <>
      {open ? (
        <Drawer className="custom-drawer" onClose={onCancel} maskClosable={false} open={true} width={'50%'}
          extra={
            <div className="top-box">
              <p>您正在查看群组<span className="group-name">【{groupName}】</span>的学员……</p>
              <Space>
                <Button icon={<PlusOutlined/>} type="primary" onClick={() => setSelectUsersVisible(true) } >管理学员</Button>
                <Button type="primary" danger disabled={!selectedRowKeys.length} onClick={()=> delItem() }>删除</Button>
              </Space>
            </div>
          }
        >
          <Table rowSelection={{type: "checkbox", ...rowSelection}} loading={loading} columns={columns} dataSource={list} rowKey={(record) => record.id} pagination={paginationProps} scroll={{y: 670}}/>
          <SelectUsers open={selectUsersVisible} triggerSource={triggerValue} groupId={groupId} groupName={groupName} onCancel={() => { setSelectUsersVisible(false); setRefresh(!refresh) }}/>
        </Drawer>
      ) : null}
    </>
  );
};
