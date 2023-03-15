import { useEffect, useState } from "react";
import {
  Spin,
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
  const [visibleArr, setVisibleArr] = useState<any>([]);
  const [hoverArr, setHoverArr] = useState<any>([]);
  const [selLabel, setLabel] = useState<string>("全部图片");
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryCount, setCategoryCount] = useState<any>({});
  const [pureTotal, setPureTotal] = useState(0);

  // 删除图片
  const removeResource = () => {
    if (selectKey.length === 0) {
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除选中图片？",
      centered: true,
      okText: "确认",
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
    if (loading) {
      return;
    }
    setLoading(true);
    let categoryIds = category_ids.join(",");
    resource
      .resourceList(page, size, "", "", "", "IMAGE", categoryIds)
      .then((res: any) => {
        setTotal(res.data.result.total);
        setImageList(res.data.result.data);
        let data = res.data.result.data;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
          arr.push(false);
        }
        setVisibleArr(arr);
        setHoverArr(arr);
        setCategoryCount(res.data.category_count);
        setPureTotal(res.data.pure_total);
        setLoading(false);
      })
      .catch((err: any) => {
        setLoading(false);
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

  const onChange = (e: any, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    const arr = [...selectKey];
    if (arr.indexOf(id) === -1) {
      arr.push(id);
    } else {
      arr.splice(arr.indexOf(id), 1);
    }
    setSelectKey(arr);
  };

  const selectAll = () => {
    let arr = [];
    for (let i = 0; i < imageList.length; i++) {
      arr.push(imageList[i].id);
    }
    setSelectKey(arr);
  };

  const cancelAll = () => {
    setSelectKey([]);
  };

  const showImage = (index: number, value: boolean) => {
    const arr = [...visibleArr];
    arr[index] = value;
    setVisibleArr(arr);
  };

  const showHover = (index: number, value: boolean) => {
    const arr = [...hoverArr];
    for (let i = 0; i < arr.length; i++) {
      arr[i] = false;
    }
    arr[index] = value;
    setHoverArr(arr);
  };

  return (
    <>
      <div className="tree-main-body">
        <div className="left-box">
          <TreeCategory
            text={"图片"}
            categoryCount={categoryCount}
            resourceTotal={pureTotal}
            onUpdate={(keys: any, title: any) => {
              setCategoryIds(keys);
              if (typeof title == "string") {
                setLabel(title);
              } else {
                setLabel(title.props.children[0]);
              }
            }}
          />
        </div>
        <div className="right-box">
          <div className="d-flex playedu-main-title float-left mb-24">
            图片 / {selLabel}
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
                  {selectKey.length > 0 && (
                    <Button className="mr-16" onClick={() => cancelAll()}>
                      取消选择
                    </Button>
                  )}
                  {imageList.length !== 0 && (
                    <>
                      <Button className="mr-16" onClick={() => selectAll()}>
                        全选
                      </Button>
                      <PerButton
                        disabled={selectKey.length === 0}
                        type="primary"
                        text="删除"
                        class=""
                        icon={null}
                        p="resource-destroy"
                        onClick={() => removeResource()}
                      />
                    </>
                  )}
                </div>
              </div>
            </Col>
          </Row>
          {loading && (
            <div className="float-left d-j-flex mt-24">
              <Spin size="large" />
            </div>
          )}
          {imageList.length === 0 && (
            <div className="d-flex">
              <Col span={24}>
                <Empty description="暂无图片" />
              </Col>
            </div>
          )}
          <div className={styles["images-box"]}>
            {imageList.map((item: any, index: number) => (
              <div
                key={item.id}
                className={`${styles.imageItem} ref-image-item`}
                style={{ backgroundImage: `url(${item.url})` }}
                onClick={() => showImage(index, true)}
                onMouseOver={() => showHover(index, true)}
                onMouseOut={() => showHover(index, false)}
              >
                {hoverArr[index] && (
                  <i
                    className={styles.checkbox}
                    onClick={(e) => onChange(e, item.id)}
                  ></i>
                )}
                {selectKey.indexOf(item.id) !== -1 && (
                  <i
                    className={styles.checked}
                    onClick={(e) => onChange(e, item.id)}
                  >
                    <CheckOutlined />
                  </i>
                )}
                <Image
                  width={200}
                  style={{ display: "none" }}
                  src={item.url}
                  preview={{
                    visible: visibleArr[index],
                    src: item.url,
                    onVisibleChange: (value) => {
                      showImage(index, value);
                    },
                  }}
                />
              </div>
            ))}
          </div>
          {imageList.length > 0 && (
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
                pageSize={size}
              />
            </Col>
          )}
        </div>
      </div>
    </>
  );
};
