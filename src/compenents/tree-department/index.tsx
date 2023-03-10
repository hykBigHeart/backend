import { Button, Input, message, Tree } from "antd";
import { useState, useEffect } from "react";
import { department } from "../../api/index";
import type { TreeProps } from "antd/es/tree";

interface Option {
  key: string | number;
  title: string;
  children?: Option[];
}

interface PropInterface {
  onUpdate: (keys: any) => void;
}

export const TreeDepartment = (props: PropInterface) => {
  const [treeData, setTreeData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    department.departmentList().then((res: any) => {
      const departments = res.data.departments;
      const new_arr: Option[] = [
        {
          key: "",
          title: "全部",
          children: checkArr(departments, 0),
        },
      ];
      setTreeData(new_arr);
      setLoading(false);
    });
  }, []);

  const checkArr = (departments: any[], id: number) => {
    const arr = [];
    for (let i = 0; i < departments[id].length; i++) {
      if (!departments[departments[id][i].id]) {
        arr.push({
          title: departments[id][i].name,
          key: departments[id][i].id,
        });
      } else {
        const new_arr: Option[] = checkArr(departments, departments[id][i].id);
        arr.push({
          title: departments[id][i].name,
          key: departments[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const onSelect = (selectedKeys: any, info: any) => {
    props.onUpdate(selectedKeys);
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
    <Tree
      onSelect={onSelect}
      treeData={treeData}
      draggable
      onDragEnter={onDragEnter}
      onDrop={onDrop}
    />
  );
};
