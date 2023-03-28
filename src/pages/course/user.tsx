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
} from "antd";
import { course } from "../../api";
import { useParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { BackBartment } from "../../compenents";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { PerButton } from "../../compenents";
import { dateFormat } from "../../utils/index";

const { confirm } = Modal;

interface DataType {
  id: React.Key;
  title: string;
  created_at: string;
  thumb: string;
  charge: number;
  is_show: number;
}

const CourseUserPage = () => {
  const params = useParams();
  const [list, setList] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [idCard, setIdCard] = useState<string>("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

  const columns: ColumnsType<DataType> = [
    {
      title: "学员名称",
      render: (_, record: any) => (
        <div className="d-flex">
          <Image
            style={{ borderRadius: "50%" }}
            preview={false}
            width={40}
            height={40}
            src={users.find((i: any) => i.id === record.user_id).avatar}
          ></Image>
          <span className="ml-8">
            {users.find((i: any) => i.id === record.user_id).name}
          </span>
        </div>
      ),
    },
    {
      title: "课程进度",
      dataIndex: "progress",
      render: (_, record: any) => (
        <span>
          已完成课时：{record.finished_count} / {record.hour_count}
        </span>
      ),
    },
    {
      title: "学习进度",
      dataIndex: "progress",
      render: (progress: number) => <span>{progress / 100}%</span>,
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      render: (text: string) => <span>{dateFormat(text)}</span>,
    },
  ];

  useEffect(() => {
    getList();
  }, [params.courseId, refresh, page, size]);

  const getList = () => {
    setLoading(true);
    course
      .courseUser(
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
        setUsers(res.data.users);
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
      content: "确认删除选中学员？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        course
          .destroyCourseUser(Number(params.courseId), selectedRowKeys)
          .then(() => {
            message.success("删除成功");
            resetList();
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <>
      <Row className="playedu-main-body">
        <Col span={24}>
          <div className="float-left mb-24">
            <BackBartment title="线上课学员" />
          </div>
          <div className="float-left j-b-flex mb-24">
            <div className="d-flex">
              <PerButton
                type="primary"
                text="删除"
                class="mr-16"
                icon={null}
                p="course"
                onClick={() => delItem()}
                disabled={null}
              />
            </div>
            <div className="d-flex">
              <div className="d-flex mr-24">
                <Typography.Text>学员姓名：</Typography.Text>
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
                <Typography.Text>学员邮箱：</Typography.Text>
                <Input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  style={{ width: 160 }}
                  placeholder="请输入学员邮箱"
                />
              </div>
              <div className="d-flex mr-24">
                <Typography.Text>身份证号：</Typography.Text>
                <Input
                  value={idCard}
                  onChange={(e) => {
                    setIdCard(e.target.value);
                  }}
                  style={{ width: 160 }}
                  placeholder="请输入身份证号"
                />
              </div>
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
    </>
  );
};
export default CourseUserPage;
