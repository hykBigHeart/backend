// 组内人员穿梭版（暂且不用）
import React, { useState, useEffect } from "react";
import { Modal, Form, message, theme, Transfer, Tree } from "antd";
import type { GetProp, TransferProps, TreeDataNode } from 'antd';
import { useSelector } from "react-redux";
import { group, user } from "../../../api/index";
import './userTransfer.less'

type TransferItem = GetProp<TransferProps, 'dataSource'>[number];

interface PropInterface {
  open: boolean;
  groupId: React.Key,
  groupName: string,
  onCancel: () => void;
}

interface Option {
  key: string | number;
  title: any;
  children?: Option[];
}

export const UserTransfer: React.FC<PropInterface> = ({
  open,
  groupId,
  groupName,
  onCancel,
}) => {
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(false);

  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [handledSourceData, setHandledSourceData] = useState<TreeDataNode[]>([])
  const [searchedData, setSearchedData] = useState<TreeDataNode[]>([])
  const [dep_ids, setDepIds] = useState<number[]>([-1]);

  // 本地缓存
  const localDepartments = useSelector(
    (state: any) => state.systemConfig.value.departments
  );

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

  let needHandleData = {
    "0": [
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
    "1": [
        {
            "id": 10,
            "name": "海金格",
            "sort": 0,
            "parent_id": 1,
            "parent_chain": "1",
            "created_at": "2024-03-28T02:37:37.000+00:00",
            "updated_at": "2024-03-28T02:37:37.000+00:00"
        },
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
    "4": [
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
    "5": [
        {
            "id": 8,
            "name": "房贷首付",
            "sort": 0,
            "parent_id": 5,
            "parent_chain": "4,5",
            "created_at": "2024-03-25T05:43:51.000+00:00",
            "updated_at": "2024-03-25T05:43:51.000+00:00"
        }
    ],
    "10": [
        {
            "id": 11,
            "name": "五十一号研究所",
            "sort": 0,
            "parent_id": 10,
            "parent_chain": "1,10",
            "created_at": "2024-03-28T02:38:19.000+00:00",
            "updated_at": "2024-03-28T02:38:19.000+00:00"
        }
    ]
}
  // 点当前组回显的用户
  const [clickGroupUsers, setClickGroupUsers] = useState<TreeDataNode[]>([]);
  // 已经勾选右移的用户
  const [selectedUsers, setSelectedUsers] = useState<TreeDataNode[]>([]);

  useEffect(() => {
    let data = checkArr(localDepartments, 0)
    setHandledSourceData(data)
    setSearchedData(data)
    getData()
  }, [open, dep_ids]);


  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    group.addPeople(groupId, groupName, targetKeys).then((res: any) => {
        setLoading(false);
        resetData()
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
    // let data  = searchTree(handledSourceData, value)
    let data  = filterTreeData(handledSourceData, value)
    
    console.log('data---1', data);
    setSearchedData(data)
  };


  // 感觉会有问题
  function searchTree(treeData: TreeDataNode[], searchValue: string): TreeDataNode[] {
    console.log('treeData', treeData);
    
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

  // 也有点问题
  function filterTreeData(treeData: TreeDataNode[], keyword: string): TreeDataNode[] {
    if (!keyword.trim()) {
      return treeData;
    }
    // 定义一个用于存储符合条件节点的结果数组
    const filteredData = [];

    // 定义一个递归函数，用于遍历树结构并过滤符合条件的节点
    function traverse(node) {
        // 如果节点标题包含关键词，则将该节点添加到结果数组中
        console.log('filteredData', filteredData);
        
        if (node.title.includes(keyword)) {
          if (!filteredData.length || filteredData.findIndex(item=> item.title == node.title) === -1) {
            filteredData.push(node);
          }
        }

        // 如果节点有子节点，则递归遍历子节点
        if (node.children) {
            node.children.forEach(childNode => {
                traverse(childNode);
            });
        }
    }

    // 遍历树形结构的每个根节点，开始过滤
    treeData.forEach(rootNode => {
        traverse(rootNode);
    });

    // 返回过滤后的结果数组
    return filteredData;
}

  // 处理数据关系结构
  const checkArr = (departments: DepartmentsBoxModel, id: number) => {
    const arr = [];
    for (let i = 0; i < departments[id].length; i++) {
      if (!departments[departments[id][i].id]) {
        arr.push({
          // title: (
          //   <>
          //     <div className="tree-title-elli" title={departments[id][i].name}>{departments[id][i].name}</div>
          //   </>
          // ),
          title: departments[id][i].name,
          key: departments[id][i].id,
          oaId: departments[id][i].oaId
        });
      } else {
        const new_arr: Option[] = checkArr(departments, departments[id][i].id);
        arr.push({
          // title: (
          //   <>
          //     <div className="tree-title-elli" title={departments[id][i].name}>{departments[id][i].name}</div>
          //   </>
          // ),
          title: departments[id][i].name,
          key: departments[id][i].id,
          oaId: departments[id][i].oaId,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const getData = ()=> {
    user.userList(1, 1000, { name: '', email: '', dep_ids: dep_ids.join(",")}).then((res: any) => {
      console.log('res',res);
      let data = res.data.data.map((item: any)=> {return {key: item.id, title: item.name}})
      console.log('data',data);
      
      setClickGroupUsers(data)
    })
  }

  const resetData = ()=> {
    setTargetKeys([])
    setSelectedUsers([])
    setDepIds([-1])
  }
  return (
    <>
      {open ? (
        <Modal title="选择用户" centered forceRender open={true} width={800} onCancel={() => { onCancel(); resetData() }} onOk={onFinish} maskClosable={false} okButtonProps={{ loading: loading }}>
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
                          onSelect={(_: any, e) => {
                            // setClickGroupUsers(e.node.personnel ? e.node.personnel : [])
                            // console.log('selectedUsers', selectedUsers);
                            if (!_.length) setDepIds([-1])
                            else setDepIds(_)
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
                            onCheck={(_, { node: { key } }) => {
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
                      className="right-transfer-box"
                      onSelect={(_, { node: { key } }) => {
                        onItemSelect(key as string, !isChecked(selectedKeys, key));
                      }}
                      onCheck={(_, { node: { key } }) => {
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
