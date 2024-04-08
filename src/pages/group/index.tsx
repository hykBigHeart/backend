import { Key, useEffect, useState } from "react";
import { Table, Typography, Input, Button, Space, Modal, message } from "antd";
import { PlusOutlined, UserOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { dateWholeFormat } from "../../utils/index";

import { group } from "../../api/index";
import { PerButton } from "../../compenents";
import { GroupCreate } from "./compenents/create";
import { UserTransfer } from "./compenents/userTransfer";
import { GroupUsers } from "./compenents/groupUsers";
import './group.less'

const { confirm } = Modal;

interface DataType {
  id: React.Key;
  name: string;
  description: string;
  sort: number;
  created_at: string
}

const groupPage = () => {

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [transferVisible, setTransferVisible] = useState(false);
  const [groupId, setGroupId] = useState<React.Key>("");
  const [list, setList] = useState<DataType[]>([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [groupName, setGroupName] = useState("");


  useEffect(() => {
    setGroupId('')
    getData();
  }, [refresh, page, size]);

  const editItem = (id: Key) => {
    setModalVisible(true)
    setGroupId(id)
    setModalType('edit')
  }

  // 删除课程
  const delItem = (id: Key) => {
    if (id === 0) {
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除此课程？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        group.deleteGroup(id).then(() => {
          message.success("删除成功");
          resetData()
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const getData = () => {
    setLoading(true);
    group.groupList(page, size, groupName).then((res: any) => {
      setLoading(false);
      // console.log('res',res);
      setList(res.data.data);
      setTotal(res.data.total);
      setLoading(false);
    }).catch(err=> {
      setLoading(false);
    })
  };

  const resetData = () => {
    setGroupName("");
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

  const columns: ColumnsType<DataType> = [
    {
      title: "群组名称",
      render: (_, record: any) => <span>{record.name}</span>,
    },
    {
      title: "用户数量",
      render: (_, record: any) => <span>{record.user_count}</span>,
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      render: (created_at: string) => (
        <span>{dateWholeFormat(created_at)}</span>
      ),
    },
    {
      title: "操作项",
      key: "action",
      fixed: "right",
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Button  type="link"  className="b-link c-red"  icon={<UserOutlined />}
            onClick={() => {
              setTransferVisible(true);
              setGroupId(record.id)
              setGroupName(record.name)
            }}
          >
            组内用户
          </Button>
          <div className="form-column"></div>
          <Button type="link" className="b-link c-red" onClick={()=> editItem(record.id)}>编辑</Button>
          <div className="form-column"></div>
          <Button type="link" className="b-link c-red" onClick={()=> delItem(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  const rowClassName = (record: any, index: number)=> record.id === groupId ? 'selected-row' : ''
  
  return (
    <>
      <div className="playedu-main-body">
        <div className="float-left j-b-flex mb-24">
          <div className="d-flex">
            <PerButton  type="primary" text="新建群组" class="mr-16" icon={<PlusOutlined />} p="department-cud" onClick={() => { setModalVisible(true); setModalType('add') } } disabled={null}></PerButton>
          </div>
          <div className="d-flex">
            <div className="d-flex mr-24">
              <Typography.Text>群组名称：</Typography.Text>
              <Input
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                }}
                allowClear
                style={{ width: 160 }}
                placeholder="请输入群组名称"
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
            </div>
          </div>
        </div>
        <div className="float-left">
          <Table loading={loading} columns={columns} dataSource={list} rowKey={(record) => record.id} pagination={paginationProps} rowClassName={rowClassName}/>
        </div>
        <GroupCreate open={modalVisible} groupId={groupId} modalType={modalType} onCancel={() => { setModalVisible(false); setRefresh(!refresh); }}></GroupCreate>
        <GroupUsers open={transferVisible} groupId={groupId} groupName={groupName} onCancel={() => { setTransferVisible(false); setRefresh(!refresh); setGroupName("")}}></GroupUsers>
        {/* 穿梭框形式（暂时不用） */}
        {/* <UserTransfer open={transferVisible} groupId={groupId} groupName={groupName} onCancel={() => { setTransferVisible(false); setRefresh(!refresh); setGroupName("")}}></UserTransfer> */}
      </div>
    </>
  )
}

export default groupPage