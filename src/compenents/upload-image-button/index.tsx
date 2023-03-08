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
import { resource, resourceCategory } from "../../api";
import styles from "./index.module.less";
import { CreateResourceCategory } from "../create-rs-category";
import { CloseOutlined } from "@ant-design/icons";
import { UploadImageSub } from "./upload-image-sub";

interface CategoryItem {
  id: number;
  type: string;
  name: string;
  sort: number;
}

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

interface PropsInterface {
  onSelected: (url: string) => void;
}

export const UploadImageButton = (props: PropsInterface) => {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      id: 0,
      type: "IMAGE",
      name: "默认分类",
      sort: 0,
    },
  ]);
  const [defaultCid, setDefaultCid] = useState(0);
  const [refreshCategories, setRefreshCategories] = useState(1);

  const [imageList, setImageList] = useState<ImageItem[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(12);
  const [total, setTotal] = useState(0);

  // 获取图片资源的分类
  const getCategories = () => {
    resourceCategory.resourceCategoryList("IMAGE").then((res: any) => {
      let data = res.data.data;
      if (data.length > 0) {
        setCategories([...categories, ...res.data.data]);
      }
    });
  };
  // 删除资源分类
  const removeCategory = (id: number) => {
    resourceCategory.destroyResourceCategory(id).then(() => {
      message.success("删除成功");
      setRefreshCategories(refreshCategories + 1);
    });
  };

  // 获取图片列表
  const getImageList = () => {
    resource
      .resourceList(page, size, "", "", "", "IMAGE", defaultCid + "")
      .then((res: any) => {
        setTotal(res.data.result.total);
        setImageList(res.data.result.data);
      })
      .catch((err) => {
        console.log("错误,", err);
      });
  };
  // 重置列表
  const resetImageList = () => {
    setPage(1);
    setImageList([]);
    setRefresh(!refresh);
  };

  // 初始化加载数据
  useEffect(() => {
    getCategories();
  }, [refreshCategories]);

  // 加载图片列表
  useEffect(() => {
    getImageList();
  }, [defaultCid, refresh, page, size]);

  return (
    <>
      <Button
        onClick={() => {
          setShowModal(true);
        }}
      >
        上传图片
      </Button>

      {showModal && (
        <Modal
          title="图片素材库"
          closable={false}
          onCancel={() => {
            setShowModal(false);
          }}
          open={true}
          width="1000px"
          maskClosable={false}
        >
          <Row gutter={16}>
            <Col span={4}>
              <>
                <div className={styles.categoryTitle}>
                  <div>图片分类</div>
                  <div>
                    <CreateResourceCategory
                      type="IMAGE"
                      onUpdate={() => {
                        setRefreshCategories(refreshCategories + 1);
                      }}
                    ></CreateResourceCategory>
                  </div>
                </div>
                {categories.length === 0 && (
                  <Empty
                    description="暂无分类"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  ></Empty>
                )}

                {categories.map((item) => (
                  <div
                    key={item.id}
                    className={`${styles.categoryItem} ${
                      item.id === defaultCid ? "active" : ""
                    }`}
                    onClick={() => {
                      setDefaultCid(item.id);
                    }}
                  >
                    <div>{item.name}</div>
                    <div>
                      <Button
                        danger
                        shape="circle"
                        onClick={() => {
                          removeCategory(item.id);
                        }}
                        icon={<CloseOutlined />}
                      />
                    </div>
                  </div>
                ))}
              </>
            </Col>
            <Col span={20}>
              <Row>
                <Col span={24}>
                  <UploadImageSub
                    categoryId={defaultCid}
                    onUpdate={() => {
                      resetImageList();
                    }}
                  ></UploadImageSub>
                </Col>
              </Row>
              <Row
                gutter={[
                  { xs: 8, sm: 16, md: 24, lg: 32 },
                  { xs: 4, sm: 8, md: 12, lg: 16 },
                ]}
              >
                {imageList.length === 0 && (
                  <Col span={24}>
                    <Empty description="暂无图片" />
                  </Col>
                )}

                {imageList.map((item) => (
                  <Col
                    key={item.id}
                    span={6}
                    onClick={() => {
                      props.onSelected(item.url);
                      setShowModal(false);
                    }}
                  >
                    <Image
                      preview={false}
                      width={120}
                      height={80}
                      src={item.url}
                    />
                  </Col>
                ))}

                {imageList.length > 0 && (
                  <Col span={24}>
                    <Pagination
                      showSizeChanger
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
        </Modal>
      )}
    </>
  );
};
