import { useEffect, useState } from "react";
import { Table, Typography, Input, Select, Button, DatePicker } from "antd";
import { adminLog } from "../../../api";
// import styles from "./index.module.less";
import type { ColumnsType } from "antd/es/table";
import { dateWholeFormat } from "../../../utils/index";
const { RangePicker } = DatePicker;
import moment from "moment";

interface DataType {
  id: React.Key;
  admin_id: number;
  ip: string;
  opt: string;
  admin_name: string;
  module: string;
  created_at: string;
  title: string;
  ip_area: string;
}

const SystemLogPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [title, setTitle] = useState("");
  const [adminId, setAdminId] = useState(0);
  const [created_at, setCreatedAt] = useState<any>([]);
  const [createdAts, setCreatedAts] = useState<any>([]);

  useEffect(() => {
    getData();
  }, [refresh, page, size]);

  const getData = () => {
    setLoading(true);
    adminLog
      .adminLogList(
        page,
        size,
        adminId > 0 ? adminId : null,
        title,
        "",
        created_at[0],
        created_at[1]
      )
      .then((res: any) => {
        setList(res.data.data);
        setTotal(res.data.total);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const resetData = () => {
    setTitle("");
    setAdminId(0);
    setPage(1);
    setSize(10);
    setList([]);
    setCreatedAts([]);
    setCreatedAt([]);
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

  const disabledDate = (current: any) => {
    return current && current >= moment().add(0, "days"); // 选择时间要大于等于当前天。若今天不能被选择，去掉等号即可。
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      width: 100,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "管理员",
      width: 150,
      render: (_, record: any) => <span>{record.admin_name}</span>,
    },
    {
      title: "标题",
      render: (_, record: any) => <span>{record.title}</span>,
    },
    {
      title: "IP地区",
      width: 250,
      dataIndex: "ip_area",
      render: (ip_area: string) => <span>{ip_area}</span>,
    },
    {
      title: "时间",
      width: 200,
      dataIndex: "created_at",
      render: (created_at: string) => (
        <span>{dateWholeFormat(created_at)}</span>
      ),
    },
  ];

  return (
    <div className="playedu-main-body">
      <div className="float-left j-b-flex mb-24">
        <div className="d-flex"></div>
        <div className="d-flex">
          <div className="d-flex mr-24">
            <RangePicker
              disabledDate={disabledDate}
              format={"YYYY-MM-DD"}
              value={createdAts}
              style={{ marginLeft: 10 }}
              onChange={(date, dateString) => {
                dateString[0] += " 00:00:00";
                dateString[1] += " 23:59:59";
                setCreatedAt(dateString);
                setCreatedAts(date);
              }}
              placeholder={["时间-开始", "时间-结束"]}
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
    </div>
  );
};

export default SystemLogPage;
