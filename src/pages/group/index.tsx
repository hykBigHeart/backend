import { useEffect, useState } from "react";
import { Table, Typography, Input, Button } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { dateWholeFormat } from "../../utils/index";

import { group } from "../../api/index";
import { PerButton } from "../../compenents";
import { GroupCreate } from "./compenents/create";

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
  const [createVisible, setCreateVisible] = useState(false);
  const [list, setList] = useState<DataType[]>([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [groupName, setGroupName] = useState("");


  useEffect(() => {
    getData();
  }, [refresh, page, size]);

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
      render: (_, record: any) => <span>{record.sort}</span>,
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
        <Button  type="link"  className="b-link c-red"  icon={<UserOutlined />}
          onClick={() => {
            // setAdmId(Number(record.id));
            // setVisiable(true);
          }}
        >
          组内用户
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="playedu-main-body">
        <div className="float-left j-b-flex mb-24">
          <div className="d-flex">
            <PerButton  type="primary" text="新建群组" class="mr-16" icon={<PlusOutlined />} p="department-cud" onClick={() => setCreateVisible(true)} disabled={null}></PerButton>
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
                placeholder="请输入管理员名称"
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
          <Table
            loading={loading}
            columns={columns}
            dataSource={list}
            rowKey={(record) => record.id}
            pagination={paginationProps}
          />
        </div>
        <GroupCreate open={createVisible}onCancel={() => { setCreateVisible(false); setRefresh(!refresh); }}></GroupCreate>
      </div>
    </>
  )
}

export default groupPage