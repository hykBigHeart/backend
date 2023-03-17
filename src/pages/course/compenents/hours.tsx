import { message, Tree, Tooltip } from "antd";
import { useState, useEffect } from "react";

interface Option {
  id: number;
  name: string;
}

interface PropInterface {
  data: Option[];
  onRemoveItem: (id: number) => void;
}

export const TreeHours = (props: PropInterface) => {
  const [treeData, setTreeData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const hours = props.data;

    if (hours.length === 0) {
      return;
    }
    checkTree(hours);
  }, [props.data]);

  const checkTree = (hours: any) => {
    const arr = [];
    for (let i = 0; i < hours.length; i++) {
      arr.push({
        title: (
          <div className="d-flex">
            <div className="d-flex">
              <i
                className="iconfont icon-icon-video"
                style={{
                  fontSize: 16,
                  color: "rgba(0,0,0,0.3)",
                }}
              />
              <div className="tree-video-title mr-24">{hours[i].name}</div>
            </div>
            <Tooltip placement="top" title="可拖拽排序">
              <i
                className="iconfont icon-icon-drag mr-16"
                style={{ fontSize: 24 }}
              />
            </Tooltip>
            <i
              className="iconfont icon-icon-delete"
              style={{ fontSize: 24 }}
              onClick={() => removeItem(hours[i].id)}
            />
          </div>
        ),
        key: hours[i].id,
      });
    }
    setTreeData(arr);
  };

  const removeItem = (id: number) => {
    if (id === 0) {
      return;
    }
    props.onRemoveItem(id);
  };

  return (
    <div>
      <Tree selectable={false} treeData={treeData} />
    </div>
  );
};
