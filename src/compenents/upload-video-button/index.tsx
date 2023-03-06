import { InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  message,
  Modal,
  Progress,
  Row,
  Table,
  Upload,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useEffect, useState } from "react";
import { generateUUID, getToken } from "../../utils";
import { minioUploadId } from "../../api/upload";
import { UploadChunk } from "../../js/minio-upload-chunk";

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
  resource_type: string;
  loading: boolean;
  run: UploadChunk;
}

export const UploadVideoButton = (props: PropsInterface) => {
  const [showModal, setShowModal] = useState(false);
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
        let item: FileItem = {
          id: generateUUID(),
          duration: 0,
          name: file.name,
          size: file.size,
          progress: 0,
          file: file,
          resource_type: data["resource_type"],
          loading: true,
          run: new UploadChunk(
            file,
            data["upload_id"],
            data["filename"]
          ),
        };
        item.run.start();
        setFileList([item, ...fileList]);
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
                            steps={10}
                            percent={record.progress}
                          />
                        )}
                      </>
                    ),
                  },
                  {
                    title: "操作",
                    key: "action",
                    render: (index, record) => (
                      <>
                        {record.progress === 0 && (
                          <Button
                            onClick={() => {
                              fileList.splice(index, 1);
                            }}
                          >
                            删除
                          </Button>
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
