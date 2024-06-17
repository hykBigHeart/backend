// 添加视频和文档公用
import { Key, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Row, Col, Modal, Table, Tree, Image, Tag, message, Typography, Input, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSelector } from "react-redux";
import { group, user } from "../../../api/index";
import { dateFormat } from "../../../utils/index";

interface PropsInterface {
  open: boolean;
  triggerSource: string,
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
  const [dep_ids, setDepIds] = useState<number[]>([0]);
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
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [echoSelectedRowKeys, setEchoSelectedRowKeys] = useState<Key[]>([]);
  const [disabledRowKeys, setDisabledRowKeys] = useState<Key[]>([]);
  const [participateType, setParticipateType] = useState<any>(2);
  const [groupName, setGroupName] = useState("");
  const types = [
    { label: "全部", value: null },
    { label: "已添加必修", value: 1 },
    { label: "未添加必修", value: 2 }
  ];

  useEffect(() => {
    // setDepIds([-1])
    setList([])
    setSelectedRowKeys([])
    let data: any[] = checkArr(localDepartments, 0);
    // console.log('tree', data);
    setTreeData(data);
    if (props.open) {
      if (props.triggerSource !== 'course-group') {
        getData()
        setSelectKey([])
        if (props.triggerSource === 'course-department') {
          group.courseSelectedUsers(props.groupId).then((res: any) => {
            setSelectedRowKeys(Array.from(new Set(res.data)))
            setEchoSelectedRowKeys(Array.from(new Set(res.data)))
          })
        } else {
          setParticipateType(null)
          group.groupSelectedUsers(props.groupId).then((res: any) => {
            setSelectedRowKeys(Array.from(new Set(res.data)))
            setEchoSelectedRowKeys(Array.from(new Set(res.data)))
          })
        }
      } else getGroupData()
    }
  }, [props.open]);
  
  useEffect(() => {
    if (props.open) {
      if (props.triggerSource !== 'course-group') getData()
      else getGroupData()
    }
  }, [refresh, page, size, dep_ids]);

  useEffect(() => {
    if (list.length) {
      let result = list.filter((item: any) => selectedRowKeys.includes(item.id));
      setSelectedRows(result)
    }
  }, [list])

  const onSelect = (selectedKeys: any, info: any) => {
    setSelectKey(selectedKeys);
    if (!selectedKeys.length) setDepIds([0])
    else setDepIds(selectedKeys)
  };

  const onExpand = (selectedKeys: any, info: any) => {
    console.log('onExpand', selectedKeys);
    
    setSelectKey(selectedKeys);
    if (!selectedKeys.length) setDepIds([0])
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
    // 课程管理--按部门、群组添加确认
    if (props.triggerSource)  {
      group.courseAddPeople(props.groupId, selectedRowKeys, props.triggerSource).then((res: any) => {
        setDepIds([0])
        setLoading(false);
        // resetData()
        message.success("保存成功！");
        props.onCancel();
      }).catch((e) => {
        setLoading(false);
      });
    } else {
      group.addPeople(props.groupId, props.groupName, Array.from(new Set([...echoSelectedRowKeys, ...selectedRowKeys]))).then((res: any) => {
        setDepIds([0])
        setLoading(false);
        // resetData()
        message.success("保存成功！");
        props.onCancel();
      }).catch((e) => {
        setLoading(false);
      });
    }
  };

  const getData = ()=> {
    setLoading(true)
    user.userList(page, size, {
      course_id: props.groupId,
      name: nickname,
      email: email,
      student_course_status: participateType,
      dep_ids: dep_ids.join(","),
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

  // 获取群组
  const getGroupData = ()=> {
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
  }

  const resetData = ()=> {
    resetLocalSearchParams({
      page: 1,
      size: 10,
      nickname: "",
      email: "",
    });
    setList([]);
    setGroupName("")
    if (!props.triggerSource) setParticipateType(null)
    else setParticipateType(2)
    setRefresh(!refresh);
  }

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    // selectedRowKeys: selectedRowKeys.length ? selectedRowKeys : selectedRowKeys,
    selectedRowKeys: [...echoSelectedRowKeys, ...selectedRowKeys],
    onChange: (selectedRowKeyList: React.Key[], selectedRows: DataType[], info: any) => {
      // console.log(`selectedRowKeyList: ${selectedRowKeyList}`, 'selectedRows: ', selectedRows, 'info', info, 'echoSelectedRowKeys', echoSelectedRowKeys);
      if (info.type == 'all' && selectedRowKeyList.length) {
        let uniqueKeys = Array.from(new Set(selectedRowKeys.concat( selectedRowKeyList )))
        setSelectedRowKeys(uniqueKeys)
        setSelectedRows(selectedRows)
      }
      //  取消全选
      let allKeysIncludeKeys = selectedRowKeyList.every(key => echoSelectedRowKeys.includes(key));
      if ( (info.type == 'all' && !selectedRowKeyList.length) || allKeysIncludeKeys ) {
        let currKeys = list.map(item=> item.id)
        // console.log('curr' ,currKeys);
        // console.log('selectedRowKeys', selectedRowKeys);
        let uniqueKeys =  selectedRowKeys.filter(item => !currKeys.includes(item))
        // console.log('nui', uniqueKeys);
        setSelectedRowKeys(uniqueKeys)
        setSelectedRows(selectedRows)
      }
    },
    onSelect: (record: any, selected: boolean, changeRows: DataType[]) => {
      // console.log('record', record);
      // console.log('selected', selected);
      // console.log('changeRows', changeRows);
      let uniqueKeys = Array.from(new Set(selectedRowKeys.concat( changeRows.filter(item=> item !== undefined).map(item=> item.id) )))
      // console.log('sdf', uniqueKeys);
      
      if (!selected) uniqueKeys = uniqueKeys.filter(item=> item != record.id)
      // console.log('uni', uniqueKeys);
      setSelectedRowKeys(uniqueKeys)
      setSelectedRows(changeRows)
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: !(echoSelectedRowKeys.findIndex(i=> i === record.id) === -1), // Column configuration not to be checked
      name: record.name,
    })
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "学员",
      dataIndex: "name",
      width: 180,
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
      width: 200,
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
      width: 200,
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

  // 课程里 按照部门新增学员的表列
  const columns1: ColumnsType<DataType> = [
    ...columns.slice(0, 2),
    {
      title: "状态",
      width: 120,
      dataIndex: "id",
      render: (id: number) => <Tag color={echoSelectedRowKeys.includes(id) ? 'success' : 'error'}>{echoSelectedRowKeys.includes(id) ? '参与' : '未参与'}</Tag>
    },
    ...columns.slice(2)
  ]


  const groupColumns: ColumnsType<DataType> = [
    {
      title: "群组名称",
      render: (_, record: any) => <span>{record.name}</span>,
    },
    {
      title: "用户数量",
      render: (_, record: any) => <span>{record.user_count}</span>,
    }
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
      <Modal title={props.triggerSource !== 'course-group' ? '选择用户' : '选择群组'} centered onCancel={() => { props.onCancel(); setDepIds([0]) }} open={props.open} width={1300} maskClosable={false} onOk={onFinish} >
          <Row>
            {props.triggerSource !== 'course-group' && (
              <>
                <Col span={7} style={{maxHeight: 580, overflowY: 'scroll'}}>
                  {treeData.length > 0 && (
                    <Tree defaultExpandedKeys={[16]} selectedKeys={selectKey} onSelect={onSelect} treeData={treeData} switcherIcon={<i className="iconfont icon-icon-fold c-gray" />}/>
                  )}
                </Col>
                <Col span={1} style={{flex: '0 0 3%'}}></Col>
              </>
            )}
            <Col span={ props.triggerSource === 'course-group' ? 24 : 16}>
              <div className="d-flex" style={{marginBottom: 10}}>
                {props.triggerSource !== 'course-group' ? (
                  <>
                    <div className="d-flex mr-24">
                      <Typography.Text>姓名：</Typography.Text>
                      <Input value={nickname || ""} onChange={(e) => { resetLocalSearchParams({ nickname: e.target.value, }); }} style={{ width: 155 }} placeholder="请输入姓名关键字" allowClear/>
                    </div>
                    <div className="d-flex mr-24">
                      <Typography.Text>邮箱：</Typography.Text>
                      <Input value={email || ""} onChange={(e) => { resetLocalSearchParams({ email: e.target.value, }); }} style={{ width: 155 }} placeholder="请输入邮箱账号" allowClear/>
                    </div>
                    <div style={{display: props.triggerSource === 'course-department' ? 'flex' : 'none' }} className="d-flex mr-24">
                      <Typography.Text>课程状态：</Typography.Text>
                      <Select style={{ width: 155 }} placeholder="请选择状态" value={participateType} onChange={(value: string) => setParticipateType(value)} options={types}/>
                    </div>
                  </>
                ) : (
                  <div className="d-flex mr-24">
                    <Typography.Text>群组名称：</Typography.Text>
                    <Input value={groupName} onChange={(e) => { setGroupName(e.target.value) }} allowClear style={{ width: 155 }} placeholder="请输入管理员名称"/>
                  </div>
                )}
                <div className="d-flex">
                  <Button className="mr-16" onClick={resetData}>重 置</Button>
                  <Button type="primary" onClick={() => { resetLocalSearchParams({ page: 1, }); setRefresh(!refresh); }} >查 询</Button>
                </div>
              </div>
              <Table rowSelection={{type: "checkbox", ...rowSelection}} loading={loading} columns={ props.triggerSource === 'course-group' ? groupColumns : props.triggerSource === 'course-department' ? columns1 : columns } dataSource={list} rowKey={(record) => record.id} pagination={paginationProps} scroll={{y: 425}}

                onRow={(record) => {
                  return {
                    onClick: (event) => {
                      if (echoSelectedRowKeys.indexOf(record.id) >= 0) return

                      const newSelectedRows = [...selectedRows];
                      const index = selectedRows.findIndex((item: any) => item?.id === record.id);
                      if (index >= 0) {
                        newSelectedRows.splice(index, 1);
                      } else {
                        newSelectedRows.push(record);
                      }
                      rowSelection.onSelect(record, index === -1, newSelectedRows)
                    },
                  };
                }}
                />
            </Col>
          </Row>
        </Modal>
      ) : null}
    </>
  );
};
