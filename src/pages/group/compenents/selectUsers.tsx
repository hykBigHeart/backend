// 添加视频和文档公用
import { Key, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Row, Col, Modal, Table, Tree, Image, Tag, message, Typography, Input, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSelector } from "react-redux";
import { group, user } from "../../../api/index";
import { dateFormat } from "../../../utils/index";

interface PropsInterface {
  open: boolean;
  groupId: React.Key,
  groupName: string,
  onCancel: () => void;
}

interface DataType {
  id: React.Key;
  avatar: string;
  create_city?: string;
  create_ip?: string;
  created_at?: string;
  credit1?: number;
  email: string;
  id_card?: string;
  is_active?: number;
  is_lock?: number;
  is_set_password?: number;
  is_verify?: number;
  login_at?: string;
  name: string;
  updated_at?: string;
  verify_at?: string;
}

interface LocalSearchParamsInterface {
  page?: number;
  size?: number;
  nickname?: string;
  email?: string;
}

export const SelectUsers = (props: PropsInterface) => {
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<any>([]);
  const [selectKey, setSelectKey] = useState<number[]>([]);
  // 本地缓存
  const localDepartments = useSelector(
    (state: any) => state.systemConfig.value.departments
  );
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    size: "10",
    nickname: "",
    email: "",
  });
  const [refresh, setRefresh] = useState(false);
  const [dep_ids, setDepIds] = useState<number[]>([-1]);
  const [list, setList] = useState<DataType[]>([]);
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");
  const nickname = searchParams.get("nickname");
  const email = searchParams.get("email");
  const [total, setTotal] = useState(0);
  const [user_dep_ids, setUserDepIds] = useState<DepIdsModel>({});
  const [departments, setDepartments] = useState<DepartmentsModel>({});
  const [pureTotal, setPureTotal] = useState(0);
  const [depUserCount, setDepUserCount] = useState<KeyNumberObject>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [disabledRowKeys, setDisabledRowKeys] = useState<Key[]>([]);

  useEffect(() => {
    // setDepIds([-1])
    let data: any[] = checkArr(localDepartments, 0);
    // console.log('tree', data);
    setTreeData(data);
    if (props.open) {
      getData()
      setSelectKey([])
      group.groupSelectedUsers(props.groupId).then((res: any) => {
        console.log('sel;e', res, 'props.open', props.open);        
        setSelectedRowKeys(Array.from(new Set(res.data)))
      })
    }
  }, [props.open]);
  
  useEffect(() => {
    if (props.open) getData()
  }, [refresh, page, size, dep_ids]);

  const onSelect = (selectedKeys: any, info: any) => {
    setSelectKey(selectedKeys);
    if (!selectedKeys.length) setDepIds([-1])
    else setDepIds(selectedKeys)
  };

  const onExpand = (selectedKeys: any, info: any) => {
    console.log('onExpand', selectedKeys);
    
    setSelectKey(selectedKeys);
    if (!selectedKeys.length) setDepIds([-1])
    else setDepIds(selectedKeys)
  };

  const resetLocalSearchParams = (params: LocalSearchParamsInterface) => {
    setSearchParams(
      (prev) => {
        if (typeof params.nickname !== "undefined") {
          prev.set("nickname", params.nickname);
        }
        if (typeof params.email !== "undefined") {
          prev.set("email", params.email);
        }
        if (typeof params.page !== "undefined") {
          prev.set("page", params.page + "");
        }
        if (typeof params.size !== "undefined") {
          prev.set("size", params.size + "");
        }
        return prev;
      },
      { replace: true }
    );
  };  

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    group.addPeople(props.groupId, props.groupName, selectedRowKeys).then((res: any) => {
        setDepIds([-1])
        setLoading(false);
        // resetData()
        message.success("保存成功！");
        props.onCancel();
      }).catch((e) => {
        setLoading(false);
      });
  };

  const getData = ()=> {
    setLoading(true)
    user.userList(page, size, {
      name: nickname,
      email: email,
      dep_ids: dep_ids.join(","),
    }).then((res: any) => {
      // console.log('res23',res)
      setList(res.data.data);
      setDepartments(res.data.departments);
      setUserDepIds(res.data.user_dep_ids);
      setTotal(res.data.total);
      setPureTotal(res.data.pure_total);
      setDepUserCount(res.data.dep_user_count);
      setLoading(false);
    })
  }
  const resetData = ()=> {
    resetLocalSearchParams({
      page: 1,
      size: 10,
      nickname: "",
      email: "",
    });
    setList([]);
    setRefresh(!refresh);
  }

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeyList: React.Key[], selectedRows: DataType[], info: any) => {
      // console.log(`selectedRowKeyList: ${selectedRowKeyList}`, 'selectedRows: ', selectedRows, 'info', info);
      if (info.type == 'all' && selectedRowKeyList.length) {
        let uniqueKeys = Array.from(new Set(selectedRowKeys.concat( selectedRowKeyList )))
        setSelectedRowKeys(uniqueKeys)
      }
      //  取消全选
      if (info.type == 'all' && !selectedRowKeyList.length) {
        let currKeys = list.map(item=> item.id)
        // console.log('curr' ,currKeys);
        // console.log('selectedRowKeys', selectedRowKeys);
        let uniqueKeys =  selectedRowKeys.filter(item => !currKeys.includes(item))
        // console.log('nui', uniqueKeys);
        setSelectedRowKeys(uniqueKeys)
      }

      // console.log('selectedRowKeys', selectedRowKeys, 'info', info);
      // setSelectedRowKeys(uniqueKeys)
      // setSelectedRowKeys(selectedRowKeyList)
    },
    onSelect: (selected: any, selectedRows: boolean, changeRows: DataType[]) => {
      // console.log('selected', selected);
      // console.log('selectedRows', selectedRows);
      // console.log('changeRows', changeRows);
      let uniqueKeys = Array.from(new Set(selectedRowKeys.concat( changeRows.filter(item=> item !== undefined).map(item=> item.id) )))
      // console.log('sdf', uniqueKeys);
      
      if (!selectedRows) uniqueKeys = uniqueKeys.filter(item=> item != selected.id)
      // console.log('uni', uniqueKeys);
      setSelectedRowKeys(uniqueKeys)
    },
    getCheckboxProps: (record: DataType) => ({
      // disabled: !(disabledRowKeys.findIndex(i=> i === record.id) === -1), // Column configuration not to be checked
      name: record.name,
    })
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
    // {
    //   title: "状态",
    //   width: 200,
    //   dataIndex: "is_active",
    //   render: (is_active: number) => <Tag color={is_active ? 'success' : 'error'}>{is_active ? '启用' : '禁用'}</Tag>,
    // },
    {
      title: "登录邮箱",
      // width: 200,
      dataIndex: "email",
      render: (email: string) => <span>{email}</span>,
    },
    // {
    //   title: "加入时间",
    //   width: 200,
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

  const checkArr = (departments: DepartmentsBoxModel, id: number) => {
    const arr = [];
    for (let i = 0; i < departments[id].length; i++) {
      if (!departments[departments[id][i].id]) {
        arr.push({
          title: (
            <span className="tree-title-elli" title={departments[id][i].name}>{departments[id][i].name}{departments[id][i].selectedCount ? `(${departments[id][i].selectedCount})` : ''}</span>
          ),
          key: departments[id][i].id,
        });
      } else {
        const new_arr: any[] = checkArr(departments, departments[id][i].id);
        arr.push({
          title: (
            <span className="tree-title-elli" title={departments[id][i].name}>{departments[id][i].name}{departments[id][i].selectedCount ? `(${departments[id][i].selectedCount})` : ''}</span>
          ),
          key: departments[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  return (
    <>
      {props.open ? (
      <Modal title="选择用户" centered onCancel={() => { props.onCancel(); setDepIds([-1]) }} open={props.open} width={1300} maskClosable={false} onOk={onFinish} >
          <Row>
            <Col span={8} style={{maxHeight: 700, overflowY: 'scroll'}}>
              {treeData.length > 0 && (
                <Tree defaultExpandedKeys={[16]} selectedKeys={selectKey} onSelect={onSelect} treeData={treeData} switcherIcon={<i className="iconfont icon-icon-fold c-gray" />}/>
              )}
            </Col>
            <Col span={16}>
            <div className="d-flex" style={{marginBottom: 10}}>
              <div className="d-flex mr-24">
                <Typography.Text>姓名：</Typography.Text>
                <Input value={nickname || ""} onChange={(e) => { resetLocalSearchParams({ nickname: e.target.value, }); }} style={{ width: 160 }} placeholder="请输入姓名关键字" allowClear/>
              </div>
              <div className="d-flex mr-24">
                <Typography.Text>邮箱：</Typography.Text>
                <Input value={email || ""} onChange={(e) => { resetLocalSearchParams({ email: e.target.value, }); }} style={{ width: 160 }} placeholder="请输入邮箱账号" allowClear/>
              </div>
              <div className="d-flex">
                <Button className="mr-16" onClick={resetData}>重 置</Button>
                <Button type="primary" onClick={() => { resetLocalSearchParams({ page: 1, }); setRefresh(!refresh); }} >查 询</Button>
              </div>
            </div>
              <Table rowSelection={{type: "checkbox", ...rowSelection}} loading={loading} columns={columns} dataSource={list} rowKey={(record) => record.id} pagination={paginationProps} scroll={{y: 539}}/>
            </Col>
          </Row>
        </Modal>
      ) : null}
    </>
  );
};
