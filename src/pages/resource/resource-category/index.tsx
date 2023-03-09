import React, { useState, useEffect } from "react";
import { Button, Space, Table, Popconfirm, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "./index.module.less";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { resourceCategory } from "../../../api/index";
import { dateFormat } from "../../../utils/index";
import { Link, useNavigate } from "react-router-dom";
import { PerButton } from "../../../compenents";

interface Option {
  id: string | number;
  name: string;
  created_at: string;
  children?: Option[];
  sort: number;
}

interface DataType {
  id: React.Key;
  name: string;
  created_at: string;
  sort: number;
}

export const ResourceCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [list, setList] = useState<any>([]);
  const [refresh, setRefresh] = useState(false);
  const [tableKey, setTableKey] = useState<number>(0);

  const columns: ColumnsType<DataType> = [
    {
      title: "分类名",
      dataIndex: "name",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "ID",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Sort",
      key: "sort",
      dataIndex: "sort",
    },
    {
      title: "时间",
      dataIndex: "created_at",
      render: (text: string) => <span>{text && dateFormat(text)}</span>,
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <PerButton
            type="link"
            text="详情"
            class="c-red"
            icon={null}
            p="department-update"
            onClick={() => navigate(`/resource-category/update/${record.id}`)}
          />
          <Popconfirm
            title="警告"
            description="即将删除此分类，确认操作？"
            onConfirm={() => delUser(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <PerButton
              type="link"
              text="删除"
              class="c-red"
              icon={null}
              p="department-destroy"
              onClick={() => null}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, [refresh]);

  const getData = () => {
    setLoading(true);
    resourceCategory.resourceCategoryList().then((res: any) => {
      const categories = res.data.categories;
      let num = tableKey;
      if (JSON.stringify(categories) !== "{}") {
        const new_arr: Option[] = checkArr(categories, 0);
        setList(new_arr);
      }

      setLoading(false);
      setTableKey(num + 1);
    });
  };

  const checkArr = (categories: any[], id: number) => {
    const arr = [];
    for (let i = 0; i < categories[id].length; i++) {
      if (!categories[categories[id][i].id]) {
        arr.push({
          name: categories[id][i].name,
          id: categories[id][i].id,
          sort: categories[id][i].sort,
          created_at: categories[id][i].created_at,
        });
      } else {
        const new_arr: Option[] = checkArr(categories, categories[id][i].id);
        arr.push({
          name: categories[id][i].name,
          id: categories[id][i].id,
          created_at: categories[id][i].created_at,
          sort: categories[id][i].sort,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const resetData = () => {
    setList([]);
    setRefresh(!refresh);
  };

  const delUser = (id: any) => {
    resourceCategory.destroyResourceCategory(id).then((res: any) => {
      message.success("操作成功");
      setRefresh(!refresh);
    });
  };

  return (
    <>
      <div className="playedu-main-body">
        <div className="float-left j-b-flex mb-24">
          <div className="d-flex">
            <Link
              style={{ textDecoration: "none" }}
              to={`/resource-category/create`}
            >
              <PerButton
                type="primary"
                text="新建"
                class="mr-16"
                icon={<PlusOutlined />}
                p="department-store"
                onClick={() => null}
              />
            </Link>
          </div>
          <div className="d-flex">
            <Button
              type="link"
              icon={<ReloadOutlined />}
              style={{ color: "#333333" }}
              onClick={() => {
                setRefresh(!refresh);
              }}
            ></Button>
          </div>
        </div>
        <div className="float-left">
          <Table
            pagination={false}
            key={tableKey}
            columns={columns}
            dataSource={list}
            loading={loading}
            rowKey={(record) => record.id}
            defaultExpandAllRows={true}
          />
        </div>
      </div>
    </>
  );
};
