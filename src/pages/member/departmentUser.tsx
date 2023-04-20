import { useState, useEffect } from "react";
import styles from "./departmentUser.module.less";
import {
  Typography,
  Input,
  Modal,
  Image,
  Button,
  Space,
  message,
  Table,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { BackBartment, DurationText } from "../../compenents";
import { dateFormat } from "../../utils/index";
import { user as member } from "../../api/index";
const { Column, ColumnGroup } = Table;

interface DataType {
  id: React.Key;
  title: string;
  type: string;
  created_at: string;
  total_duration: number;
  finished_duration: number;
  is_finished: boolean;
}

const MemberDepartmentProgressPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [courses, setCourses] = useState<any>([]);
  const [records, setRecords] = useState<any>({});
  const [totalHour, setTotalHour] = useState(0);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [id_card, setIdCard] = useState<string>("");
  const [did, setDid] = useState(Number(result.get("id")));
  const [title, setTitle] = useState(String(result.get("title")));

  useEffect(() => {
    getData();
  }, [refresh, page, size]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    member
      .departmentProgress(did, page, size, {
        sort_field: "",
        sort_algo: "",
        name: name,
        email: email,
        id_card: id_card,
      })
      .then((res: any) => {
        setList(res.data.data);
        setTotal(res.data.total);
        let data = res.data.courses;
        let arr = [];
        let value = 0;
        for (let key in data) {
          arr.push(data[key]);
          value += data[key].class_hour;
        }
        setCourses(arr);
        setTotalHour(value);
        setRecords(res.data.user_course_records);
        setLoading(false);
      });
  };

  const resetData = () => {
    setName("");
    setEmail("");
    setIdCard("");
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

  const getTotalHours = (params: any) => {
    if (params) {
      let value = 0;
      for (let key in params) {
        value += params[key].hour_count;
      }
      return value;
    } else {
      return 0;
    }
  };

  const getFinishedHours = (params: any) => {
    if (params) {
      let value = 0;
      for (let key in params) {
        value += params[key].finished_count;
      }
      return value;
    } else {
      return 0;
    }
  };

  return (
    <div className="playedu-main-body">
      <div className="float-left mb-24">
        <BackBartment title={title + "学习进度"} />
      </div>
      <div className="float-left j-b-flex mb-24">
        <div className="d-flex helper-text ">
          以下表格内数字对应的是表头课程的“已学完课时数/总课时数”）
        </div>
        <div className="d-flex">
          <div className="d-flex mr-24 ">
            <Typography.Text>姓名：</Typography.Text>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              style={{ width: 160 }}
              placeholder="请输入姓名关键字"
            />
          </div>
          <div className="d-flex mr-24">
            <Typography.Text>邮箱：</Typography.Text>
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              style={{ width: 160 }}
              placeholder="请输入邮箱"
            />
          </div>
          {/* <div className="d-flex mr-24">
            <Typography.Text>身份证号：</Typography.Text>
            <Input
              value={id_card}
              onChange={(e) => {
                setIdCard(e.target.value);
              }}
              style={{ width: 160 }}
              placeholder="请输入身份证号"
            />
          </div> */}
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
          bordered
          dataSource={list}
          loading={loading}
          pagination={paginationProps}
          rowKey={(record) => record.id}
          scroll={{ x: 1600 }}
        >
          <Column
            fixed="left"
            title="学员"
            dataIndex="name"
            key="name"
            width={300}
            render={(_, record: any) => (
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
            )}
          />
          {courses.map((item: any) => (
            <Column
              title={item.title}
              ellipsis={true}
              dataIndex="id"
              key={item.id}
              width={100}
              render={(_, record: any) => (
                <>
                  {records[record.id] && records[record.id][item.id] ? (
                    records[record.id][item.id].is_finished === 1 ? (
                      <span>已完成</span>
                    ) : (
                      <>
                        <span>
                          {records[record.id][item.id].finished_count}
                        </span>{" "}
                        / <span>{item.class_hour}</span>
                      </>
                    )
                  ) : (
                    <>
                      <span>0</span> / <span>{item.class_hour}</span>
                    </>
                  )}
                </>
              )}
            />
          ))}
          <Column
            fixed="right"
            title="所有课程总课时"
            dataIndex="id"
            key="id"
            width={100}
            render={(_, record: any) => (
              <>
                <span>{getFinishedHours(records[record.id])}</span> /{" "}
                <span>{totalHour}</span>
              </>
            )}
          />
        </Table>
      </div>
    </div>
  );
};
export default MemberDepartmentProgressPage;
