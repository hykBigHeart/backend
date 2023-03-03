import { Button, Input, message, Tree } from "antd";
import { useState, useEffect } from "react";
import { department } from "../../api/index";

interface PropInterface {
  defaultExpandedKeys: any;
  defaultSelectedKeys: any;
  defaultCheckedKeys: any;
  onUpdate: () => void;
}

export const TreeDepartment = (props: PropInterface) => {
  const [treeData, setTreeData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    department.departmentList().then((res: any) => {
      setTreeData(res.data);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
  }, []);
  const onSelect = () => {};
  const onCheck = () => {};
  return (
    <Tree
      checkable
      defaultExpandedKeys={props.defaultExpandedKeys}
      defaultSelectedKeys={props.defaultSelectedKeys}
      defaultCheckedKeys={props.defaultCheckedKeys}
      onSelect={onSelect}
      onCheck={onCheck}
      treeData={treeData}
    />
  );
};
