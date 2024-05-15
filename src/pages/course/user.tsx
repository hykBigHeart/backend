import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  Typography,
  Input,
  Table,
  message,
  Image,
  Dropdown,
  Space,
  Tag
} from "antd";
import type { MenuProps } from "antd";
import { course as Course, group } from "../../api";
import { useParams, useLocation } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { BackBartment } from "../../compenents";
import { ExclamationCircleFilled, DownOutlined } from "@ant-design/icons";
import { PerButton } from "../../compenents";
import { dateFormat } from "../../utils/index";
import { SelectUsers } from "../group/compenents/selectUsers"

const { confirm } = Modal;

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

type UserCourseRecordsModel = {
  [key: number]: CourseRecordModel;
};

type CourseRecordModel = {
  course_id: number;
  created_at: string;
  finished_at?: string;
  finished_count: number;
  hour_count: number;
  id: number;
  is_finished: number;
  progress: number;
  updated_at: string;
  user_id: number;
};

type HourCountModel = {
  [key: number]: string;
};

type PerCourseRecordsModel = {
  [key: number]: {
    course_id: number;
    created_at: string;
    finished_at: string;
    finished_duration: number;
    hour_id: number;
    id: number;
    is_finished: number;
    real_duration: number;
    total_duration: number;
    updated_at: string;
    user_id: number;
  };
};

const CourseUserPage = () => {
  const params = useParams();
  const result = new URLSearchParams(useLocation().search);
  const [list, setList] = useState<DataType[]>([]);
  const [course, setCourse] = useState<CourseModel | null>(null);
  const [records, setRecords] = useState<UserCourseRecordsModel>({});
  const [hourCount, setHourCount] = useState<HourCountModel>({});
  const [userDepIds, setUserDepIds] = useState<DepIdsModel>({});
  const [departments, setDepartments] = useState<DepartmentsModel>({});
  const [perRecords, setPerRecords] = useState<PerCourseRecordsModel>({});
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [idCard, setIdCard] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [title, setTitle] = useState<string>(String(result.get("title")));

  const [selectUsersVisible, setSelectUsersVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [triggerValue, setTriggerValue] = useState("");
  const [userIdsRequired, setUserIdsRequired] = useState<DepIdsModel>({});

  const columns: ColumnsType<DataType> = [
    {
      title: "学员",
      render: (_, record: any) => (
        <div className="d-flex">
          <Image
            style={{ borderRadius: "50%" }}
            preview={false}
            width={40}
            height={40}
            src={record.avatar}
          ></Image>
          <span className="ml-8">{record.name}</span>
        </div>
      ),
    },
    {
      title: "修课",
      // width: 120,
      dataIndex: "id",
      render: (id: number) => <Tag color={userIdsRequired[id] ? 'error' : 'success'}>{userIdsRequired[id] ? '必修' : '选修'}</Tag>,
    },
    {
      title: "邮箱",
      render: (_, record: any) => <span>{record.email}</span>,
    },
    {
      title: "部门",
      render: (_, record: any) => (
        <div className="float-left">
          {userDepIds[record.id] &&
            userDepIds[record.id].map((item: any, index: number) => {
              return (
                <span key={index}>
                  {index === userDepIds[record.id].length - 1
                    ? departments[item]
                    : departments[item] + "、"}
                </span>
              );
            })}
        </div>
      ),
    },
    {
      title: "课程进度",
      dataIndex: "progress",
      render: (_, record: any) => (
        <span>
          已完成课件：
          {(records[record.id] && records[record.id].finished_count) ||
            0} /{" "}
          {(records[record.id] && records[record.id].hour_count) ||
            course?.class_hour}
        </span>
      ),
    },
    {
      title: "第一次学习时间",
      dataIndex: "created_at",
      render: (_, record: any) => (
        <>
          {perRecords[record.id] ? (
            <span>{dateFormat(perRecords[record.id].created_at)}</span>
          ) : hourCount[record.id] ? (
            <span>{dateFormat(hourCount[record.id])}</span>
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },
    {
      title: "学习完成时间",
      dataIndex: "id",
      render: (_, record: any) => (
        <>
          {records[record.id] && records[record.id].finished_at ? (
            <span>{dateFormat(String(records[record.id].finished_at))}</span>
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },
    {
      title: "学习进度",
      dataIndex: "progress",
      render: (_, record: any) => (
        <>
          {records[record.id] ? (
            <span
              className={
                // Math.floor(
                //   (records[record.id].finished_count /
                //     records[record.id].hour_count) *
                //     100
                // )
                Math.floor(records[record.id].progress / 100) >= 100
                  ? "c-green"
                  : "c-red"
              }
            >
              {/* {Math.floor(
                (records[record.id].finished_count /
                  records[record.id].hour_count) *
                  100
              )} */}
              {Math.floor(records[record.id].progress / 100)}
              %
            </span>
          ) : hourCount[record.id] ? (
            <span className="c-red">1%</span>
          ) : (
            <span className="c-red">0%</span>
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    getList();
  }, [params.courseId, refresh, page, size]);

  const getList = () => {
    setLoading(true);
    Course.courseUser(
      Number(params.courseId),
      page,
      size,
      "",
      "",
      name,
      email,
      idCard
    )
      .then((res: any) => {
        setTotal(res.data.total);
        setList(res.data.data);
        setHourCount(res.data.user_course_hour_user_first_at);
        setRecords(res.data.user_course_records);
        setPerRecords(res.data.per_user_earliest_records);
        setCourse(res.data.course);
        setDepartments(res.data.departments);
        setUserDepIds(res.data.user_dep_ids);
        setUserIdsRequired(res.data.user_ids_required);
        setLoading(false);
      })
      .catch((err: any) => {
        console.log("错误,", err);
      });
  };

  // 重置列表
  const resetList = () => {
    setPage(1);
    setSize(10);
    setList([]);
    setName("");
    setEmail("");
    setIdCard("");
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

  // 删除学员
  const delItem = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请选择学员后再删除");
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除选中学员吗？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        setLoading(true)
        group.courseDeletePeople(params.courseId, selectedRowKeys).then(res=> {
          message.success("删除成功");
          setLoading(false)
          setRefresh(!refresh)
          setSelectedRowKeys([])
        })
        // 学员重置接口
        // Course.destroyCourseUser(Number(params.courseId), selectedRowKeys).then(
        //   () => {
        //     message.success("清除成功");
        //     resetList();
        //   }
        // );
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Button type="link" size="small" className="b-n-link c-red"
          onClick={() => {
            setSelectUsersVisible(true)
            setTriggerValue('course-department')
          }} 
        >
          按部门新增
        </Button>
      ),
    },
    {
      key: "2",
      label: (
        <Button style={{ verticalAlign: "middle" }} type="link" size="small" className="b-n-link c-red"
          onClick={() => {
            setSelectUsersVisible(true)
            setTriggerValue('course-group')
          }}
        >
          按群组新增
        </Button>
      ),
    }
  ];

  return (
    <>
      <Row className="playedu-main-body">
        <Col span={24}>
          <div className="float-left mb-24">
            <BackBartment title={title || "线上课学员"} />
          </div>
          <div className="float-left j-b-flex mb-24">
            <div className="d-flex">
              {/* <PerButton
                type="primary"
                text="重置学习记录"
                class="mr-16"
                icon={null}
                p="course"
                onClick={() => delItem()}
                disabled={selectedRowKeys.length === 0}
              /> */}
              {/* <PerButton type="primary" text="新增必修学员" class="mr-16" icon={null} p="course" onClick={() => {setTransferVisible(true)}} disabled={false}/> */}
              <Dropdown menu={{ items }} className="mr-16">
                <Button type="primary" onClick={(e) => e.preventDefault()}>
                  <Space size="small" align="center">
                    新增必修学员
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
              <Button type="primary" danger disabled={!selectedRowKeys.length} onClick={()=> delItem() }>删除</Button>
            </div>
            <div className="d-flex">
              <div className="d-flex mr-24">
                <Typography.Text>学员姓名：</Typography.Text>
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  allowClear
                  style={{ width: 160 }}
                  placeholder="请输入姓名关键字"
                />
              </div>
              <div className="d-flex mr-24">
                <Typography.Text>学员邮箱：</Typography.Text>
                <Input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  allowClear
                  style={{ width: 160 }}
                  placeholder="请输入学员邮箱"
                />
              </div>
              {/* <div className="d-flex mr-24">
                <Typography.Text>身份证号：</Typography.Text>
                <Input
                  value={idCard}
                  onChange={(e) => {
                    setIdCard(e.target.value);
                  }}
                  style={{ width: 160 }}
                  placeholder="请输入身份证号"
                />
              </div> */}
              <div className="d-flex">
                <Button className="mr-16" onClick={resetList}>
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
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
              columns={columns}
              dataSource={list}
              loading={loading}
              pagination={paginationProps}
              rowKey={(record) => record.id}
            />
          </div>
        </Col>
      </Row>
      {selectUsersVisible && (
        <SelectUsers open={selectUsersVisible} triggerSource={triggerValue} groupId={params.courseId} groupName={groupName} onCancel={() => { setSelectUsersVisible(false); setRefresh(!refresh) }}/>
      )}
    </>
  );
};
export default CourseUserPage;
