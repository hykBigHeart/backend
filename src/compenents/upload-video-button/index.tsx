import { InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  message,
  Modal,
  Progress,
  Row,
  Table,
  Tag,
  Upload,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useRef, useState } from "react";
import { generateUUID } from "../../utils";
import { minioUploadId } from "../../api/upload";
import { UploadChunk } from "../../js/minio-upload-chunk";
import { storeResource } from "../../api/resource";

interface PropsInterface {
  categoryId: number;
  onUpdate: () => void;
}

interface FileItem {
  id: string;
  name: string;
  duration: number;
  size: number;
  progress: number;
  file: File;
  resourceType: string;
  loading: boolean;
  run: UploadChunk;
  isSuc: boolean;
  isErr: boolean;
  errMsg: string;
  remoteName: string;
}

export const UploadVideoButton = (props: PropsInterface) => {
  const [showModal, setShowModal] = useState(false);
  const localFileList = useRef<FileItem[]>([]);
  const [fileList, setFileList] = useState<FileItem[]>([]);

  const getMinioUploadId = async () => {
    let resp: any = await minioUploadId("mp4");
    return resp.data;
  };

  const uploadProps = {
    multiple: true,
    beforeUpload: async (file: File) => {
      if (file.type === "video/mp4") {
        //添加到本地待上传
        let data = await getMinioUploadId();
        let run = new UploadChunk(file, data["upload_id"], data["filename"]);
        let item: FileItem = {
          id: generateUUID(),
          duration: 0,
          name: file.name,
          size: file.size,
          progress: 0,
          file: file,
          resourceType: data["resource_type"],
          loading: true,
          run: run,
          isSuc: false,
          isErr: false,
          errMsg: "",
          remoteName: data["filename"],
        };
        item.run.on("success", (url: string) => {
          item.isSuc = true;
          setFileList([...localFileList.current]);

          // 创建上传记录
          storeResource(
            props.categoryId,
            item.file.name,
            "mp4",
            item.file.size,
            "minio",
            "",
            item.remoteName,
            url,
            {
              duration: item.duration,
            }
          ).then(() => {
            message.success(`${item.file.name} 上传成功`);
          });
        });
        item.run.on("retry", () => {
          item.isErr = false;
          item.errMsg = "";
          setFileList([...localFileList.current]);
        });
        item.run.on("progress", (progress: number) => {
          item.progress = progress;
          setFileList([...localFileList.current]);
        });
        item.run.on("error", (msg: string) => {
          item.isErr = true;
          item.errMsg = msg;
          setFileList([...localFileList.current]);
        });
        setTimeout(() => {
          item.run.start();
        }, 500);
        localFileList.current.push(item);
        setFileList([...localFileList.current]);
      } else {
        message.error(`${file.name} 并不是 mp4 视频文件`);
      }
      return Upload.LIST_IGNORE;
    },
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setShowModal(true);
        }}
      >
        上传视频
      </Button>

      <div className="none">
        {fileList.length > 0 &&
          fileList.map((item) => (
            <video
              key={item.id}
              src={URL.createObjectURL(item.file)}
              onCanPlayThrough={(e: any) => {
                item.duration = parseInt(e.target.duration);
                item.loading = false;
              }}
            ></video>
          ))}
      </div>

      {showModal && (
        <Modal
          width={800}
          title="上传视频"
          open={true}
          onCancel={() => {
            setShowModal(false);
            props.onUpdate();
          }}
          maskClosable={false}
          closable={false}
          onOk={() => {
            setShowModal(false);
            props.onUpdate();
          }}
        >
          <Row gutter={[0, 10]}>
            <Col span={24}>
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">请将视频拖拽到此处上传</p>
                <p className="ant-upload-hint">
                  支持一次上传多个 / 支持 mp4 格式视频
                </p>
              </Dragger>
            </Col>
            <Col span={24}>
              <Table
                pagination={false}
                rowKey="id"
                columns={[
                  {
                    title: "视频",
                    dataIndex: "name",
                    key: "name",
                  },
                  {
                    title: "大小",
                    dataIndex: "size",
                    key: "size",
                    render: (_, record) => (
                      <span>{(record.size / 1024 / 1024).toFixed(2)} M</span>
                    ),
                  },
                  {
                    title: "进度",
                    dataIndex: "progress",
                    key: "progress",
                    render: (_, record: FileItem) => (
                      <>
                        {record.progress === 0 && "等待上传"}
                        {record.progress > 0 && (
                          <Progress
                            size="small"
                            steps={20}
                            percent={record.progress}
                          />
                        )}
                      </>
                    ),
                  },
                  {
                    title: "操作",
                    key: "action",
                    render: (_, record) => (
                      <>
                        {record.progress > 0 &&
                          record.isSuc === false &&
                          record.isErr === false && (
                            <Button
                              type="link"
                              onClick={() => {
                                record.run.cancel();
                              }}
                            >
                              取消
                            </Button>
                          )}

                        {record.isErr && (
                          <>
                            <Tag color="red">{record.errMsg}</Tag>
                            <Button
                              type="link"
                              onClick={() => {
                                record.run.retry();
                              }}
                            >
                              继续上传
                            </Button>
                          </>
                        )}
                      </>
                    ),
                  },
                ]}
                dataSource={fileList}
              />
            </Col>
          </Row>
        </Modal>
      )}
    </>
  );
};
