import { Tree } from "antd";
import { useState, useEffect } from "react";
import { resourceCategory } from "../../api/index";

interface Option {
  key: string | number;
  title: any;
  children?: Option[];
}

interface PropInterface {
  type: string;
  text: string;
  categoryCount: any;
  resourceTotal: number;

  onUpdate: (keys: any, title: any) => void;
}

export const TreeCategory = (props: PropInterface) => {
  const [treeData, setTreeData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectKey, setSelectKey] = useState<any>([]);

  useEffect(() => {
    resourceCategory.resourceCategoryList().then((res: any) => {
      const categories = res.data.categories;
      if (JSON.stringify(categories) !== "{}") {
        const new_arr: Option[] = checkArr(categories, 0);
        if (props.type === "no-cate") {
          new_arr.unshift({
            key: 0,
            title: (
              <div className="d-flex">
                未分类
                <span className="tree-num">
                  ({props.categoryCount[0] || 0})
                </span>
              </div>
            ),
          });
        }

        setTreeData(new_arr);
      }
    });
  }, [props.categoryCount]);

  const checkArr = (categories: any[], id: number) => {
    const arr = [];
    for (let i = 0; i < categories[id].length; i++) {
      if (!categories[categories[id][i].id]) {
        let name = (
          <div className="d-flex">
            {categories[id][i].name}
            <span className="tree-num">
              ({props.categoryCount[categories[id][i].id] || 0})
            </span>
          </div>
        );
        arr.push({
          title: name,
          key: categories[id][i].id,
        });
      } else {
        let name = (
          <div className="d-flex">
            {categories[id][i].name}
            <span className="tree-num">
              ({props.categoryCount[categories[id][i].id] || 0})
            </span>
          </div>
        );
        const new_arr: Option[] = checkArr(categories, categories[id][i].id);
        arr.push({
          title: name,
          key: categories[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const onSelect = (selectedKeys: any, info: any) => {
    let label = "全部" + props.text;
    if (info) {
      label = info.node.title;
    }
    props.onUpdate(selectedKeys, label);
    setSelectKey(selectedKeys);
  };

  const onExpand = (selectedKeys: any, info: any) => {
    let label = "全部" + props.text;
    if (info) {
      label = info.node.title;
    }
    props.onUpdate(selectedKeys, label);
    setSelectKey(selectedKeys);
  };

  return (
    <div>
      <div
        className={
          selectKey.length === 0
            ? "mb-8 category-label active"
            : "mb-8 category-label"
        }
        onClick={() => {
          onSelect([], "");
        }}
      >
        全部{props.text}
        <span className="tree-num">({props.resourceTotal})</span>
      </div>
      <Tree
        onSelect={onSelect}
        selectedKeys={selectKey}
        onExpand={onExpand}
        treeData={treeData}
      />
    </div>
  );
};
