import { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Popconfirm,
  Image,
  Table,
  Typography,
  Input,
  message,
  Space,
} from "antd";
import { course } from "../../api";
import styles from "./index.module.less";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { dateFormat } from "../../utils/index";
import { Link, useNavigate } from "react-router-dom";
import { TreeDepartment, TreeCategory, PerButton } from "../../compenents";

interface DataType {
  id: React.Key;
  title: string;
  created_at: string;
  thumb: string;
  charge: number;
  is_show: number;
}

export const CoursePage = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [category_ids, setCategoryIds] = useState<any>([]);
  const [title, setTitle] = useState<string>("");
  const [dep_ids, setDepIds] = useState<any>([]);

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "封面",
      dataIndex: "thumb",
      render: (thumb: string) => (
        <Image preview={false} width={120} height={80} src={thumb}></Image>
      ),
    },
    {
      title: "课程标题",
      dataIndex: "title",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "时间",
      dataIndex: "created_at",
      render: (text: string) => <span>{dateFormat(text)}</span>,
    },
    {
      title: "是否显示",
      dataIndex: "is_show",
      render: (is_show: number) => (
        <span className={is_show === 1 ? "c-green" : "c-red"}>
          {is_show === 1 ? "· 显示" : "· 隐藏"}
        </span>
      ),
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, record: any) => (
        <Space size="small">
          <PerButton
            type="link"
            text="详情"
            class="b-link c-red"
            icon={null}
            p="course"
            onClick={() => navigate(`/course/update/${record.id}`)}
          />
          <Popconfirm
            title="警告"
            description="即将删除此课程，确认操作？"
            onConfirm={() => removeItem(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <PerButton
              type="link"
              text="删除"
              class="b-link c-red"
              icon={null}
              p="course"
              onClick={() => null}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 删除图片
  const removeItem = (id: number) => {
    if (id === 0) {
      return;
    }
    course.destroyCourse(id).then(() => {
      message.success("删除成功");
      resetList();
    });
  };

  // 获取视频列表
  const getList = () => {
    setLoading(true);
    let categoryIds = category_ids.join(",");
    let depIds = dep_ids.join(",");
    course
      .courseList(page, size, "", "", title, depIds, categoryIds)
      .then((res: any) => {
        setTotal(res.data.total);
        setList(res.data.data);
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
    setTitle("");
    setRefresh(!refresh);
  };

  // 加载列表
  useEffect(() => {
    getList();
  }, [category_ids, dep_ids, refresh, page, size]);

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

  return (
    <>
      <Row>
        <Col span={4}>
          <div className="playedu-main-body" style={{ marginLeft: -24 }}>
            <div className="float-left mb-24">
              <div className="d-flex mb-24">
                <Typography.Text>资源分类：</Typography.Text>
              </div>
              <TreeCategory onUpdate={(keys: any) => setCategoryIds(keys)} />
            </div>
            <div className="float-left">
              <div className="d-flex mb-24">
                <Typography.Text>部门：</Typography.Text>
              </div>
              <TreeDepartment onUpdate={(keys: any) => setDepIds(keys)} />
            </div>
          </div>
        </Col>
        <Col span={20}>
          <div className="playedu-main-top mb-24">
            <div className="float-left d-flex">
              <div className="d-flex mr-24">
                <Typography.Text>课程名称：</Typography.Text>
                <Input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  style={{ width: 160 }}
                  placeholder="请输入课程名称"
                />
              </div>
              <div className="d-flex mr-24">
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
          <div className="playedu-main-body only">
            <div className="float-left j-b-flex mb-24">
              <div className="d-flex">
                <Link style={{ textDecoration: "none" }} to={`/course/create`}>
                  <PerButton
                    type="primary"
                    text="新建"
                    class="mr-16"
                    icon={<PlusOutlined />}
                    p="course"
                    onClick={() => null}
                  />
                </Link>
              </div>
              <div className="d-flex">
                <Button
                  type="link"
                  icon={<ReloadOutlined />}
                  style={{ color: "#333333" }}
                  onClick={() => {
                    setRefresh(!refresh);
                  }}
                ></Button>
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
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};
