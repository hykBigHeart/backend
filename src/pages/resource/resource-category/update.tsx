import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, Cascader, Button, message } from "antd";
import styles from "./create.module.less";
import { resourceCategory } from "../../../api/index";
import { useParams, useNavigate } from "react-router-dom";
import { BackBartment } from "../../../compenents";

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

export const ResourceCategoryUpdatePage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<any>([]);
  const [parent_id, setParentId] = useState<number>(0);

  useEffect(() => {
    getParams();
  }, []);

  useEffect(() => {
    getDetail();
  }, [params.catId]);

  const getParams = () => {
    resourceCategory.createResourceCategory().then((res: any) => {
      const categories = res.data.categories;
      if (JSON.stringify(categories) !== "{}") {
        const new_arr: Option[] = checkArr(categories, 0);
        setCategories(new_arr);
      }
    });
  };

  const getDetail = () => {
    resourceCategory.resourceCategory(Number(params.catId)).then((res: any) => {
      let data = res.data;
      let arr = data.parent_chain.split(",");
      let new_arr: any[] = [];
      arr.map((num: any) => {
        new_arr.push(Number(num));
      });
      form.setFieldsValue({
        name: data.name,
        sort: data.sort,
        parent_id: new_arr,
      });
      setParentId(data.parent_id);
    });
  };
  

  const checkArr = (categories: any[], id: number) => {
    const arr = [];
    for (let i = 0; i < categories[id].length; i++) {
      if (categories[id][i].id === Number(params.catId)) {
        console.log("截断");
      } else if (!categories[categories[id][i].id]) {
        arr.push({
          label: categories[id][i].name,
          value: categories[id][i].id,
        });
      } else {
        const new_arr: Option[] = checkArr(categories, categories[id][i].id);
        arr.push({
          label: categories[id][i].name,
          value: categories[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const onFinish = (values: any) => {
    let id = Number(params.catId);
    resourceCategory
      .updateResourceCategory(id, values.name, parent_id || 0, values.sort)
      .then((res: any) => {
        message.success("保存成功！");
        navigate(-1);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleChange = (value: any) => {
    let id = Number(params.catId);
    if (value !== undefined) {
      let it = value[value.length - 1];
      if (it === id) {
        setParentId(0);
      } else {
        setParentId(it);
      }
    } else {
      setParentId(0);
    }
  };

  const displayRender = (label: any, selectedOptions: any) => {
    let id = Number(params.catId);
    if (selectedOptions && selectedOptions[0]) {
      let current = selectedOptions[selectedOptions.length - 1].value;
      if (current === id) {
        message.error("不能选择自己作为父类");
        return 0;
      }
    }

    return label[label.length - 1];
  };

  return (
    <>
      <Row className="playedu-main-body">
        <Col>
          <div className="float-left mb-24">
            <BackBartment title="编辑资源分类" />
          </div>
          <div className="float-left">
            <Form
              form={form}
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ width: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item label="父级" name="parent_id">
                <Cascader
                  style={{ width: 300 }}
                  allowClear
                  placeholder="请选择分类"
                  onChange={handleChange}
                  options={categories}
                  changeOnSelect
                  expand-trigger="hover"
                  displayRender={displayRender}
                />
              </Form.Item>
              <Form.Item
                label="分类名"
                name="name"
                rules={[{ required: true, message: "请输入分类名!" }]}
              >
                <Input style={{ width: 300 }} placeholder="请输入分类名" />
              </Form.Item>
              <Form.Item
                label="Sort"
                name="sort"
                rules={[{ required: true, message: "请输入Sort!" }]}
              >
                <Input
                  type="number"
                  style={{ width: 300 }}
                  placeholder="请输入Sort"
                />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
                <Button
                  className="ml-15"
                  htmlType="button"
                  onClick={() => navigate(-1)}
                >
                  取消
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
};
