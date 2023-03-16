import { message, Tree } from "antd";
import { useState, useEffect } from "react";

interface Option {
  id: string | number;
  name: string;
}

interface PropInterface {
  data: Option[];
  onUpdate: () => void;
}

export const TreeHours = (props: PropInterface) => {
  const [treeData, setTreeData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const hours = props.data;
    if (hours.length === 0) {
      return;
    }
    const arr = [];
    for (let i = 0; i < hours.length; i++) {
      arr.push({
        title: hours[i].name,
        key: hours[i].id,
      });
    }
    setTreeData(arr);
  }, [props.data]);

  return (
    <div>
      <Tree selectable={false} treeData={treeData} />
    </div>
  );
};
