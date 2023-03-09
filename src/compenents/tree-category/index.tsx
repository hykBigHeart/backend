import { Button, Input, message, Tree } from "antd";
import { useState, useEffect } from "react";
import { resourceCategory } from "../../api/index";
interface Option {
  key: string | number;
  title: string;
  children?: Option[];
}

interface PropInterface {
  onUpdate: (keys: any) => void;
}

export const TreeCategory = (props: PropInterface) => {
  const [treeData, setTreeData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    resourceCategory.resourceCategoryList().then((res: any) => {
      const categories = res.data.categories;
      if (JSON.stringify(categories) !== "{}") {
        const new_arr: Option[] = [
          {
            key: "",
            title: "全部",
            children: checkArr(categories, 0),
          },
        ];
        setTreeData(new_arr);
      } else {
        const new_arr: Option[] = [
          {
            key: "",
            title: "全部",
            children: [],
          },
        ];
        setTreeData(new_arr);
      }
      setLoading(false);
    });
  }, []);

  const checkArr = (categories: any[], id: number) => {
    const arr = [];
    for (let i = 0; i < categories[id].length; i++) {
      if (!categories[categories[id][i].id]) {
        arr.push({
          title: categories[id][i].name,
          key: categories[id][i].id,
        });
      } else {
        const new_arr: Option[] = checkArr(categories, categories[id][i].id);
        arr.push({
          title: categories[id][i].name,
          key: categories[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const onSelect = (selectedKeys: any, info: any) => {
    props.onUpdate(selectedKeys);
  };

  return <Tree onSelect={onSelect} treeData={treeData} />;
};
