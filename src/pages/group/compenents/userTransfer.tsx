import React, { useState, useEffect } from "react";
import { Modal, Form, message, theme, Transfer, Tree } from "antd";
import type { GetProp, TransferProps, TreeDataNode } from 'antd';
import { group } from "../../../api/index";
import './userTransfer.less'

type TransferItem = GetProp<TransferProps, 'dataSource'>[number];

interface PropInterface {
  open: boolean;
  onCancel: () => void;
}

interface Option {
  key: string | number;
  title: any;
  children?: Option[];
}

export const UserTransfer: React.FC<PropInterface> = ({
  open,
  onCancel,
}) => {
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(false);

  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [handledSourceData, setHandledSourceData] = useState<TreeDataNode[]>([])
  const [searchedData, setSearchedData] = useState<TreeDataNode[]>([])

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

  let sourceData = {
    0: [
      {
        "id": 9,
        "name": "山豆根",
        "sort": 0,
        "parent_id": 0,
        "parent_chain": "",
        "created_at": "2024-03-25T06:05:01.000+00:00",
        "updated_at": "2024-03-25T06:05:01.000+00:00"
      },
      {
        "id": 1,
        "name": "海金格",
        "sort": 2,
        "parent_id": 0,
        "parent_chain": "",
        "created_at": "2024-02-21T07:23:52.000+00:00",
        "updated_at": "2024-02-21T07:23:52.000+00:00"
      },
      {
        "id": 4,
        "name": "外包",
        "sort": 3,
        "parent_id": 0,
        "parent_chain": "",
        "created_at": "2024-03-13T02:16:32.000+00:00",
        "updated_at": "2024-03-13T02:16:32.000+00:00"
      }
    ],
    1: [
      {
        "id": 3,
        "name": "运营部",
        "sort": 1,
        "parent_id": 1,
        "parent_chain": "1",
        "created_at": "2024-02-22T06:57:56.000+00:00",
        "updated_at": "2024-02-22T06:57:56.000+00:00"
      },
      {
        "id": 2,
        "name": "研发部",
        "sort": 2,
        "parent_id": 1,
        "parent_chain": "1",
        "created_at": "2024-02-21T07:24:04.000+00:00",
        "updated_at": "2024-02-21T07:24:04.000+00:00"
      }
    ],
    4: [
      {
        "id": 5,
        "name": "第一中心",
        "sort": 0,
        "parent_id": 4,
        "parent_chain": "4",
        "created_at": "2024-03-13T02:17:03.000+00:00",
        "updated_at": "2024-03-13T02:17:03.000+00:00"
      }
    ],
    5: [
      {
        "id": 8,
        "name": "房贷首付",
        "sort": 0,
        "parent_id": 5,
        "parent_chain": "4,5",
        "created_at": "2024-03-25T05:43:51.000+00:00",
        "updated_at": "2024-03-25T05:43:51.000+00:00"
      }
    ]
  }

  // 点当前组回显的用户
  const [clickGroupUsers, setClickGroupUsers] = useState<TreeDataNode[]>([]);
  // 已经勾选右移的用户
  const [selectedUsers, setSelectedUsers] = useState<TreeDataNode[]>([]);

  useEffect(() => {
    let data = checkArr(sourceData, 0)
    setHandledSourceData(data)
    setSearchedData(data)
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
  flatten([...clickGroupUsers, ...selectedUsers]);

  const transChange = (keys: string[], direction:string) => {
    setTargetKeys(keys);
    const set: Set<string> = new Set([...clickGroupUsers, ...selectedUsers].map((item: TreeDataNode)=> JSON.stringify(item)));
    const uniqueArr: any[] = Array.from(set).map((item: string)=> JSON.parse(item));
    console.log('uniqueArr', uniqueArr);
    setSelectedUsers(uniqueArr.filter(item=> keys.some(i=> i == item.key)))
  };

  const handleSearch: TransferProps['onSearch'] = (dir, value) => {
    console.log('searchedData', searchedData);
    let data  = searchTree(handledSourceData, value)
    console.log('data', data);
    setSearchedData(data)
  };


  // 感觉会有问题
  function searchTree(treeData: TreeDataNode[], searchValue: string): TreeDataNode[] {
    if (!searchValue.trim()) {
      return treeData;
    }
    const result: TreeDataNode[] = [];
    for (const node of treeData) {
      // node.title
      if (node.title.props.children.props.children.includes(searchValue)) {
        result.push(node);
      }
      if (node.children) {
        const childResult = searchTree(node.children, searchValue);
        result.push(...childResult);
      }
    }
    return result;
  }

  // 处理数据关系结构
  const checkArr = (departments: DepartmentsBoxModel, id: number) => {
    const arr = [];
    for (let i = 0; i < departments[id].length; i++) {
      if (!departments[departments[id][i].id]) {
        arr.push({
          title: (
            <>
              <div className="tree-title-elli">{departments[id][i].name}</div>
            </>
          ),
          key: departments[id][i].id,
          oaId: departments[id][i].oaId
        });
      } else {
        const new_arr: Option[] = checkArr(departments, departments[id][i].id);
        arr.push({
          title: (
            <>
              <div className="tree-title-elli">{departments[id][i].name}</div>
            </>
          ),
          key: departments[id][i].id,
          oaId: departments[id][i].oaId,
          children: new_arr,
        });
      }
    }
    return arr;
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
                        <Tree
                          blockNode
                          // checkable
                          checkStrictly
                          // defaultExpandAll
                          checkedKeys={checkedKeys}
                          treeData={generateTree(searchedData, targetKeys)}
                          // onCheck={(_, { node: { key } }) => {
                          //   onItemSelect(key as string, !isChecked(checkedKeys, key));
                          // }}
                          onSelect={(_, e) => {
                            setClickGroupUsers(e.node.personnel ? e.node.personnel : [])
                            // console.log('selectedUsers', selectedUsers);
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
                  return (
                    <Tree
                      blockNode
                      checkable
                      checkStrictly
                      checkedKeys={selectedKeys}
                      treeData={generateTree(selectedUsers)}
                      onSelect={(_, { node: { key } }) => {
                        onItemSelect(key as string, !isChecked(selectedKeys, key));
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
