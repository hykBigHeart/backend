import React, { useState, useEffect } from "react";
import { Button, Space, Tree, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "./index.module.less";
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { resourceCategory } from "../../../api/index";
import { dateFormat } from "../../../utils/index";
import { Link, useNavigate } from "react-router-dom";
import { PerButton } from "../../../compenents";
import type { DataNode, TreeProps } from "antd/es/tree";

const { confirm } = Modal;

interface Option {
  key: string | number;
  title: any;
  children?: Option[];
}

interface DataType {
  id: React.Key;
  name: string;
  created_at: string;
  sort: number;
}

export const ResourceCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState(false);
  const [treeData, setTreeData] = useState<any>([]);
  const [selectKey, setSelectKey] = useState<any>([]);

  useEffect(() => {
    getData();
  }, [refresh]);

  const onSelect = (selectedKeys: any, info: any) => {
    setSelectKey(selectedKeys);
    console.log(selectedKeys);
  };

  const getData = () => {
    setLoading(true);
    resourceCategory.resourceCategoryList().then((res: any) => {
      const categories = res.data.categories;
      if (JSON.stringify(categories) !== "{}") {
        const new_arr: Option[] = checkArr(categories, 0);
        setTreeData(new_arr);
      }
      setLoading(false);
    });
  };

  const checkArr = (categories: any[], id: number) => {
    const arr = [];
    for (let i = 0; i < categories[id].length; i++) {
      if (!categories[categories[id][i].id]) {
        arr.push({
          title: (
            <div className="d-flex">
              <div className="w-250px mr-24">{categories[id][i].name}</div>
              <Space size="small">
                <PerButton
                  type="link"
                  text="编辑"
                  class="b-link c-red"
                  icon={null}
                  p="resource-category"
                  onClick={() =>
                    navigate(
                      `/resource-category/update/${categories[id][i].id}`
                    )
                  }
                  disabled={null}
                />

                <PerButton
                  type="link"
                  text="删除"
                  class="b-link c-red"
                  icon={null}
                  p="resource-category"
                  onClick={() => delUser(categories[id][i].id)}
                  disabled={null}
                />
              </Space>
            </div>
          ),
          key: categories[id][i].id,
        });
      } else {
        const new_arr: Option[] = checkArr(categories, categories[id][i].id);
        arr.push({
          title: (
            <div className="d-flex">
              <div className="w-250px mr-24">{categories[id][i].name}</div>
              <Space size="small">
                <PerButton
                  type="link"
                  text="编辑"
                  class="b-link c-red"
                  icon={null}
                  p="resource-category"
                  onClick={() =>
                    navigate(
                      `/resource-category/update/${categories[id][i].id}`
                    )
                  }
                  disabled={null}
                />

                <PerButton
                  type="link"
                  text="删除"
                  class="b-link c-red"
                  icon={null}
                  p="resource-category"
                  onClick={() => delUser(categories[id][i].id)}
                  disabled={null}
                />
              </Space>
            </div>
          ),
          key: categories[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const resetData = () => {
    setTreeData([]);
    setRefresh(!refresh);
  };

  const delUser = (id: any) => {
    if (id === 0) {
      return;
    }

    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除此分类？",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        resourceCategory.destroyResourceCategory(id).then((res: any) => {
          message.success("操作成功");
          resetData();
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onDragEnter: TreeProps["onDragEnter"] = (info) => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // setExpandedKeys(info.expandedKeys)
  };

  const onDrop: TreeProps["onDrop"] = (info) => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // setExpandedKeys(info.expandedKeys)
  };

  return (
    <>
      <div className="playedu-main-top mb-24">
        <div className="d-flex">
          <Link
            style={{ textDecoration: "none" }}
            to={`/resource-category/create`}
          >
            <PerButton
              type="primary"
              text="新建分类"
              class="mr-16"
              icon={<PlusOutlined />}
              p="resource-category"
              onClick={() => null}
              disabled={null}
            />
          </Link>
        </div>
      </div>
      <div className="playedu-main-body">
        <Tree
          onSelect={onSelect}
          treeData={treeData}
          draggable
          blockNode
          onDragEnter={onDragEnter}
          onDrop={onDrop}
        />
      </div>
    </>
  );
};
