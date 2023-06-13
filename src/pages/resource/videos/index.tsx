import { useEffect, useState } from "react";
import { Modal, Table, message, Space, Dropdown, Button } from "antd";
import type { MenuProps } from "antd";
import { resource } from "../../../api";
// import styles from "./index.module.less";
import { useLocation } from "react-router-dom";
import { DownOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { dateFormat } from "../../../utils/index";
import { TreeCategory, DurationText, PerButton } from "../../../compenents";
import { UploadVideoButton } from "../../../compenents/upload-video-button";
import { VideoPlayDialog } from "./compenents/video-play-dialog";
import { VideosUpdateDialog } from "./compenents/update-dialog";

const { confirm } = Modal;

interface DataType {
  id: React.Key;
  name: string;
  created_at: string;
  disk: string;
}

const ResourceVideosPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const [videoList, setVideoList] = useState<any>([]);
  const [videosExtra, setVideoExtra] = useState<any>([]);
  const [adminUsers, setAdminUsers] = useState<any>({});
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [category_ids, setCategoryIds] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selLabel, setLabel] = useState<string>(
    result.get("label") ? String(result.get("label")) : "全部视频"
  );
  const [cateId, setCateId] = useState(Number(result.get("cid")));
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [playVisible, setPlayeVisible] = useState<boolean>(false);
  const [multiConfig, setMultiConfig] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState(0);
  const [playUrl, setPlayUrl] = useState<string>("");

  useEffect(() => {
    setCateId(Number(result.get("cid")));
    if (Number(result.get("cid"))) {
      let arr = [];
      arr.push(Number(result.get("cid")));
      setCategoryIds(arr);
    }
  }, [result.get("cid")]);

  const columns: ColumnsType<DataType> = [
    {
      title: "视频名称",
      dataIndex: "name",
      render: (text: string) => (
        <div className="d-flex">
          <i
            className="iconfont icon-icon-video"
            style={{
              fontSize: 16,
              color: "rgba(0,0,0,0.3)",
            }}
          />
          <span className="ml-8">{text}</span>
        </div>
      ),
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
      dataIndex: "admin_id",
      render: (text: number) =>
        JSON.stringify(adminUsers) !== "{}" && <span>{adminUsers[text]}</span>,
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
      width: 160,
      render: (_, record: any) => {
        const items: MenuProps["items"] = [
          {
            key: "1",
            label: (
              <Button
                type="link"
                className="b-link c-red"
                onClick={() => {
                  setUpdateId(record.id);
                  setUpdateVisible(true);
                }}
              >
                编辑
              </Button>
            ),
          },
          {
            key: "2",
            label: (
              <Button
                type="link"
                className="b-link c-red"
                onClick={() => removeResource(record.id)}
              >
                删除
              </Button>
            ),
          },
        ];

        return (
          <Space size="small">
            <Button
              type="link"
              size="small"
              className="b-n-link c-red"
              onClick={() => {
                setUpdateId(record.id);
                setPlayUrl(record.url);
                setPlayeVisible(true);
              }}
            >
              预览
            </Button>
            <div className="form-column"></div>
            <Dropdown menu={{ items }}>
              <Button
                type="link"
                className="b-link c-red"
                onClick={(e) => e.preventDefault()}
              >
                <Space size="small" align="center">
                  更多
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  // 删除图片
  const removeResource = (id: number) => {
    if (id === 0) {
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "删除前请检查选中视频文件无关联课程，确认删除？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        resource.destroyResource(id).then(() => {
          message.success("删除成功");
          resetVideoList();
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const removeResourceMulti = () => {
    if (selectedRowKeys.length === 0) {
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "删除前请检查选中视频文件无关联课程，确认删除？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        resource.destroyResourceMulti(selectedRowKeys).then(() => {
          message.success("删除成功");
          resetVideoList();
        });
      },
      onCancel() {
        console.log("Cancel");
      },
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
        setAdminUsers(res.data.admin_users);
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
    setSelectedRowKeys([]);
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

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <>
      <div className="tree-main-body">
        <div className="left-box">
          <TreeCategory
            selected={category_ids}
            type="no-cate"
            text={"视频"}
            onUpdate={(keys: any, title: any) => {
              setPage(1);
              setCategoryIds(keys);
              if (typeof title === "string") {
                setLabel(title);
              } else {
                setLabel(title.props.children[0]);
              }
            }}
          />
        </div>
        <div className="right-box">
          <div className="d-flex playedu-main-title float-left mb-24">
            视频 | {selLabel}
          </div>
          <div className="float-left  j-b-flex  mb-24">
            <div>
              <UploadVideoButton
                categoryIds={category_ids}
                onUpdate={() => {
                  resetVideoList();
                }}
              ></UploadVideoButton>
            </div>
            <div className="d-flex">
              <Button
                type="primary"
                className="mr-16"
                onClick={() => {
                  setSelectedRowKeys([]);
                  setMultiConfig(!multiConfig);
                }}
              >
                {multiConfig ? "取消操作" : "批量操作"}
              </Button>
              <Button
                type="default"
                onClick={() => removeResourceMulti()}
                disabled={selectedRowKeys.length === 0}
              >
                删除
              </Button>
            </div>
          </div>
          <div className="float-left">
            {multiConfig ? (
              <Table
                rowSelection={{
                  type: "checkbox",
                  ...rowSelection,
                }}
                columns={columns}
                dataSource={videoList}
                loading={loading}
                pagination={paginationProps}
                rowKey={(record) => record.id}
              />
            ) : (
              <Table
                columns={columns}
                dataSource={videoList}
                loading={loading}
                pagination={paginationProps}
                rowKey={(record) => record.id}
              />
            )}
          </div>
        </div>
        <VideoPlayDialog
          id={Number(updateId)}
          open={playVisible}
          url={playUrl}
          onCancel={() => setPlayeVisible(false)}
        ></VideoPlayDialog>
        <VideosUpdateDialog
          id={Number(updateId)}
          open={updateVisible}
          onCancel={() => setUpdateVisible(false)}
          onSuccess={() => {
            setUpdateVisible(false);
            setRefresh(!refresh);
          }}
        ></VideosUpdateDialog>
      </div>
    </>
  );
};

export default ResourceVideosPage;
