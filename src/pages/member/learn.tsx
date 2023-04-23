import { useState, useEffect, useRef } from "react";
import styles from "./learn.module.less";
import { Row, Image, Table } from "antd";
import { useLocation } from "react-router-dom";
import { BackBartment, DurationText } from "../../compenents";
import { dateFormat } from "../../utils/index";
import { user as member } from "../../api/index";
import * as echarts from "echarts";
import type { ColumnsType } from "antd/es/table";
import { duration } from "moment";

interface DataType {
  id: React.Key;
  title: string;
  type: string;
  created_at: string;
  total_duration: number;
  finished_duration: number;
  is_finished: boolean;
}

const MemberLearnPage = () => {
  let chartRef = useRef(null);
  const result = new URLSearchParams(useLocation().search);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [list, setList] = useState<any>([]);
  const [hours, setHours] = useState<any>({});
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [page2, setPage2] = useState(1);
  const [size2, setSize2] = useState(10);
  const [list2, setList2] = useState<any>([]);
  const [courses, setCourses] = useState<any>({});
  const [total2, setTotal2] = useState(0);
  const [refresh2, setRefresh2] = useState(false);
  const [uid, setUid] = useState(Number(result.get("id")));

  useEffect(() => {
    setUid(Number(result.get("id")));
  }, [Number(result.get("id"))]);

  useEffect(() => {
    getZxtData();
    return () => {
      window.onresize = null;
    };
  }, [uid]);

  useEffect(() => {
    getLearnHours();
  }, [refresh, page, size, uid]);

  useEffect(() => {
    getLearnCourses();
  }, [refresh2, page2, size2, uid]);

  const getZxtData = () => {
    member.learnStats(uid).then((res: any) => {
      renderView(res.data);
    });
  };

  const minuteFormat = (duration: number) => {
    if (duration === 0) {
      return "0小时0分0秒";
    }
    let h = Math.trunc(duration / 3600);
    let m = Math.trunc((duration % 3600) / 60);
    let s = Math.trunc((duration % 3600) % 60);
    return h + "小时" + m + "分" + s + "秒";
  };

  const renderView = (params: any) => {
    const timeData: any = [];
    const valueData: any = [];
    params.map((item: any) => {
      timeData.push(item.key);
      valueData.push(item.value / 1000);
    });
    let dom: any = chartRef.current;
    let myChart = echarts.init(dom);
    myChart.setOption({
      tooltip: {
        trigger: "axis",
        formatter: function (params: any) {
          //  只粘贴formatter了
          let relVal = params[0].axisValueLabel;
          for (let i = 0; i < params.length; i++) {
            relVal +=
              "<br/>" +
              params[i].marker +
              params[i].seriesName +
              ":  " +
              minuteFormat(params[i].value);
          }
          return relVal;
        },
      },
      legend: {
        data: ["每日学习时长"],
        x: "right",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: timeData,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "每日学习时长",
          type: "line",
          data: valueData,
          color: "#ff4d4f",
        },
      ],
    });
    window.onresize = () => {
      myChart.resize();
    };
  };

  const getLearnHours = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    member
      .learnHours(uid, page, size, {
        sort_field: "",
        sort_algo: "",
        is_finished: "",
      })
      .then((res: any) => {
        setList(res.data.data);
        setHours(res.data.hours);
        setTotal(res.data.total);
        setLoading(false);
      });
  };

  const getLearnCourses = () => {
    if (loading2) {
      return;
    }
    setLoading2(true);
    member
      .learnCourses(uid, page2, size2, {
        sort_field: "",
        sort_algo: "",
        is_finished: "",
      })
      .then((res: any) => {
        setList2(res.data.data);
        setCourses(res.data.courses);
        setTotal2(res.data.total);
        setLoading2(false);
      });
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

  const paginationProps2 = {
    current: page2, //当前页码
    pageSize: size2,
    total: total2, // 总条数
    onChange: (page: number, pageSize: number) =>
      handlePageChange2(page, pageSize), //改变页码的函数
    showSizeChanger: true,
  };

  const handlePageChange2 = (page: number, pageSize: number) => {
    setPage2(page);
    setSize2(pageSize);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "课时标题",
      dataIndex: "title",
      render: (_, record: any) => (
        <>
          <span>{hours[record.hour_id].title}</span>
        </>
      ),
    },
    {
      title: "课时类型",
      dataIndex: "type",
      render: (_, record: any) => (
        <>
          <span>{hours[record.hour_id].type}</span>
        </>
      ),
    },
    {
      title: "总时长",
      dataIndex: "total_duration",
      render: (_, record: any) => (
        <>
          <DurationText duration={record.total_duration}></DurationText>
        </>
      ),
    },
    {
      title: "已学习时长",
      dataIndex: "finished_duration",
      render: (_, record: any) => (
        <>
          <DurationText duration={record.finished_duration || 0}></DurationText>
        </>
      ),
    },
    {
      title: "状态",
      dataIndex: "is_finished",
      render: (_, record: any) => (
        <>
          {record.is_finished === 1 ? <span>已学完</span> : <span>未学完</span>}
        </>
      ),
    },
    {
      title: "时间",
      dataIndex: "created_at",
      render: (text: string) => <span>{dateFormat(text)}</span>,
    },
  ];

  const column2: ColumnsType<DataType> = [
    {
      title: "课程名称",
      dataIndex: "title",
      render: (_, record: any) => (
        <div className="d-flex">
          <Image
            src={courses[record.course_id].thumb}
            preview={false}
            width={80}
            height={60}
            style={{ borderRadius: 6 }}
          />
          <span className="ml-8">{courses[record.course_id].title}</span>
        </div>
      ),
    },
    {
      title: "课程进度",
      dataIndex: "total_duration",
      render: (_, record: any) => (
        <>
          <span>
            已完成课时：{record.finished_count} / {record.hour_count}
          </span>
        </>
      ),
    },
    {
      title: "第一次学习时间",
      dataIndex: "created_at",
      render: (text: string) => <span>{dateFormat(text)}</span>,
    },
    {
      title: "学习完成时间",
      dataIndex: "finished_at",
      render: (text: string) => <span>{dateFormat(text)}</span>,
    },
    {
      title: "学习进度",
      dataIndex: "is_finished",
      render: (_, record: any) => (
        <>
          <span
            className={
              Math.floor((record.finished_count / record.hour_count) * 100) >=
              100
                ? "c-green"
                : "c-red"
            }
          >
            {Math.floor((record.finished_count / record.hour_count) * 100)}%
          </span>
        </>
      ),
    },
  ];

  return (
    <>
      <Row className="playedu-main-top mb-24">
        <div className="float-left mb-24">
          <BackBartment title="学员学习" />
        </div>
        <div className={styles["charts"]}>
          <div
            ref={chartRef}
            style={{
              width: "100% !important",
              height: 300,
              position: "relative",
            }}
          ></div>
        </div>
        <div className="float-left mt-24">
          <Table
            columns={column2}
            dataSource={list2}
            loading={loading2}
            pagination={paginationProps2}
            rowKey={(record) => record.id}
          />
        </div>
      </Row>
      {/* <div className="playedu-main-top mb-24">
        <div className={styles["large-title"]}>课时学习记录</div>
        <div className="float-left mt-24">
          <Table
            columns={columns}
            dataSource={list}
            loading={loading}
            pagination={paginationProps}
            rowKey={(record) => record.id}
          />
        </div>
      </div> */}
    </>
  );
};
export default MemberLearnPage;
