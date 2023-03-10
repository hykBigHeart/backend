import { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Popconfirm,
  Image,
  Empty,
  Table,
  message,
  Space,
} from "antd";
import { resource } from "../../../api";
import styles from "./index.module.less";
import { CloseOutlined } from "@ant-design/icons";
import { UploadImageSub } from "../../../compenents/upload-image-button/upload-image-sub";
import type { ColumnsType } from "antd/es/table";
import { dateFormat } from "../../../utils/index";
import { TreeCategory, DurationText } from "../../../compenents";
import { UploadVideoButton } from "../../../compenents/upload-video-button";

interface DataType {
  id: React.Key;
  name: string;
  created_at: string;
  disk: string;
}

export const ResourceVideosPage = () => {
  const [videoList, setVideoList] = useState<any>([]);
  const [videosExtra, setVideoExtra] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [category_ids, setCategoryIds] = useState<any>([]);

  const columns: ColumnsType<DataType> = [
    {
      title: "封面",
      dataIndex: "id",
      render: (id: string) => (
        <Image
          preview={false}
          width={120}
          height={80}
          src={videosExtra[id].poster}
        ></Image>
      ),
    },
    {
      title: "视频名称",
      dataIndex: "name",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "视频时长",
      dataIndex: "id",
      render: (id: string) => (
        <DurationText duration={videosExtra[id].duration}></DurationText>
      ),
    },
    {
      title: "创建人",
      dataIndex: "disk",
    },
    {
      title: "视频时长",
      dataIndex: "created_at",
      render: (text: string) => <span>{dateFormat(text)}</span>,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, record: any) => (
        <Space size="small">
          <Button type="link" className="b-link c-red" onClick={() => null}>
            编辑
          </Button>
          <Popconfirm
            title="警告"
            description="即将删除此账号，确认操作？"
            onConfirm={() => removeResource(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" className="b-link c-red" onClick={() => null}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 删除图片
  const removeResource = (id: number) => {
    if (id === 0) {
      return;
    }
    resource.destroyResource(id).then(() => {
      message.success("删除成功");
      resetVideoList();
    });
  };

  // 获取视频列表
  const getVideoList = () => {
    setLoading(true);
    let categoryIds = category_ids.join(",");
    resource
      .resourceList(page, size, "", "", "", "VIDEO", categoryIds)
      .then((res: any) => {
        setTotal(res.data.result.total);
        setVideoList(res.data.result.data);
        setVideoExtra(res.data.videos_extra);
        setLoading(false);
      })
      .catch((err: any) => {
        console.log("错误,", err);
      });
  };
  // 重置列表
  const resetVideoList = () => {
    setPage(1);
    setSize(10);
    setVideoList([]);
    setRefresh(!refresh);
  };

  // 加载视频列表
  useEffect(() => {
    getVideoList();
  }, [category_ids, refresh, page, size]);

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
            <TreeCategory onUpdate={(keys: any) => setCategoryIds(keys)} />
          </div>
        </Col>
        <Col span={20}>
          <div className="playedu-main-body">
            <div className="float-left mb-24">
              <UploadVideoButton
                categoryIds={category_ids}
                onUpdate={() => {
                  resetVideoList();
                }}
              ></UploadVideoButton>
            </div>
            <div className="float-left">
              <Table
                columns={columns}
                dataSource={videoList}
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
