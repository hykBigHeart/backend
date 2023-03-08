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
import { resource, resourceCategory } from "../../../api";
import styles from "./index.module.less";
import { CreateResourceCategory } from "../../../compenents/create-rs-category";
import { CloseOutlined } from "@ant-design/icons";
import { UploadImageSub } from "../../../compenents/upload-image-button/upload-image-sub";
import { TreeCategory, PerButton } from "../../../compenents";

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

export const ResourceImagesPage = () => {
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
  const [category_ids, setCategoryIds] = useState<any>([]);

  // 获取图片资源的分类
  const getCategories = () => {
    resourceCategory.resourceCategoryList().then((res: any) => {
      let data = res.data.data;
      if (data.length > 0) {
        setCategories([...categories, ...res.data.data]);
      }
    });
  };
  // 删除资源分类
  const removeCategory = (id: number) => {
    if (id === 0) {
      return;
    }
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
      <Row>
        <Col span={4}>
          <div className="playedu-main-body" style={{ marginLeft: -24 }}>
            <TreeCategory onUpdate={(keys: any) => setCategoryIds(keys)} />
          </div>
        </Col>
        <Col span={20}>
          <div className="playedu-main-body">
            <Row gutter={16}>
              <Col span={4}>
                <>
                  <div className={styles.categoryTitle}>
                    <div>图片分类</div>
                    <div className="ml-15">
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
                      {item.id !== 0 && (
                        <Button
                          className="ml-15"
                          danger
                          shape="circle"
                          size="small"
                          onClick={() => {
                            removeCategory(item.id);
                          }}
                          icon={<CloseOutlined />}
                        />
                      )}
                    </div>
                  ))}
                </>
              </Col>
              <Col span={20}>
                <Row style={{ marginBottom: 24 }}>
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
                        console.log(item.url);
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
          </div>
        </Col>
      </Row>
    </>
  );
};
