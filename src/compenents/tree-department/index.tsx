import { Tree } from "antd";
import { useState, useEffect } from "react";
import { department } from "../../api/index";
import { useSelector } from "react-redux";
import styles from "./index.module.less"

interface Option {
  key: string | number;
  title: string;
  children?: Option[];
}

interface PropInterface {
  text: string;
  showNum: boolean;
  selected: any;
  depUserCount?: KeyNumberObject;
  userCount?: number;
  onUpdate: (keys: any, title: any) => void;
}

export const TreeDepartment = (props: PropInterface) => {
  const [treeData, setTreeData] = useState<any>([]);
  const [selectKey, setSelectKey] = useState<number[]>([]);
  // 本地缓存
  const localDepartments = useSelector(
    (state: any) => state.systemConfig.value.departments
  );

  useEffect(() => {
    if (props.selected && props.selected.length > 0) {
      setSelectKey(props.selected);
    }
  }, [props.selected]);

  useEffect(() => {
    if (JSON.stringify(localDepartments) !== "{}") {
      let data: any[] = [];
      if (props.depUserCount) {
        data = checkNewArr(localDepartments, 0, props.depUserCount);
      } else {
        data = checkArr(localDepartments, 0);
      }
      setTreeData(data);
    } else {
      const data: Option[] = [
        {
          key: "",
          title: "全部",
          children: [],
        },
      ];
      setTreeData(data);
    }
  }, [localDepartments, props.depUserCount]);

  const checkNewArr = (
    departments: DepartmentsBoxModel,
    id: number,
    counts: any
  ) => {
    const arr = [];
    for (let i = 0; i < departments[id].length; i++) {
      if (!departments[departments[id][i].id]) {
        arr.push({
          title: getNewTitle(
            departments[id][i].name,
            departments[id][i].id,
            counts
          ),
          key: departments[id][i].id,
        });
      } else {
        const new_arr: any = checkNewArr(
          departments,
          departments[id][i].id,
          counts
        );
        arr.push({
          title: getNewTitle(
            departments[id][i].name,
            departments[id][i].id,
            counts
          ),
          key: departments[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const checkArr = (departments: DepartmentsBoxModel, id: number) => {
    const arr = [];
    for (let i = 0; i < departments[id].length; i++) {
      if (!departments[departments[id][i].id]) {
        arr.push({
          title: (
            <span className="tree-title-elli">{departments[id][i].name}</span>
          ),
          key: departments[id][i].id,
        });
      } else {
        const new_arr: any[] = checkArr(departments, departments[id][i].id);
        arr.push({
          title: (
            <span className="tree-title-elli">{departments[id][i].name}</span>
          ),
          key: departments[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const getNewTitle = (title: any, id: number, counts: any) => {
    if (counts) {
      let value = counts[id] || 0;
      return (
        <span className="tree-title-elli" title={title + "(" + value + ")"}>{title + "(" + value + ")"}</span>
      );
    } else {
      return <span className="tree-title-elli" title={title}>{title}</span>;
    }
  };

  const onSelect = (selectedKeys: any, info: any) => {
    let label = "全部" + props.text;
    if (info) {
      label = info.node.title.props.children;
    }
    if (selectedKeys.length <= 1) {
      props.onUpdate(selectedKeys, label);
      setSelectKey(selectedKeys);
    }
  };

  const onExpand = (selectedKeys: any, info: any) => {
    let label = "全部" + props.text;
    if (info) {
      label = info.node.title.props.children;
    }
    if (selectedKeys.length <= 1) {
      props.onUpdate(selectedKeys, label);
      setSelectKey(selectedKeys);
    }
  };

  return (
    <div className={styles['tree-department']}>
      <div
        className={
          selectKey.length === 0
            ? "mb-8 category-label active"
            : "mb-8 category-label"
        }
        onClick={() => onSelect([], "")}
      >
        全部{props.text}
        {props.showNum && props.userCount ? "(" + props.userCount + ")" : ""}
      </div>
      {treeData.length > 0 && (
        <Tree
          selectedKeys={selectKey}
          onSelect={onSelect}
          onExpand={onExpand}
          treeData={treeData}
          // defaultExpandAll={true}
          switcherIcon={<i className="iconfont icon-icon-fold c-gray" />}
        />
      )}
    </div>
  );
};
