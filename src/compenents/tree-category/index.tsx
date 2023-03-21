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
              <>
                <span>未分类</span>
                <span className="tree-num">{props.categoryCount[0] || 0}</span>
              </>
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
          <>
            <span className="tree-title-elli">{categories[id][i].name}</span>
            <span className="tree-num">
              {props.categoryCount[categories[id][i].id] || 0}
            </span>
          </>
        );
        arr.push({
          title: name,
          key: categories[id][i].id,
        });
      } else {
        let name = (
          <>
            <span className="tree-title-elli">{categories[id][i].name}</span>
            <span className="tree-num">
              {props.categoryCount[categories[id][i].id] || 0}
            </span>
          </>
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
        <div className="j-b-flex">
          <span>全部{props.text}</span>
          <span className="tree-num-total">{props.resourceTotal}</span>
        </div>
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
