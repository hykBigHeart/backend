import React, { useState, useEffect } from "react";
import { Button, Tree, Modal, message } from "antd";
import styles from "./index.module.less";
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { resourceCategory } from "../../../api/index";
import { PerButton } from "../../../compenents";
import type { DataNode, TreeProps } from "antd/es/tree";
import { ResourceCategoryCreate } from "./compenents/create";
import { ResourceCategoryUpdate } from "./compenents/update";
import { useSelector } from "../../../store/hooks";

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
  const permisssions = useSelector((state: any) => state.permisssions);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState(false);
  const [treeData, setTreeData] = useState<any>([]);
  const [selectKey, setSelectKey] = useState<any>([]);
  const [createVisible, setCreateVisible] = useState<boolean>(false);
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [cid, setCid] = useState<number>(0);

  useEffect(() => {
    getData();
  }, [refresh]);

  const onSelect = (selectedKeys: any, info: any) => {
    setSelectKey(selectedKeys);
  };

  const through = (p: string) => {
    if (!permisssions) {
      return false;
    }
    return typeof permisssions[p] !== "undefined";
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
              <i
                className="iconfont icon-icon-drag mr-16"
                style={{ fontSize: 24 }}
              />
              {through("resource-category") && (
                <>
                  <i
                    className="iconfont icon-icon-edit mr-16"
                    style={{ fontSize: 24 }}
                    onClick={() => {
                      setCid(categories[id][i].id);
                      setUpdateVisible(true);
                    }}
                  />
                  <i
                    className="iconfont icon-icon-delete"
                    style={{ fontSize: 24 }}
                    onClick={() => delUser(categories[id][i].id)}
                  />
                </>
              )}
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
              <i
                className="iconfont icon-icon-drag mr-16"
                style={{ fontSize: 24 }}
              />
              {through("resource-category") && (
                <>
                  <i
                    className="iconfont icon-icon-edit mr-16"
                    style={{ fontSize: 24 }}
                    onClick={() => {
                      setCid(categories[id][i].id);
                      setUpdateVisible(true);
                    }}
                  />
                  <i
                    className="iconfont icon-icon-delete"
                    style={{ fontSize: 24 }}
                    onClick={() => delUser(categories[id][i].id)}
                  />
                </>
              )}
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
      centered: true,
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
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: DataNode[],
      key: React.Key,
      callback: (node: DataNode, i: number, data: DataNode[]) => void
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj: DataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: DataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    setTreeData(data);
  };

  return (
    <>
      <div className="playedu-main-top mb-24">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="新建分类"
            class="mr-16"
            icon={<PlusOutlined />}
            p="resource-category"
            onClick={() => setCreateVisible(true)}
            disabled={null}
          />
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
        <ResourceCategoryCreate
          open={createVisible}
          onCancel={() => {
            setCreateVisible(false);
            setRefresh(!refresh);
          }}
        />
        <ResourceCategoryUpdate
          id={cid}
          open={updateVisible}
          onCancel={() => {
            setUpdateVisible(false);
            setRefresh(!refresh);
          }}
        />
      </div>
    </>
  );
};
