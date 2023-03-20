import React, { useState, useEffect } from "react";
import styles from "./index.module.less";
import { Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";
import { DepartmentCreate } from "../department/compenents/create";
import { MemberCreate } from "../member/compenents/create";
import { CourseCreate } from "../course/compenents/create";
import banner from "../../assets/images/dashboard/img-a1.png";
import icon from "../../assets/images/dashboard/icon-more.png";
import iconN1 from "../../assets/images/dashboard/icon-n1.png";
import iconN2 from "../../assets/images/dashboard/icon-n2.png";
import iconN3 from "../../assets/images/dashboard/icon-n3.png";

export const Dashboard: React.FC<any> = () => {
  const navigate = useNavigate();
  const [departmentVisible, setDepartmentVisible] = useState<boolean>(false);
  const [memberVisible, setMembeVisible] = useState<boolean>(false);
  const [uploadVideoVisible, setUploadVideoVisible] = useState<boolean>(false);
  const [courseVisible, setCourseVisible] = useState<boolean>(false);

  useEffect(() => {
    renderPieView({
      videos_count: 30,
      images_count: 10,
    });
    return () => {
      window.onresize = null;
    };
  }, []);

  const renderPieView = (params: any) => {
    let num = params.videos_count + params.images_count;
    let data = [
      {
        name: "视频数",
        value: params.videos_count,
      },
      {
        name: "图片数",
        value: params.images_count,
      },
    ];
    var echarts = require("echarts");
    let myChart = echarts.init(document.getElementById("chartCircle"));
    myChart.setOption({
      legend: [
        {
          selectedMode: true, // 图例选择的模式，控制是否可以通过点击图例改变系列的显示状态。默认开启图例选择，可以设成 false 关闭。
          bottom: "10%",
          left: "center",
          textStyle: {
            // 图例的公用文本样式。
            fontSize: 14,
            color: " #333333",
          },
          data: ["视频数", "图片数"],
        },
      ],
      tooltip: {
        show: true, // 是否显示提示框
      },
      title: {
        text: "", //主标题
        left: "center", // 水平对齐方式
        bottom: 0,
        itemGap: 4, // 主副标题相隔间距
        textStyle: {
          // 主标题样式
          fontSize: 16,
          fontWeight: 400,
        },
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "60%"], // 环比 圈的大小
          center: ["50%", "40%"], // 图形在整个canvas中的位置
          color: ["#FE8650", "#FFB504"], // item的取色盘
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: "#fff", // 白边
            borderWidth: 2,
          },
          emphasis: {
            // 高亮item的样式
            disabled: true,
          },
          label: {
            show: true,
            position: "center",
            formatter: "总资源数" + num, // 可以自定义，也可以{a}{b}{c}这种
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
    });
    window.onresize = () => {
      myChart.resize();
    };
  };

  return (
    <>
      <Row gutter={24}>
        <DepartmentCreate
          open={departmentVisible}
          onCancel={() => {
            setDepartmentVisible(false);
          }}
        />
        <MemberCreate
          open={memberVisible}
          onCancel={() => {
            setMembeVisible(false);
          }}
        />
        <CourseCreate
          open={courseVisible}
          onCancel={() => {
            setCourseVisible(false);
          }}
        />
        <Col span={12}>
          <div className="playedu-main-top">
            <div className="j-b-flex">
              <div className={styles["label-item"]}>
                <div className={styles["label"]}>今日学习学员</div>
                <div className={styles["info"]}>
                  <div className={styles["num"]}>300</div>
                  <div className={styles["compare"]}>
                    <span className="mr-5">较昨日</span>
                    <span className="c-green">
                      <i className={styles["down"]}>&#9660;</i>100
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles["label-item"]}>
                <div className={styles["label"]}>总学员数</div>
                <div className={styles["info"]}>
                  <div className={styles["num"]}>3000</div>
                  <div className={styles["compare"]}>
                    <span className="mr-5">较昨日</span>
                    <span className="c-red">
                      <i className={styles["up"]}>&#9650;</i>100
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles["label-item"]}>
                <div className={styles["label"]}>线上课数</div>
                <div className={styles["info"]}>
                  <div className={styles["num"]}>20</div>
                </div>
              </div>
            </div>
          </div>
          <div className="playedu-main-top mt-24">
            <div className={styles["large-title"]}>快捷操作</div>
            <div className={styles["mode-box"]}>
              <div
                className={styles["link-mode"]}
                onClick={() => {
                  setMembeVisible(true);
                }}
              >
                <i
                  className="iconfont icon-adduser"
                  style={{ color: "#FF9F32", fontSize: 36 }}
                ></i>
                <span>添加学员</span>
              </div>
              <div className={styles["link-mode"]}>
                <i
                  className="iconfont icon-upvideo"
                  style={{ color: "#419FFF", fontSize: 36 }}
                ></i>
                <span>上传视频</span>
              </div>
              <div
                className={styles["link-mode"]}
                onClick={() => {
                  setCourseVisible(true);
                }}
              >
                <i
                  className="iconfont icon-onlinelesson"
                  style={{ color: "#B284FF", fontSize: 36 }}
                ></i>
                <span>新建线上课</span>
              </div>
              <div
                className={styles["link-mode"]}
                onClick={() => {
                  setDepartmentVisible(true);
                }}
              >
                <i
                  className="iconfont icon-department"
                  style={{ color: "#21C785", fontSize: 36 }}
                ></i>
                <span>添加部门</span>
              </div>
            </div>
          </div>
          <div className="playedu-main-top mt-24">
            <div className={styles["large-title"]}>今日学习排行</div>
            <div className={styles["rank-list"]}>
              <div className={styles["half-list"]}>
                <div className={styles["rank-item"]}>
                  <div className={styles["left-item"]}>
                    <img className={styles["item-icon"]} src={iconN1} alt="" />
                    <div className={styles["item-name"]}>忻咏</div>
                  </div>
                  <div className={styles["item-time"]}>1小时24秒</div>
                </div>
                <div className={styles["rank-item"]}>
                  <div className={styles["left-item"]}>
                    <img className={styles["item-icon"]} src={iconN2} alt="" />
                    <div className={styles["item-name"]}>蒋建</div>
                  </div>
                  <div className={styles["item-time"]}>1小时24秒</div>
                </div>
                <div className={styles["rank-item"]}>
                  <div className={styles["left-item"]}>
                    <img className={styles["item-icon"]} src={iconN3} alt="" />
                    <div className={styles["item-name"]}>谭茂</div>
                  </div>
                  <div className={styles["item-time"]}>1小时24秒</div>
                </div>
                <div className={styles["rank-item"]}>
                  <div className={styles["left-item"]}>
                    <div className={styles["item-num"]}>4</div>
                    <div className={styles["item-name"]}>渠雅眉</div>
                  </div>
                  <div className={styles["item-time"]}>1小时24秒</div>
                </div>
                <div className={styles["rank-item"]}>
                  <div className={styles["left-item"]}>
                    <div className={styles["item-num"]}>5</div>
                    <div className={styles["item-name"]}>柴晨</div>
                  </div>
                  <div className={styles["item-time"]}>1小时24秒</div>
                </div>
              </div>
              <div className={styles["half-list"]}>
                <div className={styles["rank-item"]}>
                  <div className={styles["left-item"]}>
                    <div className={styles["item-num"]}>6</div>
                    <div className={styles["item-name"]}>柴晨</div>
                  </div>
                  <div className={styles["item-time"]}>1小时24秒</div>
                </div>
                <div className={styles["rank-item"]}>
                  <div className={styles["left-item"]}>
                    <div className={styles["item-num"]}>7</div>
                    <div className={styles["item-name"]}>柴晨</div>
                  </div>
                  <div className={styles["item-time"]}>1小时24秒</div>
                </div>
                <div className={styles["rank-item"]}>
                  <div className={styles["left-item"]}>
                    <div className={styles["item-num"]}>8</div>
                    <div className={styles["item-name"]}>柴晨</div>
                  </div>
                  <div className={styles["item-time"]}>1小时24秒</div>
                </div>
                <div className={styles["rank-item"]}>
                  <div className={styles["left-item"]}>
                    <div className={styles["item-num"]}>9</div>
                    <div className={styles["item-name"]}>柴晨</div>
                  </div>
                  <div className={styles["item-time"]}>1小时24秒</div>
                </div>
                <div className={styles["rank-item"]}>
                  <div className={styles["left-item"]}>
                    <div className={styles["item-num"]}>10</div>
                    <div className={styles["item-name"]}>柴晨</div>
                  </div>
                  <div className={styles["item-time"]}>1小时24秒</div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="playedu-main-top">
            <div className="j-b-flex">
              <div className={styles["label-item"]}>
                <div className={styles["label"]}>部门数</div>
                <div className={styles["info"]}>
                  <div className={styles["num"]}>8</div>
                </div>
              </div>
              <div className={styles["label-item"]}>
                <div className={styles["label"]}>超级管理员</div>
                <div className={styles["info"]}>
                  <div className={styles["num"]}>2</div>
                </div>
              </div>
              <div className={styles["label-item"]}>
                <div className={styles["label"]}>子管理员</div>
                <div className={styles["info"]}>
                  <div className={styles["num"]}>8</div>
                </div>
              </div>
            </div>
          </div>
          <div className="playedu-main-top mt-24">
            <div className={styles["large-title"]}>使用指南</div>
            <div className={styles["usage-guide"]}>
              <img className={styles["banner"]} src={banner} alt="" />
              <div className={styles["link"]}>
                点击查看产品手册，快速玩转Playedu！
                <img className={styles["icon"]} src={icon} alt="" />
              </div>
            </div>
          </div>
          <div className="playedu-main-top mt-24">
            <div className={styles["large-title"]}>资源统计</div>
            <div className={styles["charts"]}>
              <div
                id="chartCircle"
                style={{ width: "100%", height: 280 }}
              ></div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};
