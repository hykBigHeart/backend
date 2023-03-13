import { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Modal,
  Image,
  Empty,
  message,
  Pagination,
} from "antd";
import { resource } from "../../../api";
import styles from "./index.module.less";
import { UploadImageSub } from "../../../compenents/upload-image-button/upload-image-sub";
import { TreeCategory, PerButton } from "../../../compenents";
import { ExclamationCircleFilled, CheckOutlined } from "@ant-design/icons";

const { confirm } = Modal;

interface ImageItem {
  id: number;
  category_id: number;
  name: string;
  extension: string;
  size: number;
  disk: string;
  file_id: string;
  path: string;
  url: string;
  created_at: string;
}

export const ResourceImagesPage = () => {
  const [imageList, setImageList] = useState<ImageItem[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(32);
  const [total, setTotal] = useState(0);
  const [category_ids, setCategoryIds] = useState<any>([]);
  const [selectKey, setSelectKey] = useState<any>([]);

  // 删除图片
  const removeResource = () => {
    if (selectKey.length === 0) {
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除选中图片？",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        resource.destroyResourceMulti(selectKey).then(() => {
          message.success("删除成功");
          resetImageList();
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // 获取图片列表
  const getImageList = () => {
    let categoryIds = category_ids.join(",");
    resource
      .resourceList(page, size, "", "", "", "IMAGE", categoryIds)
      .then((res: any) => {
        setTotal(res.data.result.total);
        setImageList(res.data.result.data);
      })
      .catch((err: any) => {
        console.log("错误,", err);
      });
  };
  // 重置列表
  const resetImageList = () => {
    setPage(1);
    setImageList([]);
    setRefresh(!refresh);
  };

  // 加载图片列表
  useEffect(() => {
    getImageList();
  }, [category_ids, refresh, page, size]);

  const onChange = (item: any, index: number) => {
    let arr = selectKey;
    if (arr.indexOf(item.id) === -1) {
      arr.push(item.id);
      setSelectKey(arr);
    } else {
      arr.splice(arr.indexOf(item.id), 1);
      setSelectKey(arr);
    }
    setRefresh(!refresh);
  };

  return (
    <>
      <div className="tree-main-body">
        <div className="left-box">
          <TreeCategory
            text={"图片"}
            onUpdate={(keys: any) => setCategoryIds(keys)}
          />
        </div>
        <div className="right-box">
          <div className="playedu-main-title float-left mb-24">
            图片 / 全部图片
          </div>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={24}>
              <div className="j-b-flex">
                <UploadImageSub
                  categoryIds={category_ids}
                  onUpdate={() => {
                    resetImageList();
                  }}
                ></UploadImageSub>
                <div className="d-flex">
                  <Button className="mr-16">全选</Button>
                  <PerButton
                    disabled={selectKey.length === 0}
                    type="primary"
                    text="删除"
                    class=""
                    icon={null}
                    p="resource-destroy"
                    onClick={() => removeResource()}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            {imageList.length === 0 && (
              <Col span={24}>
                <Empty description="暂无图片" />
              </Col>
            )}

            {imageList.map((item: any, index: number) => (
              <Col key={item.id} span={3}>
                <div className={styles.imageItem}>
                  <div
                    className={
                      selectKey.indexOf(item.id) === -1
                        ? styles.checkbox
                        : styles.checked
                    }
                    onClick={() => onChange(item, index)}
                  >
                    {selectKey.indexOf(item.id) !== -1 && <CheckOutlined />}
                  </div>
                  <Image
                    preview={true}
                    width={150}
                    height={150}
                    src={item.url}
                  />
                  {/* <Button
                    className={styles.closeButton}
                    danger
                    shape="circle"
                    icon={<CloseOutlined />}
                    onClick={() => removeResource(item.id)}
                  /> */}
                </div>
              </Col>
            ))}

            {imageList.length > 0 && (
              <Col
                span={24}
                style={{ display: "flex", flexDirection: "row-reverse" }}
              >
                <Pagination
                  showSizeChanger
                  onChange={(currentPage, currentSize) => {
                    setPage(currentPage);
                    setSize(currentSize);
                  }}
                  defaultCurrent={page}
                  total={total}
                  pageSize={size}
                />
              </Col>
            )}
          </Row>
        </div>
      </div>
    </>
  );
};
