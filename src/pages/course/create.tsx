import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, Cascader, Switch, Button, message } from "antd";
import styles from "./create.module.less";
import { course, department } from "../../api/index";
import { useNavigate } from "react-router-dom";
import { UploadImageButton, BackBartment } from "../../compenents";
const { SHOW_CHILD } = Cascader;

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

export const CourseCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [departments, setDepartments] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [thumb, setThumb] = useState<string>("");

  useEffect(() => {
    getParams();
    getCategory();
  }, []);

  const getParams = () => {
    department.departmentList().then((res: any) => {
      const departments = res.data.departments;
      if (JSON.stringify(departments) !== "{}") {
        const new_arr: Option[] = checkArr(departments, 0);
        setDepartments(new_arr);
      }
    });
  };

  const getCategory = () => {
    course.createCourse().then((res: any) => {
      const categories = res.data.categories;
      if (JSON.stringify(categories) !== "{}") {
        const new_arr: Option[] = checkArr(categories, 0);
        setCategories(new_arr);
      }
      form.setFieldsValue({ isShow: 1 });
    });
  };

  const checkArr = (departments: any[], id: number) => {
    const arr = [];
    for (let i = 0; i < departments[id].length; i++) {
      if (!departments[departments[id][i].id]) {
        arr.push({
          label: departments[id][i].name,
          value: departments[id][i].id,
        });
      } else {
        const new_arr: Option[] = checkArr(departments, departments[id][i].id);
        arr.push({
          label: departments[id][i].name,
          value: departments[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const onFinish = (values: any) => {
    console.log("Success:", values);
    let dep_ids: any[] = [];
    for (let i = 0; i < values.dep_ids.length; i++) {
      dep_ids.push(values.dep_ids[i][values.dep_ids[i].length - 1]);
    }
    let category_ids: any[] = [];
    for (let j = 0; j < values.category_ids.length; j++) {
      category_ids.push(
        values.category_ids[j][values.category_ids[j].length - 1]
      );
    }
    course
      .storeCourse(
        values.title,
        values.thumb,
        values.isShow,
        dep_ids,
        category_ids
      )
      .then((res: any) => {
        message.success("保存成功！");
        navigate(-1);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const onChange = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ isShow: 1 });
    } else {
      form.setFieldsValue({ isShow: 0 });
    }
  };

  return (
    <>
      <Row className="playedu-main-body">
        <Col>
          <div className="float-left mb-24">
            <BackBartment title="新建课程" />
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
              <Form.Item
                label="课程标题"
                name="title"
                rules={[{ required: true, message: "请输入课程标题!" }]}
              >
                <Input placeholder="请输入课程标题" />
              </Form.Item>
              <Form.Item
                label="课程封面"
                name="thumb"
                rules={[{ required: true, message: "请上传课程封面!" }]}
              >
                <div className="c-flex">
                  <div className="d-flex">
                    <UploadImageButton
                      onSelected={(url) => {
                        setThumb(url);
                        form.setFieldsValue({ thumb: url });
                      }}
                    ></UploadImageButton>
                  </div>
                  {thumb && (
                    <img
                      className="form-course-thumb mt-10"
                      src={thumb}
                      alt=""
                    />
                  )}
                </div>
              </Form.Item>
              <Form.Item label="显示课程" name="isShow" valuePropName="checked">
                <Switch onChange={onChange} />
              </Form.Item>
              <Form.Item
                label="学员部门"
                name="dep_ids"
                rules={[{ required: true, message: "请选择学员部门!" }]}
              >
                <Cascader
                  options={departments}
                  multiple
                  maxTagCount="responsive"
                  placeholder="请选择学员部门"
                  showCheckedStrategy={SHOW_CHILD}
                />
              </Form.Item>
              <Form.Item
                label="资源分类"
                name="category_ids"
                rules={[{ required: true, message: "请选择资源分类!" }]}
              >
                <Cascader
                  options={categories}
                  multiple
                  maxTagCount="responsive"
                  placeholder="请选择资源分类"
                  showCheckedStrategy={SHOW_CHILD}
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
