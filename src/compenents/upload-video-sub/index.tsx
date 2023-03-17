import { useEffect, useState } from "react";
import { Checkbox, Row, Col, Empty, message, Pagination } from "antd";
import { resource } from "../../api";
import styles from "./index.module.less";
import { UploadVideoButton } from "../upload-video-button";
import { DurationText, TreeCategory } from "../../compenents";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { CheckboxValueType } from "antd/es/checkbox/Group";

const CheckboxGroup = Checkbox.Group;

interface VideoItem {
  id: number;
  category_id: number;
  name: string;
  duration: number;
}

interface PropsInterface {
  defaultCheckedList: any[];
  label: string;
  open: boolean;
  onSelected: (arr: any[], videos: []) => void;
}

export const UploadVideoSub = (props: PropsInterface) => {
  const [category_ids, setCategoryIds] = useState<any>([]);

  const [videoList, setVideoList] = useState<VideoItem[]>([]);
  const [videosExtra, setVideoExtra] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [pureTotal, setPureTotal] = useState(0);
  const [categoryCount, setCategoryCount] = useState<any>({});

  const [plainOptions, setPlainOptions] = useState<any>([]);
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  // 获取列表
  const getvideoList = () => {
    let categoryIds = category_ids.join(",");
    resource
      .resourceList(page, size, "", "", "", "VIDEO", categoryIds)
      .then((res: any) => {
        setTotal(res.data.result.total);
        setVideoExtra(res.data.videos_extra);
        setCategoryCount(res.data.category_count);
        setPureTotal(res.data.pure_total);
        setVideoList(res.data.result.data);
        let data = res.data.result.data;
        const arr = [];
        for (let i = 0; i < data.length; i++) {
          arr.push({
            label: (
              <div className="d-flex">
                <i
                  className="iconfont icon-icon-video"
                  style={{
                    fontSize: 16,
                    color: "rgba(0,0,0,0.3)",
                  }}
                />
                <div className="video-title ml-8">{data[i].name}</div>
                <div className="video-time">
                  <DurationText
                    duration={res.data.videos_extra[data[i].id].duration}
                  ></DurationText>
                </div>
              </div>
            ),
            value: data[i].id,
          });
        }
        setPlainOptions(arr);
      })
      .catch((err) => {
        console.log("错误,", err);
      });
  };
  // 重置列表
  const resetVideoList = () => {
    setPage(1);
    setVideoList([]);
    setRefresh(!refresh);
  };
  //重置选中的key
  useEffect(() => {
    const arr = [...props.defaultCheckedList];
    setCheckedList(arr);
    if (arr.length === 0) {
      setIndeterminate(false);
      setCheckAll(false);
    }
  }, [props.defaultCheckedList]);

  // 加载列表
  useEffect(() => {
    getvideoList();
  }, [props.open, category_ids, refresh, page, size]);

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
    let arrVideos: any = [];
    for (let i = 0; i < list.length; i++) {
      videoList.map((item: any) => {
        if (item.id === list[i]) {
          arrVideos.push({
            name: item.name,
            type: item.type,
            rid: item.id,
            duration: videosExtra[item.id].duration,
          });
        }
      });
    }

    props.onSelected(list, arrVideos);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const arr = plainOptions.map((item: any) => item.value);
    setCheckedList(e.target.checked ? arr : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    let arrVideos: any = [];
    videoList.map((item: any) => {
      arrVideos.push({
        name: item.name,
        type: item.type,
        rid: item.id,
        duration: videosExtra[item.id].duration,
      });
    });
    if (e.target.checked) {
      props.onSelected(arr, arrVideos);
    } else {
      props.onSelected([], []);
    }
  };

  return (
    <>
      <Row style={{ width: 752, minHeight: 520 }}>
        <Col span={7}>
          <TreeCategory
            type="no-cate"
            resourceTotal={pureTotal}
            categoryCount={{ categoryCount }}
            text={props.label}
            onUpdate={(keys: any) => setCategoryIds(keys)}
          />
        </Col>
        <Col span={17}>
          <Row style={{ marginBottom: 24, paddingLeft: 10 }}>
            <Col span={24}>
              <UploadVideoButton
                categoryIds={category_ids}
                onUpdate={() => {
                  resetVideoList();
                }}
              ></UploadVideoButton>
            </Col>
          </Row>
          <div className={styles["video-list"]}>
            {videoList.length === 0 && (
              <Col span={24} style={{ marginTop: 150 }}>
                <Empty description="暂无视频" />
              </Col>
            )}
            {videoList.length > 0 && (
              <div className="list-select-column-box c-flex">
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={onCheckAllChange}
                  checked={checkAll}
                >
                  全选
                </Checkbox>
                <CheckboxGroup
                  className="c-flex"
                  options={plainOptions}
                  value={checkedList}
                  onChange={onChange}
                />
              </div>
            )}
            {/* {videoList.map((item) => (
              <div className={styles["video-item"]} key={item.id}>
                {item.name}
              </div>
            ))} */}
          </div>
          <Row
            style={{
              paddingLeft: 10,
            }}
          >
            {videoList.length > 0 && (
              <Col
                span={24}
                style={{ display: "flex", flexDirection: "row-reverse" }}
              >
                <Pagination
                  onChange={(currentPage, currentSize) => {
                    setPage(currentPage);
                    setSize(currentSize);
                  }}
                  defaultCurrent={page}
                  total={total}
                />
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </>
  );
};
