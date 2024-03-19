import React, { useState, useEffect } from "react";
import { Modal, Form, Input, message, theme, Transfer, Tree } from "antd";
import type { GetProp, TransferProps, TreeDataNode } from 'antd';
import { group } from "../../../api/index";
import './userTransfer.less'

type TransferItem = GetProp<TransferProps, 'dataSource'>[number];

interface PropInterface {
  open: boolean;
  onCancel: () => void;
}

export const UserTransfer: React.FC<PropInterface> = ({
  open,
  onCancel,
}) => {
  const { token } = theme.useToken();
  const { Search } = Input;
  const [loading, setLoading] = useState(false);

  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  let treeData: TreeDataNode[] = [
    { key: '0-0', title: '0-0', personnel: [{key: '1', title: '张三'},
    {key: '2', title: '里斯'},
    {key: '3', title: '王五'},]},
    {
      key: '0-1',
      title: '0-1',
      children: [
        { key: '0-1-0', title: '孩子0-1-0',
          children: [
            {key: '0-1-0-0', title: '最里层'}, 
            {key: '0-1-0-1', title: '还有一个', personnel: [{key: '5', title: '个人规划'},
            {key: '6', title: '梵蒂冈'},
            {key: '7', title: '士大夫'},]},
          ]
        },
        { key: '0-1-1', title: '孩子0-1-1' },
      ],
    },
    { key: '0-2', title: '0-2' },
    { key: '0-3', title: '0-3', 
      children: [
        {key: '0-3-0', title: '第三个的第一个'},
        {key: '0-3-1', title: '第三个的第2个'}
      ]
    },
    { key: '0-4', title: '0-4',
      children: [
        {key: '0-4-0', title: '翻跟斗'},
        {key: '0-4-1', title: '共和'}
      ]
    },
  ];
  let searchData: TreeDataNode[] = treeData
  // 点当前组回显的用户
  const [clickGroupUsers, setClickGroupUsers] = useState<TreeDataNode[]>([]);
  // 已经勾选右移的用户
  const [selectedUsers, setSelectedUsers] = useState<TreeDataNode[]>([]);
  // 
  const [rightKeys, setRightKeys] = useState<string[]>([]);



  useEffect(() => {

  }, [open]);


  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    group.storeGroup(values.groupName, values.description).then((res: any) => {
        setLoading(false);
        message.success("保存成功！");
        onCancel();
      }).catch((e) => {
        setLoading(false);
      });
  };


  // Customize Table Transfer
const isChecked = (selectedKeys: React.Key[], eventKey: React.Key) => selectedKeys.includes(eventKey);

const generateTree = (treeNodes: TreeDataNode[] = [], checkedKeys: string[] = []): TreeDataNode[] =>
  treeNodes.map(({ children, ...props }) => ({
    ...props,
    disabled: checkedKeys.includes(props.key as string),
    children: generateTree(children, checkedKeys),
  }));

  const transferDataSource: TransferItem[] = [];
  // let serachData: TransferItem[] = [];
  function flatten(list: TreeDataNode[] = []) {
    list.forEach((item) => {
      transferDataSource.push(item as TransferItem);
      // serachData.push(item as TransferItem);
      flatten(item.children);
    });
  }
  flatten([...treeData, ...clickGroupUsers, ...selectedUsers]);

  const transChange = (keys: string[], direction:string) => {
    console.log('transChange', keys, 'direction', direction);
    console.log('clickGroupUsers', clickGroupUsers);
    console.log('selectedUsers', selectedUsers);
    setTargetKeys(keys);
    // 这里有问题，有重复项
    setSelectedUsers([...clickGroupUsers, ...selectedUsers].filter(item=> keys.some(i=> i == item.key)))
    if (direction == 'right') {
    } else {

    }
    console.log('之后--selectedUsers', selectedUsers);
    
  };

  const handleSearch: TransferProps['onSearch'] = (dir, value) => {
    console.log('search:', dir, value);
    searchData = searchTree(treeData, value)
    console.log('searchData', searchData);
  };

  interface TreeDataNode {
    key: string;
    title: string;
    children?: TreeDataNode[];
  }

  // 感觉会有问题
  function searchTree(treeData: TreeDataNode[], searchValue: string): TreeDataNode[] {
    if (!searchValue.trim()) {
      return treeData;
    }
    const result: TreeDataNode[] = [];
    for (const node of treeData) {
      if (node.title.includes(searchValue)) {
        result.push(node);
      }
      if (node.children) {
        const childResult = searchTree(node.children, searchValue);
        result.push(...childResult);
      }
    }
    return result;
  }

  // 现在无用 后续还无用删
  const searchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    console.log('value', value);
    console.log('transferDataSource', transferDataSource);
    treeData = transferDataSource.filter(item=> item.title.includes(value) as TransferItem)
    console.log('treeData', treeData);
  };

  return (
    <>
      {open ? (
        <Modal title="选择用户" centered forceRender open={true} width={800} onCancel={() => onCancel()} maskClosable={false} okButtonProps={{ loading: loading }}>
          <div className="float-left mt-24">
            <Transfer
              targetKeys={targetKeys}
              dataSource={transferDataSource}
              className="tree-transfer"
              render={(item) => item.title!}
              showSelectAll={false}
              onChange={transChange}

              listStyle={{
                height: 500,
                // overflowY: 'scroll'
              }}
              showSearch
              onSearch={handleSearch}
            >
              {({ direction, onItemSelect, selectedKeys }) => {
                if (direction === 'left') {
                  const checkedKeys = [...selectedKeys, ...targetKeys];
                  return (
                    <>
                      <div className="left-transfer-top-box" style={{ padding: token.paddingXS }}>
                        {/* <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={searchChange} /> */}
                        <Tree
                          blockNode
                          // checkable
                          checkStrictly
                          // defaultExpandAll
                          checkedKeys={checkedKeys}
                          treeData={generateTree(searchData, targetKeys)}
                          // onCheck={(_, { node: { key } }) => {
                          //   onItemSelect(key as string, !isChecked(checkedKeys, key));
                          // }}
                          onSelect={(_, e) => {
                            // console.log(_);
                            // console.log(e);
                            setClickGroupUsers(e.node.personnel ? e.node.personnel : [])
                            console.log('selectedUsers', selectedUsers);
                            
                          }}
                        />
                      </div>
                      <div className="left-transfer-bottom-box">
                        <Tree
                            blockNode
                            checkable
                            checkStrictly
                            checkedKeys={checkedKeys}
                            treeData={generateTree(clickGroupUsers, targetKeys)}
                            onSelect={(_, { node: { key } }) => {
                              onItemSelect(key as string, !isChecked(checkedKeys, key));
                            }}
                          />
                      </div>
                    </>
                  );
                } 
                else {
                  const checkedKeys = [...selectedKeys,...rightKeys];
                  return (
                    <Tree
                            blockNode
                            checkable
                            checkStrictly
                            checkedKeys={checkedKeys}
                            treeData={generateTree(selectedUsers, rightKeys)}
                            onSelect={(_, { node: { key } }) => {
                              onItemSelect(key as string, !isChecked(checkedKeys, key));
                            }}
                          />
                  )
                }
              }}
            </Transfer>
          </div>
        </Modal>
      ) : null}
    </>
  );
};
